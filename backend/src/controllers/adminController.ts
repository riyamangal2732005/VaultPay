import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const createAdmin = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "Admin already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        res.status(201).json({
            success: true,
            admin,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create admin",
        });
    }
};

export const getAdmins = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const admins = await User.find({
            role: "admin",
        }).select("-password");

        res.status(200).json({
            success: true,
            count: admins.length,
            admins,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
        });
    }
};

export const getAdminById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const admin = await User.findOne({
            _id: req.params.id,
            role: "admin",
        }).select("-password");

        if (!admin) {
            res.status(404).json({
                success: false,
                message: "Admin not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            admin,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin",
        });
    }
};
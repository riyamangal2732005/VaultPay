import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const getUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
};

export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user =
            await User.findByIdAndDelete(
                req.params.id
            );

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};
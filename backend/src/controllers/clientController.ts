import { Request, Response } from "express";
import Client from "../models/Client";
import bcrypt from "bcryptjs";
import User from "../models/User";
import mongoose from "mongoose";


export const createClient = async (
    req: Request,
    res: Response
): Promise<void> => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const {
            name,
            email,
            password,
            companyName,
            phone,
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !companyName
        ) {
            await session.abortTransaction();
            session.endSession();

            res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
            return;
        }

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {

            await session.abortTransaction();
            session.endSession();

            res.status(400).json({
                success: false,
                message: "A user with this email already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const users = await User.create(
            [{
                name,
                email,
                password: hashedPassword,
                role: "client",
            }],
            { session }
        );

        const user = users[0];

        const clients = await Client.create(
            [{
                userId: user._id,
                name,
                email,
                companyName,
                phone,
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            client: clients[0],
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create client",
        });
    }
};
export const getClients = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const clients = await Client.find();

        res.status(200).json({
            success: true,
            count: clients.length,
            clients,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch clients",
        });
    }
};

export const getClientById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            client,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch client",
        });
    }
};
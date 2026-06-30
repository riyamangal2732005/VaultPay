import { Request, Response } from "express";
import Client from "../models/Client";
import Invoice from "../models/Invoice";

export const getDashboardStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const totalClients = await Client.countDocuments();

        const totalInvoices = await Invoice.countDocuments();

        const paidInvoices = await Invoice.countDocuments({
            status: "paid",
        });

        const pendingInvoices = await Invoice.countDocuments({
            status: "pending",
        });

        const revenueResult = await Invoice.aggregate([
            {
                $match: {
                    status: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        const overdueInvoices = 
            await Invoice.countDocuments({
                status: "overdue",
            });
        const recentInvoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("clientId", "name companyName");
        res.status(200).json({
            success: true,
            stats: {
                totalClients,
                totalInvoices,
                paidInvoices,
                pendingInvoices,
                overdueInvoices,
                totalRevenue,
            },
            recentInvoices,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
        });
    }
};
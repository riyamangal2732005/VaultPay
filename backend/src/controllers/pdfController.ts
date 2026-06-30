import { Request, Response } from "express";
import { generateInvoicePDFFile } from "../utils/generateInvoicePDF";
import Invoice from "../models/Invoice";
import Client from "../models/Client";

export const generateInvoicePDF = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const invoice = await Invoice.findById(
            req.params.id
        ).populate("clientId");

        if (!invoice) {
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }

        const client = invoice.clientId as any;

        const filePath = await generateInvoicePDFFile(
            invoice,
            client
        );

        invoice.pdfPath = filePath;

        await invoice.save();

        res.download(filePath);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
        });
    }
};

export const generateMyInvoicePDF = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const authReq = req as Request & {
            user?: {
                userId: string;
                role: string;
            };
        };

        const userId = authReq.user?.userId;

        const client = await Client.findOne({
            userId,
        });

        if (!client) {
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }

        const invoice = await Invoice.findOne({
            _id: req.params.id,
            clientId: client._id,
        }).populate("clientId");

        if (!invoice) {
            res.status(404).json({
                success: false,
                message:
                    "Invoice not found or access denied",
            });
            return;
        }

        const populatedClient = invoice.clientId as any;

        const filePath = await generateInvoicePDFFile(
            invoice,
            populatedClient
        );

        invoice.pdfPath = filePath;

        await invoice.save();

        res.download(filePath);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to download PDF",
        });
    }
};
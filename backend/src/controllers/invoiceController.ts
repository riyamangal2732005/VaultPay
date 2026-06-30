import { Request, Response} from "express";
import Invoice from "../models/Invoice";
import Client from "../models/Client";
import stripe from "../config/stripe";
// import {toast} from "sonner";

export const createInvoice = async(
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const{
            invoiceNumber,
            clientId,
            amount,
            description,
            dueDate,
        } = req.body;

        if(!invoiceNumber ||
            !clientId ||
            !amount ||
            !description ||
            !dueDate
        ){
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const client = await Client.findById(clientId);
        if(!client){
            res.status(404).json({
                success: false,
                message: "Client not found",
            });
            return;
        }
        const existingInvoice = await Invoice.findOne({
            invoiceNumber,
        });

        if(existingInvoice){
            res.status(400).json({
                success: false,
                message: "Invoice already exists",
            });
            return;
        }

        const invoice = await Invoice.create({
            invoiceNumber,
            clientId,
            amount,
            description,
            dueDate,
        });

        res.status(201).json({
            success:true,
            invoice,
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create invoice",
        });
    }
};

export const getInvoices = async(
    req: Request,
    res: Response
): Promise<void> => {
    try{
        await Invoice.updateMany(
        {
            status: "pending",
            dueDate: { $lt: new Date() },
        },
        {
            status: "overdue",
        }
    );

    const invoices = await Invoice.find().populate(
        "clientId",
        "name email"
    );

    res.status(200).json({
            success: true,
            count: invoices.length,
            invoices,
    });

    } catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch invoices",
        });
    }
};

export const getInvoiceById = async(
    req:Request,
    res: Response
): Promise<void> => {
    try{
        const invoice = await Invoice.findById(
            req.params.id
        ).populate("clientId", "name email");

        if(!invoice){
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }
        res.status(200).json({
            success:true,
            invoice,
        });
    } catch(error){
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch invoice",
        });
    }
};

export const updateInvoice = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!invoice) {
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            invoice,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update invoice",
        });
    }
};

export const updateInvoiceStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { status } = req.body;

        if(!["pending", "paid", "overdue"].includes(status)){
            res.status(400).json({
                success: false,
                message: "Invalid status. Status must be pending, paid or overdue",
            });
            return;
        }

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!invoice) {
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            invoice,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update invoice",
        });
    }
};

export const getMyInvoices = async (
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
                message: "Client profile not found",
            });
            return;
        }
        await Invoice.updateMany(
            {
                status: "pending",
                dueDate: { $lt: new Date()},
            },
            {
                status: "overdue",
            }
        );

        const invoices = await Invoice.find({
            clientId: client._id,
        }).populate(
            "clientId",
            "name email companyName"
        );

        res.status(200).json({
            success: true,
            count: invoices.length,
            invoices,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch invoices",
        });
    }
};
export const getMyInvoiceById = async (
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
                message: "Client profile not found",
            });
            return;
        }

        const invoice = await Invoice.findOne({
            _id: req.params.id,
            clientId: client._id,
        }).populate(
            "clientId",
            "name email companyName"
        );

        if (!invoice) {
            res.status(404).json({
                success: false,
                message:
                    "Invoice not found or access denied",
            });
            return;
        }

        res.status(200).json({
            success: true,
            invoice,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch invoice",
        });
    }
};
export const payInvoice = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }

        if (invoice.status === "paid") {
            res.status(400).json({
                success: false,
                message: "Invoice already paid",
            });
            return;
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "inr",

                        product_data: {
                            name: invoice.invoiceNumber,
                            description:
                            invoice.description || "Invoice Payment",
                        },
                        unit_amount: invoice.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,

            metadata: {
                invoiceId: invoice._id.toString(),
            },
        });
        res.status(200).json({
            success:true,
            url: session.url,
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Payment failed",
        });
    }
};
// Stripe

// export const payInvoice = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     try {
//         const invoice = await Invoice.findById(
//             req.params.id
//         );

//         if (!invoice) {
//             res.status(404).json({
//                 success: false,
//                 message: "Invoice not found",
//             });
//             return;
//         }

//         res.status(200).json({
//             success: true,
//             message:
//                 "Stripe integration will start here",
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: "Payment failed",
//         });
//     }
// };
export const deleteInvoice = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const invoice =
            await Invoice.findByIdAndDelete(
                req.params.id
            );

        if (!invoice) {
            res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Invoice deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete invoice",
        });
    }
};
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvoiceDocument extends Document {
    invoiceNumber: string;
    clientId: Types.ObjectId;
    amount: number;
    description: string;
    dueDate: Date;
    status: "pending" | "paid" | "overdue";
    stripeSessionId?: string;
    pdfPath?: string;
}

const invoiceSchema = new Schema<IInvoiceDocument>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },

        clientId: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },
        stripeSessionId: String,

        pdfPath: String,
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model<IInvoiceDocument>(
    "Invoice",
    invoiceSchema
);

export default Invoice;
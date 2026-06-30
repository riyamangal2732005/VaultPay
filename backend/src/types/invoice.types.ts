export interface IInvoice {
    invoiceNumber: string;
    clientId: string;
    amount: number;
    description: string;
    status: "pending" | "paid";
    stripeSessionId?: string;
    pdfPath?: string;
}
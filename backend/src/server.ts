import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import clientRoutes from "./routes/clientRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
console.log("invoiceRoutes = ", invoiceRoutes);
import pdfRoutes from "./routes/pdfRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import userRoutes from "./routes/userRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();
connectDB();

const app = express();

app.use("/api/webhooks", webhookRoutes);
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.status(200).json({
        success:true,
        message: "VaultPay API running"
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

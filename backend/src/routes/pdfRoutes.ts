import express from "express";

import { generateInvoicePDF, generateMyInvoicePDF } from "../controllers/pdfController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
const router = express.Router();

router.get(
    "/:id",
    protect,
    authorize("admin"),
    generateInvoicePDF
);
router.get(
    "/my-invoices/:id",
    protect,
    authorize("client"),
    generateMyInvoicePDF
);

export default router;
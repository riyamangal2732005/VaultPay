
console.log("Invoice Routes Loaded");
import express from "express";

import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    updateInvoiceStatus,
    getMyInvoices,
    getMyInvoiceById,
    payInvoice,
    // payInvoice,
    deleteInvoice,
} from "../controllers/invoiceController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();


router.post(
    "/",
    protect,
    authorize("admin"),
    createInvoice
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getInvoices
);
router.get(
    "/my-invoices",
    protect,
    authorize("client"),
    getMyInvoices
);

router.get(
    "/my-invoices/:id",
    protect,
    authorize("client"),
    getMyInvoiceById
);
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getInvoiceById
);

// Stripe

router.post(
    "/:id/pay",
    payInvoice,
);
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateInvoice
);
router.patch(
    "/:id/status",
    protect,
    authorize("admin"),
    updateInvoiceStatus
);
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteInvoice
);


export default router;
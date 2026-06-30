import express from "express";
import {
    createAdmin,
    getAdmins,
    getAdminById,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    createAdmin
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getAdmins
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getAdminById
);

export default router;
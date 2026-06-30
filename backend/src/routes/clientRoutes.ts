import express from "express";
import {
    createClient,
    getClients,
    getClientById,
} from "../controllers/clientController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    createClient
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getClients
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getClientById
);

export default router;
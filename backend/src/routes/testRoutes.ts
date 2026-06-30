import express from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin Route",
        });
    }
);

router.get(
    "/client",
    protect,
    authorize("client"),
    (req, res) => {
        res.json({
            success: true,
            message: "Client Route",
        });
    }
);

export default router;
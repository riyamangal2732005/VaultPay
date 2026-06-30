import express from "express";

import {
    getUsers,
    createUser,
    deleteUser,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get(
    "/",
    protect,
    authorize("admin"),
    getUsers
);

router.post(
    "/",
    protect,
    authorize("admin"),
    createUser
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteUser
);

export default router;
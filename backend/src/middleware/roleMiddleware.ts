import {Request, Response, NextFunction} from "express";
import User from "../models/User";

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
export const authorize = (...roles: string[]) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): void => {
        if(!req.user) {
            res.status(401).json({
                success: false,
                message: "Not authorized",
            });
            return;
        }

        if(!roles.includes(req.user.role)){
            res.status(403).json({
                success: false,
                message: "Access denied",
            });
            return;
        }
        next();
    };
};
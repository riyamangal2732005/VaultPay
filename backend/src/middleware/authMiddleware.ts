import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface AuthPayload{
    userId: string;
    role: string;
}

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({
            success: false,
            message: "Not authorized, token missing",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("TOKEN =", token);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthPayload;

        req.user = decoded;

        next();
    } catch(error){
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
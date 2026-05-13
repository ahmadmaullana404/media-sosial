import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_hub_social';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
        username: string;
    };
}

/**
 * Middleware untuk memverifikasi token JWT
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token tidak ditemukan.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string; username: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah kadaluarsa.'
        });
    }
};

/**
 * Middleware untuk mengecek role admin
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya untuk Admin.'
        });
    }
};

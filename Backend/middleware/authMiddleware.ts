import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';



// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret not configured.' });
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;
        if (typeof decoded === 'string') {
            return res.status(401).json({ message: 'Token is not valid.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' });
        }
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
        }
        next();
    };
}; 
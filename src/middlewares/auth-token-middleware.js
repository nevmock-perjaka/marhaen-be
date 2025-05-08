import statusCodes from '../errors/status-codes.js';
import BaseError from '../base_classes/base-error.js';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const authToken = async (req, res, next) => {
   const authHeader = req.get('Authorization');

   const token = authHeader && authHeader.split(' ')[1];

    if (token == null)
        throw new BaseError(
            401,
            statusCodes.UNAUTHORIZED.message,
            'UNAUTHORIZED',
            'User Have Not Login',
        );

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    
        const user = await db.user.findUnique({
            where: { id: decoded.id },
        });
    
        if (!user) {
            return next(
                new BaseError(
                    403,
                    statusCodes.FORBIDDEN.message,
                    'FORBIDDEN',
                    'User Not Found'
                )
            );
        }
    
        // ✅ simpan user ke req
        req.user = user;
    
        next();
        } catch (err) {
        if (err.message === 'invalid signature') {
            return next(
                new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Invalid Signature')
            );
        } else if (err.message === 'invalid token') {
            return next(
                new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Invalid Token')
            );
        } else if (err.message === 'jwt expired') {
            return next(
                new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Token Expired')
            );
        } else {
            return next(
                new BaseError(
                    403,
                    statusCodes.FORBIDDEN.message,
                    'FORBIDDEN',
                    'Token Is Invalid Or No Longer Valid'
                )
            );
        }
        }
};

export default authToken;
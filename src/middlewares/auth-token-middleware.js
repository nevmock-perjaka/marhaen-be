// middlewares/auth-middleware.js
import statusCodes from '../errors/status-codes.js';
import BaseError from '../base_classes/base-error.js';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

class AuthMiddleware {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || '';
    }

    authenticate = async (req, res, next) => {
        const authHeader = req.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(
                new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'User Have Not Login')
            );
        }

        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);

            if (!decoded || !decoded.id) {
                return next(
                    new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'Invalid Token')
                );
            }

            if (decoded.type !== 'access') {
                return next(
                    new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'Invalid Token Type')
                );
            }

            const user = await db.user.findUnique({
                where: { 
                    id: decoded.id 
                },
                include: {
                    profiles: true
                }
            });

            if (!user) {
                return next(
                    new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'User Not Found')
                );
            }

            if (user.is_banned){
                return next(
                    new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'User Is Banned')
                );
            }

            req.user = user;

            if (decoded.profile_id){
                const profile = user.profiles.find(p => p.id === decoded.profile_id);

                if (!profile) {
                    return next(
                        new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Profile Not Found')
                    );
                }

                req.profile = profile;
            }

            next();
        } catch (err) {
            let message = 'Token Is Invalid Or No Longer Valid';
            if (err.message === 'invalid signature') message = 'Invalid Signature';
            if (err.message === 'invalid token') message = 'Invalid Token';
            if (err.message === 'jwt expired') message = 'Token Expired';

            return next(
                new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', message)
            );
        }
    };

    authorizeSubscription = (...plans) => {
        return (req, res, next) => {
            const user = req.user;

            if (!user) {
                return next(
                    new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'User Not Authenticated')
                );
            }

            if (!plans.includes(user.subscription.plan)) {
                return next(
                    new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Access Denied')
                );
            }

            next();
        };
    }

    authenticateProfile = (req, res, next) => {
        const user = req.user;
        const profile = req.profile;

        if (!user) {
            return next(
                new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'User Not Authenticated')
            );
        }

        if (!profile) {
            return next(
                new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Wrong Token, Profile Not Found')
            );
        }

        next();
    };

    authorizeRoles = (roles) => {
        // OWNER
        // STAFF
        // CASHIER
        return (req, res, next) => {
            const user = req.user;
            const profile = req.profile;

            console.log(profile.role);
            if (!user) {
                return next(
                    new BaseError(401, statusCodes.UNAUTHORIZED.message, 'UNAUTHORIZED', 'User Not Authenticated')
                );
            }

            if (!profile) {
                return next(
                    new BaseError(401, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Invalid Token')
                );
            }

            if (!roles.includes(profile.role)) {
                return next(
                    new BaseError(403, statusCodes.FORBIDDEN.message, 'FORBIDDEN', 'Access Denied')
                );
            }            

            next();
        };
    };
}

export default new AuthMiddleware();

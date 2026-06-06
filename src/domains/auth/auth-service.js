import joi from "joi";
import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import { generateVerifEmail } from "../../utils/bodyEmail.js";
import { generateToken, parseJWT } from "../../utils/jwtTokenConfig.js";
import { hashPassword, matchPassword } from "../../utils/passwordConfig.js";
import sendEmail from "../../utils/sendEmail.js";

class AuthService {
    async login(email, password) {
        let user = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            throw BaseError.badRequest("Invalid credentials");   
        }

        const isMatch = await matchPassword(password, user.password);

        if (!isMatch) {
            throw BaseError.badRequest("Invalid credentials");
        }

        if (!user.verified_at){
            const token = generateToken(user.id, "5m");
            const verificationLink = `${process.env.BE_URL}/api/v1/auth/verify/${token}`;
            const emailHtml = generateVerifEmail(verificationLink);

            sendEmail(
                user.email,
                "Verifikasi Email dari Hiji: Omni Ads Channel",
                "Terima kasih telah mendaftar di Marhein! Untuk melanjutkan, silakan verifikasi email Anda dengan mengklik tautan berikut:",
                emailHtml
            );

            throw BaseError.badRequest("Email not verified, Please check your email to verify your account.");
        }

        const accessToken = generateToken({
            id: user.id,
            type: "access"
        }, "1d");

        const refreshToken = generateToken({
            id: user.id,
            type: "refresh"
        }, "365d");

        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async register(data) {
        const emailExist = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (emailExist) {
            let validation = "";
            let stack = [];

            validation += "Email already taken.";

            stack.push({
                message: "Email already taken.",
                path: ["email"]
            });

            throw new joi.ValidationError(validation, stack);
        }

        const otpExist = await db.otp.findFirst({
            where: {
                email: data.email,
                otp_code: data.otp_verification
            }
        })

        if (!otpExist) {
            let validation = "";
            let stack = [];

            validation += "Invalid OTP.";

            stack.push({
                message: "Invalid OTP.",
                path: ["otp_verification"]
            });

            throw new joi.ValidationError(validation, stack);
        }

        if (otpExist.expired_at < new Date()) {
            let validation = "";
            let stack = [];

            validation += "OTP expired.";

            stack.push({
                message: "OTP expired.",
                path: ["otp_verification"]
            });

            throw new joi.ValidationError(validation, stack);
        }

        await db.otp.delete({
            where: {
                id: otpExist.id
            }
        })

        const createdUser = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: await hashPassword(data.password),
                phone_number: data.phone_number,
                verified_at: new Date(),
                profiles: {
                    createMany: {
                        data: [
                            {
                                role: "OWNER"
                            },
                            {
                                role: "STAFF"
                            },
                            {
                                role: "CASHIER"
                            }
                        ]
                    }
                }
            }
        })
        
        if (!createdUser) {
            throw Error("Failed to register");
        }

        const accessToken = generateToken({
            id: createdUser.id,
            type: "access"
        }, "1d");

        const refreshToken = generateToken({
            id: createdUser.id,
            type: "refresh"
        }, "365d");

        return { message: "User register successfully", access_token: accessToken, refresh_token: refreshToken };
    }

    async refreshToken(token) {
        const decoded = parseJWT(token);

        if (!decoded) {
            throw BaseError.unauthorized("Invalid token");
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        if (!user) {
            throw BaseError.notFound("User not found");
        }

        const accessToken = generateToken(user.id, "1d");

        return accessToken;
    }

    async getProfile(id) {
        const user = await db.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone_number: true,
                is_banned: true,
                subs_expired_at: true,
                subs_level: true,
                tax_percentage: true,
                qris_code: true,
                verified_at: true,
                strict_mode: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!user) {
            throw BaseError.notFound("User not found");
        }

        return user;
    }

    async updateProfile(id, data) {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw BaseError.notFound("User not found");
        }

        const updatedUser = await db.user.update({
            where: {
                id: id
            },
            data: data,
            select: {
                id: true,
                name: true,
                email: true,
                phone_number: true,
                is_banned: true,
                subs_expired_at: true,
                subs_level: true,
                tax_percentage: true,
                qris_code: true,
                verified_at: true,
                created_at: true,
                updated_at: true
            }
        });

        return updatedUser;
    }

    async sendOtp(email) {
        const userExist = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if (userExist) {
            let validation = "";
            let stack = [];

            validation += "Email already taken.";

            stack.push({
                message: "Email already taken.",
                path: ["email"]
            });

            throw new joi.ValidationError(validation, stack);
        }

        const { otp, expiresAt } = await this.generateOtp();

        await db.otp.create({
            data: {
                otp_code: otp,
                email: email,
                expired_at: expiresAt
            }
        })

        const emailHtml = generateVerifEmail(otp);

        sendEmail(
            email,
            "Verifikasi Email dari Marhein",
            "Terima kasih telah mendaftar di Marhein! Untuk melanjutkan, silakan verifikasi email Anda dengan otp berikut:",
            emailHtml
        );

        return { message: "OTP sent successfully" };
    }

    async generateOtp(){
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        return { otp, expiresAt };
    }

    async getStrictMode(id) {
        const user = await db.user.findUnique({
            where: {
                id: id
            },
            select: {
                strict_mode: true
            }
        });

        if (!user) {
            throw BaseError.notFound("User not found");
        }

        return user.strict_mode;
    }
}

export default new AuthService();

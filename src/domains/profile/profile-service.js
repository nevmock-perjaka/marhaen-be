import BaseError from "../../base_classes/base-error.js";

import { generateVerifEmail } from "../../utils/bodyEmail.js";
import sendEmail from "../../utils/sendEmail.js";
import joi from "joi";
import db from "../../config/db.js";
import { parseJWT, generateToken } from "../../utils/jwtTokenConfig.js";
import { matchPassword, hashPassword } from "../../utils/passwordConfig.js";

class ProfileService {
    async findMany(user_id) {
        let profiles = await db.profile.findMany({
            where: {
                user_id: user_id,
            }
        });

        profiles = profiles.map(profile => ({
            ...profile,
            pin: !!profile.pin,
        }));

        return profiles;
    }

    async login(user_id, profile_id, pin) {
        const profile = await db.profile.findUnique({
            where: {
                id: profile_id,
                user_id: user_id,
            }
        });

        if (!profile) throw BaseError.badRequest("Profile not found");
        if (profile.pin && profile.pin !== pin) throw BaseError.badRequest("Invalid PIN");
        if (!profile.pin && pin) throw BaseError.badRequest("Profile does not have a PIN set");
        

        const token = generateToken({
            id: user_id,
            profile_id: profile.id,
            type: "access"
        }, "1d");

        return { access_token: token, role: profile.role };
    }

    async getProfile(profile_id) {
        const profile = await db.profile.findFirst({
            where: {
                id: profile_id,
            },
            include: {
                user: {
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
                },
            }
        });

        if (!profile) {
            throw BaseError.notFound("Profile not found");
        }

        return {
            ...profile,
            pin: !!profile.pin,
        };
    }

    async updateProfilePin(userId, data) {
        const profile = await db.profile.findUnique({
            where: {
                id: data.profile_id,
            }
        });

        if (!profile) throw BaseError.notFound("Profile not found");
        if (profile.user_id !== userId) throw BaseError.forbidden("You are not allowed to access this profile.");

        // Validasi jika PIN sudah diset di DB
        if (profile.pin) {
            if (!data.old_pin) throw BaseError.badRequest("Old PIN is required to update PIN");
            if (profile.pin !== data.old_pin) throw BaseError.badRequest("Old PIN is incorrect");
        } else {
            // Jika profile belum punya PIN tapi user malah kirim old_pin
            if (data.old_pin) throw BaseError.badRequest("Profile does not have a PIN set");
        }

        const updated = await db.profile.update({
            where: {
                id: data.profile_id,
            },
            data: {
                pin: data.new_pin,
            }
        });

        return updated;
    }

    async resetPin(userId, data) {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!await matchPassword(data.current_password, user.password)) {
            throw BaseError.badRequest("Current password is incorrect");
        }

        const profile = await db.profile.findUnique({
            where: {
                id: data.profile_id,
            }
        });

        if (!profile) throw BaseError.notFound("Profile not found");
        if (profile.user_id !== userId) throw BaseError.forbidden("You are not allowed to access this profile.");

        await db.profile.update({
            where: {
                id: profile.id,
            },
            data: {
                pin: null,
            }
        });

        return { message: "PIN reset successfully." };
    }

    async changePassword(userId, data) {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!user) throw BaseError.notFound("User not found");

        if (!await matchPassword(data.current_password, user.password)) {
            throw BaseError.badRequest("Current password is incorrect");
        }

        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                password: await hashPassword(data.new_password),
            }
        });

        return { message: "Password updated successfully." };
    }

    async resetAccount(userId) {
        return db.$transaction(async (tx) => {
            await tx.profile.updateMany({
                where: {
                    user_id: userId,
                },
                data: {
                    pin: null
                }
            });

            

            await tx.staff_log.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.order.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.staff.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.product.deleteMany({
                where: {
                    owned_by: userId
                }
            })

            await tx.input_history.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.inventory.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.supplier.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.discount.deleteMany({
                where: {
                    owned_by: userId
                }
            });

            await tx.table.deleteMany({
                where: {
                    owned_by: userId
                }
            });
        })
    }

    async updateQrisCode(userId, qrisCode) {
        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw BaseError.notFound("User not found");

        const updated = await db.user.update({
            where: { id: userId },
            data: {
                qris_code: qrisCode
            }
        });

        return {
            message: "QRIS code updated successfully",
            qris_code_set: !!updated.qris_code
        };
    }
}

export default new ProfileService();
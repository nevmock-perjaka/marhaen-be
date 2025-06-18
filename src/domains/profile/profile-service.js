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

        return token;
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
        if (data.old_pin && !profile.pin) throw BaseError.badRequest("Profile does not have a PIN set");
        if (profile.pin && !data.old_pin) throw BaseError.badRequest("Old PIN is required to update PIN");
        console.log(profile.pin);

        console.log(profile.pin === data.old_pin);
        // if (profile.pin && profile.pin !== data.old_pin) throw BaseError.badRequest("Old PIN is incorrect");

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
}

export default new ProfileService();
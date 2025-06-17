import BaseError from "../../base_classes/base-error.js";

import { generateVerifEmail } from "../../utils/bodyEmail.js";
import sendEmail from "../../utils/sendEmail.js";
import joi, { when } from "joi";
import db from "../../config/db.js";
import { parseJWT, generateToken } from "../../utils/jwtTokenConfig.js";
import { matchPassword, hashPassword } from "../../utils/passwordConfig.js";

class MidtransService {
    async getMidtransConfig(user_id) {
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

    async updateMidtransConfig(user_id, value) {
        const isConfigExists = await db.midtrans_user.findUnique({
            where: {
                user_id: user_id,
            }
        })

        if (!isConfigExists) {
            const created = await db.midtrans_user.create({
                data: {
                    user_id: user_id,
                    created_by: value.updated_by,
                    ...value,
                }
            });

            return created;
        }

        const updated = await db.midtrans_user.update({
            where: {
                user_id: user_id,
            },
            data: {
                ...value,
            }
        });

        return updated;
    }
}

export default new MidtransService();
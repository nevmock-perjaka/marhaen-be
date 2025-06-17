import db from "../../../../config/db.js";
import { decrypt, encrypt } from "../../../../utils/hash.js";

class MidtransService {
    async getMidtransConfig(user_id) {
        let config = await db.midtrans_User.findUnique({
            where: {
                user_id: user_id,
            },
            select: {
                user_id: true,
                client_key: true,
                secret_key: true,
                is_production: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true,
            }
        });

        if (!config){
            config = {
                user_id: user_id,
                client_key: null,
                server_key: null,
                is_production: null,
                created_at: null,
                updated_at: null,
                created_by: null,
                updated_by: null,
            }
        }

        return config;
    }

    async updateMidtransConfig(user_id, value) {
        const isConfigExists = await db.midtrans_User.findUnique({
            where: {
                user_id: user_id,
            }
        })

        value.secret_key = encrypt(value.secret_key);
        value.client_key = encrypt(value.client_key);

        if (!isConfigExists) {
            const created = await db.midtrans_User.create({
                data: {
                    user_id: user_id,
                    created_by: value.updated_by,
                    ...value,
                }
            });

            return created;
        }

        const updated = await db.midtrans_User.update({
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
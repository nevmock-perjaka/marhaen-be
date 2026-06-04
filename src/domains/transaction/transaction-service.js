import subscriptionService from "./subscription/subscription-service.js";

import crypto from "crypto";

class TransactionServices {
    async notificationSnap(data) {
        const hash = crypto.createHash('sha512').update(`${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
        console.log("Response Midtrans : ", data);

        if (data.signature_key === hash){
            if (!data.metadata){
                return true;
            }

            if (data.metadata.type == 'subscription'){
                return await subscriptionService.updateSubscriptionTransaction(data);
            }
        }

        return true;
    }  
}

export default new TransactionServices();

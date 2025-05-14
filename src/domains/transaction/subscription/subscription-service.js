import BaseError from '../../../base_classes/base-error.js';
import db from '../../../config/db.js';
import { midtransSnap } from '../../../config/midtrans.js';

class SubscriptionService {
    async createSnap(plan_id, user) {
        return db.$transaction(async (tx) => {
            const plan = await tx.plan.findUnique({
                where: {
                    id: plan_id
                }
            });

            if (!plan) {
                throw new BaseError.badRequest("Plan not found");
            }

            const subscription_transaction = await tx.subscriptionTransaction.create({
                data: {
                    user_id: user.id,
                    level: plan.level,
                    days: plan.days,
                }
            });

            if (!subscription_transaction) {
                throw new BaseError.badRequest("Failed to create subscription transaction");
            }

            const parameter = {
                transaction_details: {
                    order_id: subscription_transaction.id,
                    gross_amount: plan.price + Math.ceil(plan.price * 0.007),
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: user.name,
                    email: user.email,
                    phone: user.phone_number,
                },
                enabled_payments: [
                    'other_qris',
                    'bank_transfer'
                ],
                item_details: [
                    {
                        id: plan.id,
                        price: plan.price,
                        quantity: 1,
                        name: `${plan.name} ${plan.days} Days`,
                    },
                    {
                        id: 'admin_fee',
                        price: Math.ceil(plan.price * 0.007),
                        quantity: 1,
                        name: 'Transaction Fee',
                    }
                ],   
                metadata: {
                    "type": "subscription",
                    "id": subscription_transaction.id,
                }
            };

            const snap = midtransSnap.createTransaction(parameter);

            if (!snap) {
                throw new Error("Failed to create snap");
            }

            await tx.subscriptionTransaction.update({
                where: {
                    id: subscription_transaction.id
                },
                data: {
                    transaction_token: snap.token,
                    redirect_url: snap.redirect_url,
                    gross_amount: plan.price + Math.ceil(plan.price * 0.007),
                    admin_fee: Math.ceil(plan.price * 0.007),
                }
            })

            return snap;
        })
    }

    async updateSubscriptionTransaction(data){
        const subscription_transaction = await db.subscriptionTransaction.findUnique({
            where: {
                id: data.metadata.id
            }
        })
        console.log(`Transaction notification received. Order ID: ${data.order_id}. Transaction status: ${data.transaction_status}. Fraud status: ${data.fraud_status}`);

        if (!subscription_transaction) {
            throw new BaseError.badRequest("Subscription transaction not found");
        }

        if (data.transaction_status === 'capture') {
            if (data.fraud_status === 'accept'){
                await db.subscriptionTransaction.update({
                    where: {
                        id: subscription_transaction.id
                    },
                    data: {
                        status: data.transaction_status,
                    }
                });

                const user = await db.user.findUnique({
                    where: {
                        id: subscription_transaction.user_id
                    }
                })

                const new_expired_date = () => {
                    const now = new Date();
                    const daysToMs = subscription_transaction.days * 24 * 60 * 60 * 1000;

                    if (user.subs_expired_at === null || new Date(user.subs_expired_at) <= now) {
                        return new Date(now.getTime() + daysToMs);
                    } else {
                        return new Date(new Date(user.subs_expired_at).getTime() + daysToMs);
                    }
                };

                await db.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        subs_level: subscription_transaction.level,
                        subs_expired_at: new_expired_date(),
                    }
                })
            }
        } else if (data.transaction_status === 'settlement') {
            await db.subscriptionTransaction.update({
                where: {
                    id: subscription_transaction.id
                },
                data: {
                    status: data.transaction_status,
                } 
            });
            const user = await db.user.findUnique({
                where: {
                    id: subscription_transaction.user_id
                }
            })

            const new_expired_date = () => {
                const now = new Date();
                const daysToMs = subscription_transaction.days * 24 * 60 * 60 * 1000;

                if (user.subs_expired_at === null || new Date(user.subs_expired_at) <= now) {
                    return new Date(now.getTime() + daysToMs);
                } else {
                    return new Date(new Date(user.subs_expired_at).getTime() + daysToMs);
                }
            };

            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    subs_level: subscription_transaction.level,
                    subs_expired_at: new_expired_date(),
                }
            })

        } else if (data.transaction_status === 'cancel' || data.transaction_status === 'deny' || data.transaction_status === 'expire') {
            await db.subscriptionTransaction.update({
                where: {
                    id: subscription_transaction.id
                },
                data: {
                    status: data.transaction_status,
                } 
            });

        } else if (data.transaction_status === 'pending') {
            await db.subscriptionTransaction.update({
                where: {
                    id: subscription_transaction.id
                },
                data: {
                    order_id: data.transaction_id,
                    status: data.transaction_status,
                    payment_method: data.payment_type,
                } 
            });
        }

        return true;
    }
}

export default new SubscriptionService();
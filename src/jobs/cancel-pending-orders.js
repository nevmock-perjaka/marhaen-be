import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cancelPendingOrdersJob(timeoutMinutes = 15) {
    try {
        const now = new Date();
        const timeoutDate = new Date(now.getTime() - timeoutMinutes * 60000);

        console.log(`[CancelPendingOrders] Running job at ${now.toISOString()} (timeout: ${timeoutMinutes}min)`);

        const pendingOrders = await prisma.order.findMany({
            where: {
                status: 'Pending Payment',
                payment_method: 'Manual QRIS',
                created_at: {
                    lt: timeoutDate,
                },
            },
            include: {
                Order_item: true,
            },
        });

        if (pendingOrders.length === 0) {
            console.log('[CancelPendingOrders] No pending orders to cancel');
            return;
        }

        console.log(`[CancelPendingOrders] Found ${pendingOrders.length} pending orders to cancel`);

        for (const order of pendingOrders) {
            try {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: 'Canceled',
                        canceled_at: new Date(),
                        cancellation_reason: 'Auto-canceled: Payment not confirmed within timeout',
                    },
                });

                console.log(`[CancelPendingOrders] Canceled order ${order.id}`);
            } catch (err) {
                console.error(`[CancelPendingOrders] Error processing order ${order.id}:`, err.message);
            }
        }

        console.log(
            `[CancelPendingOrders] Job completed: Canceled ${pendingOrders.length} orders`
        );
    } catch (err) {
        console.error('[CancelPendingOrders] Job failed:', err);
    }
}

export function startCancelPendingOrdersScheduler(intervalMinutes = 5, timeoutMinutes = 15) {
    console.log(
        `[CancelPendingOrders] Scheduler started - runs every ${intervalMinutes} minute(s), cancels orders older than ${timeoutMinutes} minute(s)`
    );

    cancelPendingOrdersJob(timeoutMinutes);

    setInterval(() => {
        cancelPendingOrdersJob(timeoutMinutes);
    }, intervalMinutes * 60000);
}

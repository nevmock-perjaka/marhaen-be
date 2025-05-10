import db from '../../config/db.js';
import BaseError from '../../base_classes/base-error.js';

class PlanService {
    async getAll(){
        const [ data, total ] = await Promise.all([
            db.plan.findMany(),
            db.plan.count()
        ])

        return { data, total };
    }

    async getById(id){
        const plan = await db.plan.findUnique({
            where: {
                id
            }
        });

        if (!plan){
            throw BaseError.notFound("Plan Not Found")
        }

        return plan;
    }

    async create({ name, days, price, level }) {
        const plan = db.plan.create({
            data: {
                name,
                days,
                price,
                level,
                is_active: false,
            }
        });

        if (!plan){
            throw new Error("Failed to create plan");
        }    

        return plan;
    }

    async update(id, data){
        const planExists = await db.plan.findUnique({
            where: { id }
        });

        if (!planExists) {
            throw new BaseError.notFound("Plan not found");
        }

        const updatedPlan = await db.plan.update({
            where: { 
                id 
            },
            data
        });

        if (!updatedPlan){
            throw new Error("Failed to update plan");
        }

        return updatedPlan;
    }

    async deleteById(id){
        return await db.plan.delete({
            where: {
                id
            }
        });
    }
}

export default new PlanService();
import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";

class EmployeeService {
    async getAll() {
        return await db.employee.findMany({
            include: {
                user: true,
                shift: true
            }
        });
    }

    async getById(id) {
        const employee = await db.employee.findUnique({
            where: { id },
            include: {
                user: true,
                shift: true
            }
        });

        if (!employee) {
            throw BaseError.notFound("Employee not found");
        }

        return employee;
    }

    async create(data) {
        const created = await db.employee.create({ data });
    
        if (!created) {
            throw BaseError.badRequest("Failed to create employee");
        }
    
        return {
            message: "Employee created successfully",
            data: created
        };
    }
    
    async update(id, data) {
        const existing = await db.employee.findUnique({ 
            where: { id } 
        });
    
        if (!existing) {
            throw BaseError.notFound("Employee not found");
        }
    
        const updated = await db.employee.update({ 
            where: { id },
            data 
        });
    
        if (!updated) {
            throw BaseError.badRequest("Failed to update employee");
        }
    
        return {
            message: "Employee updated successfully",
            data: updated
        };
    }    

    async delete(id) {
        const existing = await db.employee.findUnique({ 
            where: { id } 
        });

        if (!existing) {
            throw BaseError.notFound("Employee not found");
        }

        const deleted = await db.employee.delete({ 
            where: { id } 
        });

        if (!deleted) {
            throw BaseError.badRequest("Failed to delete employee");
        }

        return {
            message: "Employee deleted successfully",
            data: deleted
        };
    }
}

export default new EmployeeService();

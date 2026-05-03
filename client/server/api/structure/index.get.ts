import { Sectie, Salon, Pat } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const sectii = await Sectie.findAll({
            include: [
                { 
                    model: Salon,
                    include: [{ model: Pat }]
                }
            ]
        });
        return sectii;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

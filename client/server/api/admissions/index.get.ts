import { Internare, Patient, Pat, Salon, Sectie } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const internari = await Internare.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: Patient },
                { model: Pat, include: [{ model: Salon, include: [{ model: Sectie }] }] }
            ]
        });
        return internari;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

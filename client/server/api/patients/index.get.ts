import { Patient } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const patients = await Patient.findAll({ order: [['createdAt', 'DESC']] });
        return patients;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

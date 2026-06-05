import { Sectie, Salon, Pat, Internare, Patient } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const sectii = await Sectie.findAll({
            include: [
                {
                    model: Salon,
                    include: [
                        {
                            model: Pat,
                            include: [
                                {
                                    model: Internare,
                                    required: false,
                                    include: [{ model: Patient }]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return sectii;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

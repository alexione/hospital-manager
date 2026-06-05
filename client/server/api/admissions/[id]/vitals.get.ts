import { Masuratori } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        
        // Fetch all vital signs logs for this admission
        const vitals = await Masuratori.findAll({
            where: { id_internare: id },
            order: [['data_masurare', 'DESC']]
        });

        return vitals;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

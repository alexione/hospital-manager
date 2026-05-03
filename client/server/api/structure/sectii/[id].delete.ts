import { Sectie } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        await Sectie.destroy({ where: { id } });
        return { message: 'Deleted' };
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});

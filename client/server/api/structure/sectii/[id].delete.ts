import { Sectie } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Acces interzis! Doar administratorii pot modifica structura.' });
        }

        const id = getRouterParam(event, 'id');
        await Sectie.destroy({ where: { id } });
        return { message: 'Deleted' };
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 400, statusMessage: err.statusMessage || err.message });
    }
});

import { Pat } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { cod_pat, id_salon } = body;
        const newPat = await Pat.create({ cod_pat, id_salon });
        return newPat;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});

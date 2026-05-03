import { Sectie } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { nume, cod_sectie } = body;
        const newSectie = await Sectie.create({ nume, cod_sectie });
        return newSectie;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});

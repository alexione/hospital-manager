import { Patient } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: "Doar adminii pot șterge pacienți!" });
        }

        const id = getRouterParam(event, 'id');
        const patient = await Patient.findByPk(id);
        if (!patient) {
            throw createError({ statusCode: 404, statusMessage: "Pacientul nu există" });
        }

        await patient.destroy();
        return { message: "Pacient șters cu succes" };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

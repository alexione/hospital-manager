import { Tratament, Administrare } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        
        // Fetch all treatments for this admission, including their administration logs
        const treatments = await Tratament.findAll({
            where: { id_internare: id },
            include: [{
                model: Administrare,
                as: 'Administrares' // Sequelize pluralizes the association to Administrares
            }],
            order: [
                ['data_tratament', 'DESC'],
                [{ model: Administrare, as: 'Administrares' }, 'data_administrare', 'DESC']
            ]
        });

        return treatments;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

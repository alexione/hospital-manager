import { Patient, Internare, Pat, Salon, Sectie } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const total = await Patient.count();
        const internati = await Internare.count({ where: { status: 'internat' } });
        const urgente = await Internare.count({ where: { status: 'urgență' } });
        
        const recentiRaw = await Internare.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Patient },
                { 
                    model: Pat,
                    include: [{ model: Salon, include: [{ model: Sectie }] }] 
                }
            ]
        });

        const recenti = recentiRaw.map((int: any) => ({
            id: int.id,
            firstName: int.Patient.firstName,
            lastName: int.Patient.lastName,
            diagnosis: int.diagnostic,
            status: int.status,
            salon: int.Pat ? `${int.Pat.Salon.Sectie.nume} - ${int.Pat.Salon.cod_salon} (Pat ${int.Pat.cod_pat})` : 'Nealocat'
        }));

        return {
            total,
            internati,
            urgente,
            recenti
        };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

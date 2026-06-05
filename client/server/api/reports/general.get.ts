import { Patient, Internare, Pat, Salon, Sectie, Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        // 1. Contorizări generale
        const totalPacienti = await Patient.count();
        const totalInternati = await Internare.count({ where: { status: 'internat' } });
        const totalAngajati = await Angajat.count();
        const totalPaturi = await Pat.count();
        
        // 2. Calcul ocupare paturi generale
        const paturiOcupateCount = await Internare.count({ 
            where: { status: 'internat' } 
        });

        // 3. Obținere statistici detaliate pe secții
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
                                    where: { status: 'internat' },
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const sectiiStats = sectii.map((sec: any) => {
            let totalSaloane = sec.Salons ? sec.Salons.length : 0;
            let totalPaturi = 0;
            let paturiOcupate = 0;

            if (sec.Salons) {
                for (const sal of sec.Salons) {
                    if (sal.Pats) {
                        totalPaturi += sal.Pats.length;
                        for (const pat of sal.Pats) {
                            if (pat.Internares && pat.Internares.length > 0) {
                                paturiOcupate += 1;
                            }
                        }
                    }
                }
            }

            return {
                id: sec.id,
                nume: sec.nume,
                cod_sectie: sec.cod_sectie,
                total_saloane: totalSaloane,
                total_paturi: totalPaturi,
                paturi_ocupate: paturiOcupate,
                grad_ocupare: totalPaturi > 0 ? Math.round((paturiOcupate / totalPaturi) * 100) : 0
            };
        });

        // 4. Lista completă a pacienților internați în prezent (pentru raportul detaliat)
        const internariActiveRaw = await Internare.findAll({
            where: { status: 'internat' },
            include: [
                { model: Patient },
                { 
                    model: Pat, 
                    include: [{ model: Salon, include: [{ model: Sectie }] }] 
                }
            ],
            order: [['data_internare', 'DESC']]
        });

        const internariActive = internariActiveRaw.map((int: any) => ({
            id: int.id,
            cod_internare: int.cod_internare,
            data_internare: int.data_internare,
            diagnostic: int.diagnostic,
            status: int.status,
            pacient: int.Patient ? {
                id: int.Patient.id,
                firstName: int.Patient.firstName,
                lastName: int.Patient.lastName,
                cnp: int.Patient.cnp
            } : null,
            pat: int.Pat ? {
                id: int.Pat.id,
                cod_pat: int.Pat.cod_pat,
                salon: int.Pat.Salon ? int.Pat.Salon.cod_salon : 'N/A',
                sectie: int.Pat.Salon && int.Pat.Salon.Sectie ? int.Pat.Salon.Sectie.nume : 'N/A'
            } : null
        }));

        return {
            totalPacienti,
            totalInternati,
            totalAngajati,
            totalPaturi,
            paturiOcupateCount,
            sectiiStats,
            internariActive
        };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

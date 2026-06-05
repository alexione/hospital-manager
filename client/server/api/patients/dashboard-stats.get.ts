import { Patient, Internare, Pat, Salon, Sectie } from '../../models';

function parseCNP(cnp: string) {
    if (!cnp || cnp.length !== 13 || !/^\d+$/.test(cnp)) {
        return { sex: 'Necunoscut', age: 0 };
    }

    const s = parseInt(cnp.charAt(0));
    let yearPrefix = 1900;
    let sex = 'Necunoscut';

    if (s === 1 || s === 2) {
        yearPrefix = 1900;
        sex = s === 1 ? 'Masculin' : 'Feminin';
    } else if (s === 5 || s === 6) {
        yearPrefix = 2000;
        sex = s === 5 ? 'Masculin' : 'Feminin';
    } else if (s === 3 || s === 4) {
        yearPrefix = 1800;
        sex = s === 3 ? 'Masculin' : 'Feminin';
    }

    const yy = parseInt(cnp.substring(1, 3));
    const mm = parseInt(cnp.substring(3, 5)) - 1; // 0-indexed month
    const dd = parseInt(cnp.substring(5, 7));

    const birthYear = yearPrefix + yy;
    const birthDate = new Date(birthYear, mm, dd);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return { sex, age };
}

export default defineEventHandler(async (event) => {
    try {
        const total = await Patient.count();
        const internati = await Internare.count({ where: { status: 'internat' } });
        
        // Fetch all patient CNPs to build demographic statistics
        const patients = await Patient.findAll({ attributes: ['cnp'] });
        const ageDist = {
            '0-18': 0,
            '19-35': 0,
            '36-60': 0,
            '60+': 0
        };
        const sexDist = {
            'Masculin': 0,
            'Feminin': 0,
            'Necunoscut': 0
        };

        for (const p of patients) {
            const { sex, age } = parseCNP((p as any).cnp || '');
            sexDist[sex as keyof typeof sexDist] = (sexDist[sex as keyof typeof sexDist] || 0) + 1;
            
            if (age <= 18) {
                ageDist['0-18']++;
            } else if (age <= 35) {
                ageDist['19-35']++;
            } else if (age <= 60) {
                ageDist['36-60']++;
            } else {
                ageDist['60+']++;
            }
        }

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
            recenti,
            demographics: {
                ageDist,
                sexDist
            }
        };
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

import { Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const angajat = await Angajat.findByPk(id);
        
        if (!angajat) {
            throw createError({ statusCode: 404, statusMessage: 'Angajat nu a fost găsit' });
        }

        const body = await readBody(event);
        
        // Nu permitem modificarea parolei aici, doar a rolului sau numelui
        if (body.password) delete body.password;
        
        await angajat.update(body);
        
        // Ascundem parola înainte de a returna obiectul
        const updatedAngajat = angajat.toJSON();
        delete updatedAngajat.password;
        
        return updatedAngajat;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});

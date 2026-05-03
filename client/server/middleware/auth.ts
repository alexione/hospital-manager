import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
    const url = getRequestURL(event);
    if (!url.pathname.startsWith('/api') || url.pathname.startsWith('/api/auth')) {
        return;
    }

    const authHeader = getHeader(event, 'authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({ statusCode: 401, statusMessage: "No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Invalid token format." });
    }
    const secret = process.env.JWT_SECRET || 'cheia_mea_secreta_super_lunga';

    try {
        const decoded = jwt.verify(token, secret as string);
        event.context.user = decoded;
    } catch (err) {
        throw createError({ statusCode: 401, statusMessage: "Invalid token." });
    }
});

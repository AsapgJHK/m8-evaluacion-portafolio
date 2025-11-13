const { verifyToken } = require('../utils/jwt.utils');


exports.protect = (checkOwnership = true) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o formato incorrecto.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; 
        
        
        if (checkOwnership && req.params.id && req.user.id !== parseInt(req.params.id)) {
            
            return res.status(403).json({ error: 'Prohibido. No tienes permiso para acceder a este perfil.' }); 
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
             return res.status(401).json({ error: 'Token expirado. Por favor, solicite un nuevo token.' });
        }
        return res.status(401).json({ error: 'Token inválido.' });
    }
};
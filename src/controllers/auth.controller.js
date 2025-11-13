const UserModel = require('../models/user.model');
const { generateTokens, verifyToken } = require('../utils/jwt.utils');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.login(username, password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    
    
    const { accessToken, refreshToken } = generateTokens({ id: user.id, username: user.username });

    res.status(200).json({ 
        message: 'Login exitoso.', 
        accessToken, 
        refreshToken 
    });
};


exports.refresh = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token requerido.' });
    }

    try {
        
        const decoded = verifyToken(refreshToken);
        
        
        const { accessToken } = generateTokens({ id: decoded.id, username: decoded.username });

        res.status(200).json({
            message: 'Token de acceso renovado exitosamente.',
            accessToken,
            
        });

    } catch (err) {
        
        return res.status(401).json({ error: 'Refresh token inválido o expirado. Vuelva a iniciar sesión.' });
    }
};
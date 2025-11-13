const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const ACCESS_EXP = '15m'; 
const REFRESH_EXP = '7d';  

exports.generateTokens = (payload) => {
    
    const accessToken = jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXP });
    
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXP });

    return { accessToken, refreshToken };
};

exports.verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
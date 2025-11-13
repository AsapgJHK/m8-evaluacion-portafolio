require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(fileUpload({
    
    limits: { fileSize: 10 * 1024 * 1024 }, 
    abortOnLimit: true, 
    createParentPath: true 
}));


if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}


app.use('/uploads', express.static(path.join(__dirname, UPLOAD_PATH)));



const authRoutes = require('./src/routes/auth.routes');
const profileRoutes = require('./src/routes/profile.routes');


app.use('/api/auth', authRoutes);    


app.use('/api/usuarios', profileRoutes); 


app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "API REST de Perfiles en funcionamiento.",
        documentation: "Consulta el README para ver las rutas."
    });
});


app.use((req, res) => {
    res.status(404).json({ 
        error: "Ruta no encontrada",
        path: req.originalUrl 
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    
    
    const errorMessage = process.env.NODE_ENV === 'development' 
        ? err.message 
        : "Ocurrió un error interno del servidor.";
    
    
    const statusCode = err.status || 500;

    res.status(statusCode).json({ 
        error: errorMessage
    });
});




app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`Ruta de subidas configurada en: ${path.resolve(UPLOAD_PATH)}`);
});
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';


if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH);
}


exports.uploadFile = (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        
        return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    
    const file = req.files.file;

    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Tipo de archivo no permitido. Solo se aceptan JPEG, PNG y PDF.' });
    }

    
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const uploadPath = path.join(UPLOAD_PATH, uniqueFileName);

    
    file.mv(uploadPath, (err) => {
        if (err) {
            console.error(err);
            
            return res.status(500).json({ error: 'Error al mover el archivo en el servidor.' });
        }

        
        const fileUrl = `${req.protocol}://${req.get('host')}/files/${uniqueFileName}`;
        
        
        res.status(201).json({
            message: 'Archivo subido exitosamente.',
            fileName: uniqueFileName,
            fileSize: file.size,
            mimetype: file.mimetype,
            url: fileUrl
        });
    });
};
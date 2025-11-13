const UserModel = require('../models/user.model');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH, { recursive: true });



exports.createProfile = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
    }
    const profile = await UserModel.register(username, password);
    if (!profile) {
        return res.status(409).json({ error: 'El nombre de usuario ya está en uso.' }); 
    }
    res.status(201).json({ message: 'Perfil creado exitosamente.', profile });
};

exports.getProfile = (req, res) => {
    const profile = UserModel.findById(req.params.id);
    if (!profile) {
        return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    
    const { password, ...safeProfile } = profile;
    res.status(200).json(safeProfile);
};

exports.updateProfile = (req, res) => {
    const profile = UserModel.updateProfile(req.params.id, req.body);
    if (!profile) {
        return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    res.status(200).json({ message: 'Perfil actualizado exitosamente.', profile });
};

exports.deleteProfile = (req, res) => {
    const success = UserModel.deleteProfile(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    res.status(204).send(); 
};



exports.uploadImage = (req, res) => {
    const userId = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    const imageFile = req.files.imagen; 
    const maxFileSize = 5 * 1024 * 1024; 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(imageFile.mimetype)) {
        return res.status(400).json({ error: 'Tipo de archivo no permitido. Solo imágenes JPG, PNG, GIF.' });
    }
    
    if (imageFile.size > maxFileSize) {
        return res.status(400).json({ error: 'El archivo es demasiado grande (máximo 5MB).' });
    }

    const uniqueFileName = `${userId}-${Date.now()}${path.extname(imageFile.name)}`;
    const uploadPath = path.join(UPLOAD_PATH, uniqueFileName);

    imageFile.mv(uploadPath, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno al guardar la imagen.' });
        }
        
        
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFileName}`;
        const updatedProfile = UserModel.updateProfile(userId, { profileImageUrl: fileUrl });

        if (!updatedProfile) {
            
            fs.unlink(uploadPath, () => console.log('Archivo eliminado por perfil no encontrado.'));
            return res.status(404).json({ error: 'Perfil no encontrado después de la subida.' });
        }

        res.status(200).json({
            message: 'Imagen de perfil subida y actualizada exitosamente.',
            profileImageUrl: fileUrl
        });
    });
};
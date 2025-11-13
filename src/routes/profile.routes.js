const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');


router.post('/', profileController.createProfile);


router.get('/:id', protect(), profileController.getProfile);


router.put('/:id', protect(), profileController.updateProfile);


router.delete('/:id', protect(), profileController.deleteProfile);


router.post('/:id/imagen', protect(), profileController.uploadImage);

module.exports = router;
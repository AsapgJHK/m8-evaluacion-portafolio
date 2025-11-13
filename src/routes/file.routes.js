const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const { protect } = require('../middlewares/auth.middleware');


router.post('/upload', protect, fileController.uploadFile); 



module.exports = router;
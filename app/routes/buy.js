const express = require("express");
const router = express.Router();
var Buy = require('../controllers/buy');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './uploads/buys';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        console.log("Uploaded file details:", file);

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            console.error("File rejected due to invalid extension:", ext);
            return cb(new Error('Only image and PDF files are allowed!'), false);
        }
        cb(null, true);
    }

});

// Middleware for handling Multer errors
function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error_message: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, error_message: err.message });
    }
    next();
}

router.post('/api/admin/createBuy', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), Buy.createBuy, multerErrorHandler);

router.post('/api/admin/updateBuy', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), Buy.updateBuy, multerErrorHandler);

router.post('/api/admin/deleteBuy', Buy.deleteBuy);
router.get('/api/admin/getBuy', Buy.getBuys);

module.exports = router;

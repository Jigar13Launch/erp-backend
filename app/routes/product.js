const express = require("express");
const router = express.Router();
var Product = require('../controllers/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = './uploads/products';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer with error handling
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
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Routes
router.post('/api/admin/createProduct', upload.single('image'), function (req, res, next) {
    next();
}, Product.createProduct);

router.post('/api/admin/updateProduct', upload.single('image'), Product.updateProduct);
router.post('/api/admin/deleteProduct', Product.deleteProduct);
router.get('/api/admin/getProduct', Product.getProducts);

module.exports = router;
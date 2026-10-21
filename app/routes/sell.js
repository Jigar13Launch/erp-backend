var Sell = require('../controllers/sell');
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './uploads/sells';
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

// router.post('/api/admin/createSell', Sell.createSell);
// router.post('/api/admin/updateSell', Sell.updateSell);
router.post('/api/admin/createSell', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), Sell.createSell, multerErrorHandler);

router.post('/api/admin/updateSell', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), Sell.updateSell, multerErrorHandler);
router.post('/api/admin/deleteSell', Sell.deleteSell);
router.post('/api/admin/disableAllSell', Sell.disableAllSell);
router.post('/api/admin/disableAllSell', Sell.disableAllSell);
router.get('/api/admin/getSell', Sell.getSells);
router.get('/api/admin/getLastInvoiceNumber', Sell.getLastInvoiceNumber);
router.get('/api/admin/getMonthlyCompanySales', Sell.getMonthlyCompanySales);
router.get('/api/admin/getTopsoldproducts', Sell.getTopsoldproducts);
router.get('/api/admin/getMonthlyOrderQuantity', Sell.getMonthlyOrderQuantity);

module.exports = router;
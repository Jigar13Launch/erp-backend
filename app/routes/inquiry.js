const express = require("express");
const router = express.Router();
var inquiryController = require('../controllers/inquiry');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-inquiry', [checkPermission("Inquiry", "create")],inquiryController.createinquiry);
router.get('/admin/get-inquiries',inquiryController.getinquiries);
router.post('/admin/update-inquiry', [checkPermission("Inquiry", "update")],inquiryController.updateinquiry);
router.post('/admin/delete-inquiry', [checkPermission("Inquiry", "delete")],inquiryController.deleteinquiry);

module.exports = router;
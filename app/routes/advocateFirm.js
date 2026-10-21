const express = require("express");
const router = express.Router();
var firmController = require('../controllers/advocateFirm');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-advocate-firm', [checkPermission("Advocate Firm", "create")], firmController.createadvocatefirm);
router.get('/admin/get-advocate-firms',  firmController.getadvocatefirms);
router.post('/admin/update-advocate-firm', [checkPermission("Advocate Firm", "update")], firmController.updateadvocatefirm);
router.post('/admin/delete-advocate-firm', [checkPermission("Advocate Firm", "delete")], firmController.deleteadvocatefirm);

module.exports = router;
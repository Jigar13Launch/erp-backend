const express = require("express");
const router = express.Router();
var firmController = require('../controllers/drafterFirm');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-drafter-firm', [checkPermission("Drafter Firm", "create")], firmController.createdrafterfirm);
router.get('/admin/get-drafter-firms',  firmController.getdrafterfirms);
router.post('/admin/update-drafter-firm', [checkPermission("Drafter Firm", "update")], firmController.updatedrafterfirm);
router.post('/admin/delete-drafter-firm', [checkPermission("Drafter Firm", "delete")], firmController.deletedrafterfirm);

module.exports = router;
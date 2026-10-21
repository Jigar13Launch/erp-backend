const express = require("express");
const router = express.Router();
var firmController = require('../controllers/builderFirm');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-builder-firm', [checkPermission("Builder Firm", "create")], firmController.createbuilderfirm);
router.get('/admin/get-builder-firms', firmController.getbuilderfirms);
router.post('/admin/update-builder-firm', [checkPermission("Builder Firm", "update")], firmController.updatebuilderfirm);
router.post('/admin/delete-builder-firm', [checkPermission("Builder Firm", "delete")], firmController.deletebuilderfirm);

module.exports = router;
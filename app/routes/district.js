const express = require("express");
const router = express.Router();
var districtController = require('../controllers/district');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-district', [checkPermission("District", "create")],districtController.createdistrict);
router.get('/admin/get-districts', districtController.getdistricts);
router.post('/admin/update-district', [checkPermission("District", "update")],districtController.updatedistrict);

module.exports = router;
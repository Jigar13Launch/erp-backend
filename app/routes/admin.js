const express = require("express");
const router = express.Router();
var adminController = require('../controllers/admin');
const checkPermission = require('../middleware/permission');

router.get('/admin/settings', [checkPermission("Settings", "list")], adminController.settings);
router.post('/admin/saveSMS', [checkPermission("Settings", "update")], adminController.saveSMS);
router.post('/admin/saveEmail', [checkPermission("Settings", "update")], adminController.saveEmail);
router.post('/admin/saveSetting', [checkPermission("Settings", "update")], adminController.saveSetting);
router.post('/admin/updateImage', [checkPermission("Settings", "update")], adminController.updateImage);
router.get('/admin/publicsetting', adminController.publicsetting);
router.get('/publicsetting', adminController.publicsetting);

module.exports = router;
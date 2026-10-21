const express = require("express");
const router = express.Router();
var templateKeyController = require('../controllers/templateKey');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-templatekey', [checkPermission("Template Key", "create")], templateKeyController.createtemplatekey);
router.get('/admin/get-templatekeys', templateKeyController.gettemplatekeys);
router.post('/admin/update-templatekey', [checkPermission("Template Key", "update")], templateKeyController.updatetemplatekey);
router.post('/admin/delete-templatekey', [checkPermission("Template Key", "delete")], templateKeyController.deletetemplatekey);

module.exports = router;
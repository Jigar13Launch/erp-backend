const express = require("express");
const router = express.Router();
var folderFileController = require('../controllers/folderFile');
const checkPermission = require('../middleware/permission');

router.post('/admin/update-folderFile', [checkPermission("Folder File", "create")], folderFileController.updatefolderFile);
router.post('/admin/create-folderFile', [checkPermission("Folder File", "create")],folderFileController.createfolderFile);
router.get('/admin/get-folderFiles', folderFileController.getfolderFiles);

module.exports = router;
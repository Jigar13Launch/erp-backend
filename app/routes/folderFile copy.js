const express = require("express");
const router = express.Router();
var folderFileController = require('../controllers/folderFile');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-folderFile', [checkPermission("Folder File", "create")],folderFileController.createfolderFile);
router.get('/admin/get-folderFiles', folderFileController.getfolderFiles);
router.post('/admin/update-folderFile', [checkPermission("Folder File", "update")],folderFileController.updatefolderFile);
router.post('/admin/delete-folder', [checkPermission("Folder File", "delete")], folderFileController.deletefolder);
router.post('/admin/delete-file', [checkPermission("Folder File", "delete")], folderFileController.deletefile);

module.exports = router;
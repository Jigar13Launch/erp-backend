const express = require("express");
const router = express.Router();
const projectController = require('../controllers/project');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-project', [checkPermission("Project","create")] , projectController.createproject);
router.get('/admin/get-projects', [checkPermission("Project", "list")], projectController.getprojects);
router.post('/admin/update-project', [checkPermission("Project","update")] , projectController.updateproject);
router.post('/admin/update-project-documents', [checkPermission("Project", "update")], projectController.updateprojectdocument);

module.exports = router;
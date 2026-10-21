const express = require("express");
const router = express.Router();
var templateController = require('../controllers/template');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-template', [checkPermission("Template", "create")], templateController.createtemplate);
router.post('/admin/update-template', [checkPermission("Template", "update")], templateController.updatetemplate);
router.post('/admin/delete-template', [checkPermission("Template", "delete")], templateController.deletetemplate);
router.get('/admin/get-templates', templateController.gettemplates);


router.post('/admin/create-template-law', [checkPermission("Law Template", "create")], templateController.createtemplate);
router.post('/admin/update-template-law', [checkPermission("Law Template", "update")], templateController.updatetemplate);
router.post('/admin/delete-template-law', [checkPermission("Law Template", "delete")], templateController.deletetemplate);
router.get('/admin/get-templates-law', [checkPermission("Law Template", "list")], templateController.gettemplates);
router.post('/admin/create-template-bank', [checkPermission("Bank Template", "create")], templateController.createtemplate);
router.post('/admin/update-template-bank', [checkPermission("Bank Template", "update")], templateController.updatetemplate);
router.post('/admin/delete-template-bank', [checkPermission("Bank Template", "delete")], templateController.deletetemplate);
router.get('/admin/get-templates-bank', [checkPermission("Bank Template", "list")], templateController.gettemplates);
router.post('/admin/create-template-project', [checkPermission("Project Template", "create")], templateController.createtemplate);
router.post('/admin/update-template-project', [checkPermission("Project Template", "update")], templateController.updatetemplate);
router.post('/admin/delete-template-project', [checkPermission("Project Template", "delete")], templateController.deletetemplate);
router.get('/admin/get-templates-project', [checkPermission("Project Template", "list")], templateController.gettemplates);

module.exports = router;
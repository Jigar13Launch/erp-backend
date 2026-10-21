const express = require("express");
const router = express.Router();
var projectUnitController = require('../controllers/projectUnit');
const checkPermission = require('../middleware/permission');

router.post('/admin/import-project-unit', [checkPermission("Project Unit", "import")], projectUnitController.importprojectunit);
router.post('/admin/update-project-unit', [checkPermission("Project Unit", "import")], projectUnitController.updateprojectunit);
router.get('/admin/get-project-unit', [checkPermission("Project Unit", "list")], projectUnitController.getprojectunit);
router.post('/admin/update-project-book', [checkPermission("Project Unit", "book")], projectUnitController.updateprojectbook);
router.post('/admin/update-project-purchaser', [checkPermission("Project Unit", "purchaser")], projectUnitController.updateprojectpurchaser);
router.post('/admin/update-project-payment', [checkPermission("Project Unit", "payment")], projectUnitController.updateprojectpayment);
router.post('/admin/update-project-expense', [checkPermission("Project Unit", "payment")], projectUnitController.updateprojectexpense);
router.post('/admin/update-project-unit-documents', [checkPermission("Project Unit", "documents")], projectUnitController.updateprojectdocument);
router.post('/admin/sendEmail', projectUnitController.sendEmail);

module.exports = router;
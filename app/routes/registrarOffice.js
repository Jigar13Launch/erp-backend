const express = require("express");
const router = express.Router();
var registrarOfficeController = require('../controllers/registrarOffice');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-registrar-office', [checkPermission("Registrar Office", "create")],registrarOfficeController.createregistraroffice);
router.get('/admin/get-registrar-offices',registrarOfficeController.getregistraroffices);
router.post('/admin/update-registrar-office', [checkPermission("Registrar Office", "update")],registrarOfficeController.updateregistraroffice);
router.post('/admin/delete-registrar-office', [checkPermission("Registrar Office", "delete")],registrarOfficeController.deleteregistraroffice);

module.exports = router;
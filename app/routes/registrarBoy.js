const express = require("express");
const router = express.Router();
var registrarBoyController = require('../controllers/registrarBoy');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-registrar-boy', [checkPermission("Registrar Boy", "create")],registrarBoyController.createregistrarboy);
router.get('/admin/get-registrar-boys',registrarBoyController.getregistrarboys);
router.post('/admin/update-registrar-boy', [checkPermission("Registrar Boy", "update")],registrarBoyController.updateregistrarboy);
router.post('/admin/delete-registrar-boy', [checkPermission("Registrar Boy", "delete")],registrarBoyController.deleteregistrarboy);

module.exports = router;
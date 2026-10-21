const express = require("express");
const router = express.Router();
var stateController = require('../controllers/state');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-state', [checkPermission("State", "create")],stateController.createstate);
router.get('/admin/get-states',stateController.getstates);
router.post('/admin/update-state', [checkPermission("State", "update")],stateController.updatestate);

module.exports = router;
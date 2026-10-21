const express = require("express");
const router = express.Router();
var bankController = require('../controllers/bank');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-bank', [checkPermission("Bank", "create")],bankController.createbank);
router.get('/admin/get-banks', bankController.getbanks);
router.post('/admin/update-bank', [checkPermission("Bank", "update")],bankController.updatebank);
router.post('/admin/delete-bank', [checkPermission("Bank", "delete")], bankController.deletebank);

module.exports = router;
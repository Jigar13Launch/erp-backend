const express = require("express");
const router = express.Router();
const roleController = require('../controllers/rolecontroller');
const checkPermission = require('../middleware/user');

router.post('/api/admin/create-role', roleController.createrole);
router.get('/api/admin/get-roles',roleController.getroles);
router.post('/api/admin/update-role',roleController.updaterole);
router.post('/api/admin/delete-role',roleController.deleterole);

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');
const checkPermission = require('../middleware/user');

router.post('/api/admin/create-user', userController.createuser);
router.get('/api/admin/get-users',userController.getusers);
router.post('/api/admin/update-user',userController.updateuser);
router.post('/api/admin/login-user',userController.loginuser);
router.post('/admin/logout-user',userController.logoutuser);
router.post('/admin/delete-user',userController.deleteuser);

module.exports = router;
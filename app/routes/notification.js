const express = require("express");
const router = express.Router();
var notificationController = require('../controllers/notification');

router.get('/admin/get-notifications', notificationController.getnotifications);
router.get('/admin/count-notifications', notificationController.countnotifications);
router.get('/admin/read-notifications', notificationController.readnotifications);

module.exports = router;
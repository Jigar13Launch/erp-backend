const express = require("express");
const router = express.Router();
var cityController = require('../controllers/city');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-city', [checkPermission("City", "create")],cityController.createcity);
router.get('/admin/get-cities',cityController.getcities);
router.post('/admin/update-city', [checkPermission("City", "update")],cityController.updatecity);

module.exports = router;
const express = require("express");
const router = express.Router();
var countryController = require('../controllers/country');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-country', [checkPermission("Country", "create")],countryController.createcountry);
router.get('/admin/get-countries',countryController.getcountries);
router.post('/admin/update-country', [checkPermission("Country", "update")],countryController.updatecountry);

module.exports = router;
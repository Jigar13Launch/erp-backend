const express = require("express");
const router = express.Router();
var Company = require('../controllers/company');
const requireRole = require('../middleware/role');
const logoUpload = require('../middleware/logoUpload');

router.post('/api/admin/createCompany',logoUpload.single('logo'),Company.createCompany);
router.post('/api/admin/updateCompany',logoUpload.single('logo'),Company.updateCompany);
router.post('/api/admin/deleteCompany',Company.deleteCompany);
router.get('/api/admin/getCompany',Company.getCompanies);
router.post('/api/admin/toggleTenantActive',requireRole('SUPER_ADMIN'),Company.toggleTenantActive);
router.post('/api/admin/resetTenantPassword',requireRole('SUPER_ADMIN'),Company.resetTenantPassword);
router.post('/api/admin/updateMyLogo',logoUpload.single('logo'),Company.updateMyLogo);

module.exports = router;

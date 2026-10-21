const express = require("express");
const router = express.Router();
var dashboardController = require('../controllers/dashboard');

router.get('/admin/get-dashboard-new-counts', dashboardController.newcounts);
router.get('/admin/get-dashboard-counts', dashboardController.counts);
router.get('/admin/get-document-counts-by-district', dashboardController.bankcountsbydistrict);
router.get('/admin/get-document-counts-by-date', dashboardController.countsbydate);
router.get('/admin/all-invoices', dashboardController.newAllInvoices);
router.get('/admin/download-invoices', dashboardController.downloadInvoices);
router.post('/admin/update-invoices', dashboardController.updateAllInvoice);

module.exports = router;
const express = require("express");
const router = express.Router();
var Ledger = require('../controllers/ledger');

router.post('/api/admin/createLedger',Ledger.createLedger);
router.post('/api/admin/updateLedger',Ledger.updateLedger);
router.post('/api/admin/deleteLedgers',Ledger.deleteLedgers);
router.post('/api/admin/deleteLedger',Ledger.deleteLedger);
router.get('/api/admin/getLedger',Ledger.getLedgers);
router.get('/api/admin/getCompanyLeger',Ledger.getCompanyLeger);
router.get('/api/admin/getMonthlyEarnings',Ledger.getMonthlyEarnings);
router.get('/api/admin/getRecevableBalances',Ledger.getRecevableBalances);
router.get('/api/admin/getBalanceSheet',Ledger.getLedgerEntriesWithBalance);

module.exports = router;
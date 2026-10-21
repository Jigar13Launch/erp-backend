const express = require("express");
const router = express.Router();
var Earning = require('../controllers/earning');

router.post('/api/admin/createEarning',Earning.createEarning);
router.post('/api/admin/updateEarning',Earning.updateEarning);
router.post('/api/admin/deleteEarning',Earning.deleteEarning);
router.get('/api/admin/getEarning',Earning.getEarnings);

module.exports = router;
const express = require("express");
const router = express.Router();
var DeliveryChallan = require('../controllers/deliveryChallan');

router.post('/api/admin/createDeliveryChallan',DeliveryChallan.createDeliveryChallan);
router.post('/api/admin/updateDeliveryChallan',DeliveryChallan.updateDeliveryChallan);
router.post('/api/admin/deleteDeliveryChallan',DeliveryChallan.deleteDeliveryChallan);
router.get('/api/admin/getDeliveryChallan',DeliveryChallan.getDeliveryChallans);

module.exports = router;
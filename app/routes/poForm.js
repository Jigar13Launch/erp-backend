const express = require("express");
const router = express.Router();
var PoForm = require('../controllers/poForm');

router.post('/api/admin/createPoForm',PoForm.createPoForm);
router.post('/api/admin/updatePoForm',PoForm.updatePoForm);
router.post('/api/admin/deletePoForm',PoForm.deletePoForm);
router.get('/api/admin/getPoForm',PoForm.getPoForms);

module.exports = router;
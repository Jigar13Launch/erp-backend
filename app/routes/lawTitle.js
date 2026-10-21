const express = require("express");
const router = express.Router();
var lawTitleController = require('../controllers/lawTitle');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-title-query', lawTitleController.createtitlequery);
router.post('/admin/create-titleRequest', [checkPermission("Law Title", "create")], lawTitleController.createtitleRequest);
router.post('/admin/assignAdvocateRequest', [checkPermission("Law Title", "create")], lawTitleController.assignAdvocateRequest);
router.get('/admin/get-titleRequest', lawTitleController.gettitlerequests);
router.get('/admin/get-public-titleRequest', lawTitleController.getpublictitlerequests);
router.post('/admin/update-titleRequest', lawTitleController.updatetitleRequest);
router.post('/admin/update-uploadDocuments', [checkPermission("Law Title", "update")], lawTitleController.uploadDocuments);
router.post('/admin/upload-final-document', lawTitleController.uploadFinalDocuments);
router.post('/admin/remove-final-document', lawTitleController.removeFinalDocuments);
router.post('/admin/upload-final-sign-document', lawTitleController.uploadFinalSignDocuments);
router.post('/admin/respond-request', lawTitleController.approveRejectRequest);
router.post('/admin/delete-titleRequest', [checkPermission("Law Title", "delete")], lawTitleController.deletelawtitle);
router.post('/admin/updatetitlestaff', lawTitleController.updatetitlestaff);
router.get('/paymentForTitle', lawTitleController.paymentForTitle);
router.post('/paymentTitleCallback', lawTitleController.paymentTitleCallback);
router.get('/paymentTitleCallback', lawTitleController.paymentTitleCallback);
router.post('/admin/update-removeDocuments', lawTitleController.removeDocuments);
router.get('/admin/gettitlefees', [checkPermission("Title Statistic", "list")], lawTitleController.gettitlefees);

module.exports = router;
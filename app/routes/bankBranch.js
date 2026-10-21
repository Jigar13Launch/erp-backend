const express = require("express");
const router = express.Router();
var bankBranchController = require('../controllers/bankBranch');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-bank-branch', [checkPermission("Branch", "create")],bankBranchController.createbankbranch);
router.get('/admin/get-bank-branches', bankBranchController.getbankbranches);
router.post('/admin/update-bank-branch', [checkPermission("Branch", "update")], bankBranchController.updatebankbranch);
router.post('/admin/delete-bank-branch', [checkPermission("Branch", "delete")], bankBranchController.deletebankbranch);

module.exports = router;
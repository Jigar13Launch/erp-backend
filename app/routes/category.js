const express = require("express");
const router = express.Router();
var categoryController = require('../controllers/category');
const checkPermission = require('../middleware/permission');

router.post('/admin/create-category', [checkPermission("Category", "create")],categoryController.createcategory);
router.get('/admin/get-categories', categoryController.getcategories);
router.post('/admin/update-category', [checkPermission("Category", "update")],categoryController.updatecategory);
router.post('/admin/delete-category', [checkPermission("Category", "delete")],categoryController.deletecategory);

module.exports = router;
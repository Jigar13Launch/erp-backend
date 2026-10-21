const Category = require('../models/Category')
const Template = require('../models/Template')
const utils = require('../utils');
const noOfRecord = 10;
exports.createcategory = async function (req, res) {
    try {
        let category = await Category.findOne({ name: req.body.name, isDelete: false });
        if (category) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_CATEGORY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_CATEGORY_ALREADY_EXIST]
            });
        }
        category = new Category(req.body)
        await category.save()
        return res.json({
            success: true,
            data: {
                category
            },
            success_code: process.env.SUCCESS_STRING_CATEGORY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_CATEGORY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatecategory = async function (req, res) {
    try {
        let category
        if (req.body.name){
            category = await Category.findOne({ _id: { $ne: req.body.categoryId }, name: req.body.name, isDelete: false });
            if (category) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_CATEGORY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_CATEGORY_ALREADY_EXIST]
                });
            }
        }
        category = await Category.findOneAndUpdate({ _id: req.body.categoryId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                category
            },
            success_code: process.env.SUCCESS_STRING_CATEGORY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_CATEGORY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletecategory = async function (req, res) {
    try {
        await Category.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_CATEGORY_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_CATEGORY_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getcategories = async function (req, res) {
    try {
        let categories = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = { isDelete: { $ne: true } };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.portal) {
            query.portal = req.query.portal;
        }
        if (req.query.parentId) {
            query.parentId = req.query.parentId;
        }else{
            query.parentId = null;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            categories = await Category.find(query).lean();
            utils.generateExcel({ name: "string" }, categories, "categories.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            categories = await Category.find(query).lean();
            utils.generatePDF({ name: "string" }, categories, "categories.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            categories = await Category.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Category.countDocuments(query).lean();
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            categories = await Category.find(query).sort(sortObj).skip(skip).limit(limit).lean()
        }
        query = {}
        if (req.query.bankId) {
            query.bankId = req.query.bankId
        }
        if (req.query.advocateFirmId) {
            query.advocateFirmId = req.query.advocateFirmId;
        }
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        for (let category of categories){
            query.categoryId = category._id;
            query.isDelete = { $ne: true }
            category.totalTemplates = await Template.countDocuments(query).lean();
            category.subCategory = await Category.countDocuments({ parentId: category._id, isDelete: { $ne: true } }).lean();
        }
        return res.json({
            success: true,
            data: {
                bankDefaultParams : await utils.excludesParams(),
                projectDefaultParams : await utils.excludesProjectParams(),
                lawDefaultParams : await utils.excludesProjectParams(),
                categories,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

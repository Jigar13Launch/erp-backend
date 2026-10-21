const TemplateKeys = require('../models/TemplateKeys')
const utils = require('../utils');
const noOfRecord = 10;
exports.createtemplatekey = async function (req, res) {
    try {
        let templatekeys = await TemplateKeys.findOne({ name: req.body.name, portal: req.body.portal , isDelete: false });
        if (templatekeys) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_TEMPLATE_KEYS_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TEMPLATE_KEYS_ALREADY_EXIST]
            });
        }
        templatekeys = new TemplateKeys(req.body)
        await templatekeys.save()
        return res.json({
            success: true,
            data: {
                templatekeys
            },
            success_code: process.env.SUCCESS_STRING_TEMPLATE_KEYS_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_KEYS_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatetemplatekey = async function (req, res) {
    try {
        let templatekeys
        if (req.body.name) {
            templatekeys = await TemplateKeys.findOne({ _id: { $ne: req.body.templateKeysId }, name: req.body.name, portal: req.body.portal, isDelete: false });
            if (templatekeys) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_TEMPLATE_KEYS_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TEMPLATE_KEYS_ALREADY_EXIST]
                });
            }
        }
        
        templatekeys = await TemplateKeys.findOneAndUpdate({ _id: req.body.templateKeysId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                templatekeys
            },
            success_code: process.env.SUCCESS_STRING_TEMPLATE_KEYS_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_KEYS_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletetemplatekey = async function (req, res) {
    try {
        await TemplateKeys.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_TEMPLATE_KEYS_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_KEYS_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.gettemplatekeys = async function (req, res) {
    try {
        let templatekeys = []
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
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            templatekeys = await TemplateKeys.find(query);
            utils.generateExcel({ name: "string", "type": "string" }, templatekeys, "templatekeyss.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            templatekeys = await TemplateKeys.find(query);
            utils.generatePDF({ name: "string", "type": "string" }, templatekeys, "templatekeyss.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            templatekeys = await TemplateKeys.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await TemplateKeys.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            templatekeys = await TemplateKeys.find(query).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                templatekeys,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

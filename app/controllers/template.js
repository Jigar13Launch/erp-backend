const generateDocumentController = require('./generateDocument')
const Template = require('../models/Template')
const TemplateKeys = require('../models/TemplateKeys')
const Docxtemplater = require('docxtemplater');
const PizZip = require("pizzip");
const fs = require('fs');
const Category = require('../models/Category')
const Project = require('../models/Project')
const utils = require('../utils');
const noOfRecord = 10;
exports.createtemplate = async function (req, res) {
    try {
        let query = { name: req.body.name, isDelete: false };
        if (req.body.bankId){
            query.bankId = req.body.bankId;
        } else if (req.body.projectId) {
            query.projectId = req.body.projectId;
        }
        let template = await Template.findOne(query);
        if (template) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_TEMPLATE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TEMPLATE_ALREADY_EXIST]
            });
        }
        if (req.body.categoryId) {
            let category = await Category.findOne({ _id: req.body.categoryId })
            req.body.portal = category.portal;
        }
        if (req.body.projectId) {
            let project = await Project.findOne({ _id: req.body.projectId })
            req.body.builderFirmId = project.builderFirmId;
            req.body.advocateFirmId = project.advocateFirmId;
        }
        template = new Template(req.body)
        if (req.files && req.files.length > 0) {
            let templateKey = await exports.setVariable(req.files[0].path,req,res);
            template.variables = templateKey.variables;
            template.variablesWithType = templateKey.variablesWithType;
            var image_name = template._id;
            var url = utils.getImageFolderPath(req, 1) + image_name + '.docx';
            template.attachment = url;
            template.attachmentName = req.files[0].originalname;
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.docx', 1);
        }
        await template.save()
        return res.json({
            success: true,
            data: {
                template
            },
            success_code: process.env.SUCCESS_STRING_TEMPLATE_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.setVariable = async function (path, req, res){
    try {
        const content = fs.readFileSync(path);
        const zip = new PizZip(content);
        const doc = new Docxtemplater();
        doc.loadZip(zip);
        doc.setOptions({
            delimiters: {
                start: '{',
                end: '}'
            }
        });
        let findVariables = await generateDocumentController.findVariables(req, res, doc);      
        return findVariables;
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletetemplate = async function (req, res) {
    try {
        await Template.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_TEMPLATE_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatetemplate = async function (req, res) {
    try {
        let template
        if (req.body.name) {
            let query = { _id: { $ne: req.body.templateId }, name: req.body.name, isDelete: false };
            if (req.body.bankId) {
                query.bankId = req.body.bankId;
            } else if (req.body.projectId) {
                query.projectId = req.body.projectId;
            }
            template = await Template.findOne(query);
            if (template) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_TEMPLATE_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TEMPLATE_ALREADY_EXIST]
                });
            }
        }
        if (req.body.categoryId) {
            let category = await Category.findOne({ _id: req.body.categoryId })
            req.body.portal = category.portal;
        }
        template = await Template.findOneAndUpdate({ _id: req.body.templateId }, req.body, { new: true })
        if (req.files && req.files.length > 0) {
            let templateKey = await exports.setVariable(req.files[0].path, req, res);
            template.variables = templateKey.variables;
            template.variablesWithType = templateKey.variablesWithType;
            var image_name = template._id;
            var url = utils.getImageFolderPath(req, 1) + image_name + '.docx';
            template.attachment = url;
            template.attachmentName = req.files[0].originalname;
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.docx', 1);
            await template.save();
        }
        return res.json({
            success: true,
            data: {
                template
            },
            success_code: process.env.SUCCESS_STRING_TEMPLATE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TEMPLATE_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.gettemplates = async function (req, res) {
    try {
        let templates = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let category = null;
        let query = { isDelete: { $ne: true } };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.advocateFirmId && req.query.portal != "Bank") {
            query.advocateFirmId = req.query.advocateFirmId;
        }
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.builderId) {
            query.builderId = req.query.builderId
        }
        if (req.query.projectId) {
            query.projectId = req.query.projectId
        }
        if (req.query.withoutunit) {
            query.projectId = null;
        }
        if (req.query.portal) {
            query.portal = req.query.portal
        }
        if (req.query.bankIds) {
            query.bankId = { $in: req.query.bankIds.split(",") };
        }
        if (req.query.bankId) {
            query.bankId = req.query.bankId
        }
        if (req.query.categoryId && req.query.categoryId.length == 24) {
            query.categoryId = req.query.categoryId;
            category = await Category.findById(req.query.categoryId);
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.favourite) {
            query.favourite = req.query.favourite.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.isProject == true || req.query.isProject == "true") {
            query.projectId = { $ne: null }
            query.portal = "Law";
        } else if (req.query.isLaw == true || req.query.isLaw == "true") {
            query.projectId = null;
            query.portal = "Law";
        } else if (req.query.isBank == true || req.query.isBank == "true" || req.query.isDrafter == true || req.query.isDrafter == "true") {
            query.projectId = null;
            query.portal = "Bank";
        } else {
            if (req.query.portal) {
                query.portal = req.query.portal
            }
        }
        if (req.query.export) {
            templates = await Template.find(query).populate("advocateFirmId", { name: 1 }).populate("projectId", { name: 1 }).populate("bankId", { name: 1 }).populate("categoryId", { name: 1 });
            utils.generateExcel({ name: "string", "advocateFirmId_name": "string", "projectId_name": "string", "bankId_name": "string", "categoryId_name": "string" }, templates, "templates.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            templates = await Template.find(query).populate("advocateFirmId", { name: 1 }).populate("projectId", { name: 1 }).populate("bankId", { name: 1 }).populate("categoryId", { name: 1 });
            utils.generatePDF({ name: "string", "advocateFirmId_name": "string", "projectId_name": "string", "bankId_name": "string", "categoryId_name": "string" }, templates, "templates.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            templates = await Template.find(query).populate("advocateFirmId", { name: 1 }).populate("projectId", { name: 1 }).populate("bankId", { name: 1 }).populate("categoryId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Template.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            templates = await Template.find(query).sort(sortObj).skip(skip).limit(limit).populate("advocateFirmId", { name: 1 }).populate("projectId", { name: 1 }).populate("bankId", { name: 1 }).populate("categoryId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {                
                templates,
                page,
                category,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

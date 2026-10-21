const Firm = require('../models/BuilderFirm')
const AutoIncrement = require('../models/AutoIncrement')
const utils = require('../utils');
const noOfRecord = 10;
exports.createbuilderfirm = async function (req, res) {
    try {
        let builderfirm = await Firm.findOne({ name: req.body.name });
        if (builderfirm) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_BUILDER_FIRM_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BUILDER_FIRM_ALREADY_EXIST]
            });
        }
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "builderfirms"
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "builderfirms",
                lastId: 1
            })
        }
        if (req.body.invoiceName) {
            req.body.invoiceDetail = {
                name: req.body.invoiceName,
                address: req.body.invoiceAddress,
                email: req.body.invoiceEmail,
                gstNo: req.body.invoiceGstNo,
                accountNo: req.body.invoiceAccountNo,
                ifsc: req.body.invoiceIfsc,
            }
        }
        req.body.uniqueId = autoIncrement.lastId,
        builderfirm = new Firm(req.body)
        await builderfirm.save()
        return res.json({
            success: true,
            data: {
                builderfirm
            },
            success_code: process.env.SUCCESS_STRING_BUILDER_FIRM_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUILDER_FIRM_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatebuilderfirm = async function (req, res) {
    try {
        let builderfirm
        if (req.body.name){
            builderfirm = await Firm.findOne({ _id: { $ne: req.body.builderFirmId }, name: req.body.name });
            if (builderfirm) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_BUILDER_FIRM_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BUILDER_FIRM_ALREADY_EXIST]
                });
            }
        }
        if (req.body.invoiceName){
            req.body.invoiceDetail = {
                name: req.body.invoiceName,
                address: req.body.invoiceAddress,
                email: req.body.invoiceEmail,
                gstNo: req.body.invoiceGstNo,
                accountNo: req.body.invoiceAccountNo,
                ifsc: req.body.invoiceIfsc,
            }
        }
        builderfirm = await Firm.findOneAndUpdate({ _id: req.body.builderFirmId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                builderfirm
            },
            success_code: process.env.SUCCESS_STRING_BUILDER_FIRM_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUILDER_FIRM_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletebuilderfirm = async function (req, res) {
    try {
        await Firm.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_BUILDER_FIRM_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUILDER_FIRM_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getbuilderfirms = async function (req, res) {
    try {
        let builderfirms = []
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
        
        if (req.query.advocateFirmId) {
            query.advocateFirmId = req.query.advocateFirmId
        }
        if (req.query.builderFirmId) {
            query._id = req.query.builderFirmId;
        }
        if (req.query.builderFirmId) {
            query._id = req.query.builderFirmId;
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            builderfirms = await Firm.find(query);
            utils.generateExcel({ name: "string" }, builderfirms, "builderfirms.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            builderfirms = await Firm.find(query);
            utils.generatePDF({ name: "string" }, builderfirms, "builderfirms.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            builderfirms = await Firm.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Firm.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            builderfirms = await Firm.find(query).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                builderfirms,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

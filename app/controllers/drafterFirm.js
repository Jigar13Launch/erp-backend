const Firm = require('../models/DrafterFirm')
const AutoIncrement = require('../models/AutoIncrement')
const utils = require('../utils');
const noOfRecord = 10;
exports.createdrafterfirm = async function (req, res) {
    try {
        let drafterfirm = await Firm.findOne({ name: req.body.name, isDelete: false });
        if (drafterfirm) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_DRAFTER_FIRM_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DRAFTER_FIRM_ALREADY_EXIST]
            });
        }
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "drafterfirms"
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "drafterfirms",
                lastId: 1
            })
        }
        req.body.uniqueId = autoIncrement.lastId;
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
        if (req.body.invoiceNameTitle) {
            req.body.invoiceDetailTitle = {
                nameTitle: req.body.invoiceNameTitle,
                addressTitle: req.body.invoiceAddressTitle,
                emailTitle: req.body.invoiceEmailTitle,
                gstNoTitle: req.body.invoiceGstNoTitle,
                accountNoTitle: req.body.invoiceAccountNoTitle,
                ifscTitle: req.body.invoiceIfscTitle,
            }
        }
        drafterfirm = new Firm(req.body)
        await drafterfirm.save()
        return res.json({
            success: true,
            data: {
                drafterfirm
            },
            success_code: process.env.SUCCESS_STRING_DRAFTER_FIRM_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DRAFTER_FIRM_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletedrafterfirm = async function (req, res) {
    try {
        await Firm.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_DRAFTER_FIRM_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DRAFTER_FIRM_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatedrafterfirm = async function (req, res) {
    try {
        let drafterfirm
        if (req.body.name){
            drafterfirm = await Firm.findOne({ _id: { $ne: req.body.drafterFirmId }, name: req.body.name, isDelete: false });
            if (drafterfirm) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_DRAFTER_FIRM_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DRAFTER_FIRM_ALREADY_EXIST]
                });
            }
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
        if (req.body.invoiceNameTitle) {
            req.body.invoiceDetailTitle = {
                nameTitle: req.body.invoiceNameTitle,
                addressTitle: req.body.invoiceAddressTitle,
                emailTitle: req.body.invoiceEmailTitle,
                gstNoTitle: req.body.invoiceGstNoTitle,
                accountNoTitle: req.body.invoiceAccountNoTitle,
                ifscTitle: req.body.invoiceIfscTitle,
            }
        }
        drafterfirm = await Firm.findOneAndUpdate({ _id: req.body.drafterFirmId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                drafterfirm
            },
            success_code: process.env.SUCCESS_STRING_DRAFTER_FIRM_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DRAFTER_FIRM_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getdrafterfirms = async function (req, res) {
    try {
        let drafterfirms = []
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
        if (req.query.drafterFirmId) {
            query._id = req.query.drafterFirmId;
        }
        if (req.query.advocateFirmId) {
            query.advocateFirmId = req.query.advocateFirmId;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            drafterfirms = await Firm.find(query).populate("advocateFirmId", { name: 1 });
            utils.generateExcel({ name: "string", advocateFirmId_name: "string" }, drafterfirms, "drafterfirms.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            drafterfirms = await Firm.find(query).populate("advocateFirmId", { name: 1 });
            utils.generatePDF({ name: "string", advocateFirmId_name: "string" }, drafterfirms, "drafterfirms.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            drafterfirms = await Firm.find(query).populate("advocateFirmId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Firm.countDocuments(query);
            if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            }
            drafterfirms = await Firm.find(query).populate("advocateFirmId", { name: 1 }).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                drafterfirms,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

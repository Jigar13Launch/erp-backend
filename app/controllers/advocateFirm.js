const Firm = require('../models/AdvocateFirm')
const AutoIncrement = require('../models/AutoIncrement')
const utils = require('../utils');
const noOfRecord = 10;
exports.createadvocatefirm = async function (req, res) {
    try {
        let advocatefirm = await Firm.findOne({ name: req.body.name, isDelete: false });
        if (advocatefirm) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_ADVOCATE_FIRM_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_ADVOCATE_FIRM_ALREADY_EXIST]
            });
        }
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "advocatefirms"
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "advocatefirms",
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
        advocatefirm = new Firm(req.body)
        await advocatefirm.save()
        return res.json({
            success: true,
            data: {
                advocatefirm
            },
            success_code: process.env.SUCCESS_STRING_ADVOCATE_FIRM_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ADVOCATE_FIRM_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteadvocatefirm = async function (req, res) {
    try {
        await Firm.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_ADVOCATE_FIRM_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ADVOCATE_FIRM_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateadvocatefirm = async function (req, res) {
    try {
        let advocatefirm
        if (req.body.name){
            advocatefirm = await Firm.findOne({ _id: { $ne: req.body.advocateFirmId }, name: req.body.name, isDelete: false });
            if (advocatefirm) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_ADVOCATE_FIRM_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_ADVOCATE_FIRM_ALREADY_EXIST]
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
        advocatefirm = await Firm.findOneAndUpdate({ _id: req.body.advocateFirmId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                advocatefirm
            },
            success_code: process.env.SUCCESS_STRING_ADVOCATE_FIRM_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ADVOCATE_FIRM_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getadvocatefirms = async function (req, res) {
    try {
        let advocatefirms = []
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
        if (req.query.isTitlePortal) {
            query.isTitlePortal = true;
        }
        if (req.query.isDrafter) {
            if (typeof req.query.isDrafter == "string"){
                query.isDrafter = req.query.isDrafter.toLowerCase() == "true";
            }else{
                query.isDrafter = req.query.isDrafter;
            }
        }
        if (req.query.all != "true") {
            if (req.query.advocateFirmId) {
                query._id = req.query.advocateFirmId;
            }
        }
        if (req.headers['advocateFirm'] && req.headers['advocateFirm'].cityIds && req.headers['advocateFirm'].cityIds.length) {
            query.cityIds = { $in: req.headers['advocateFirm'].cityIds }
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.latitude && req.query.longitude) {
            query["address.location"] = {
                //$near: [Number(req.query.longitude), Number(req.query.latitude)], 
                //$maxDistance: req.query.radius * 1000 // in meters
                $near:
                {
                    $geometry: { type: "Point", coordinates: [Number(req.query.longitude), Number(req.query.latitude)] },
                    // $minDistance: 1000,
                    $maxDistance: 30 * 1000 // in meters
                }
            }
            advocatefirms = await Firm.find(query).populate("cityIds", { name: 1 });
        } else if (req.query.export) {
            advocatefirms = await Firm.find(query).populate("cityIds", { name: 1 });
            utils.generateExcel({ name: "string" }, advocatefirms, "advocatefirms.xlsx", req, res);
            return;
        } else if (req.query.pdf) {
            advocatefirms = await Firm.find(query).populate("cityIds", { name: 1 });
            utils.generatePDF({ name: "string" }, advocatefirms, "advocatefirms.pdf", req, res);
            return;
        } else if (req.query.page == undefined) {
            advocatefirms = await Firm.find(query).populate("cityIds", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Firm.countDocuments(query);
            if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            }
            advocatefirms = await Firm.find(query).populate("cityIds", { name: 1 }).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                advocatefirms,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

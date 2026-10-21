const Inquiry = require('../models/Inquiry')
const Project = require('../models/Project')
const utils = require('../utils');
const whatsapp = require('../whatsapp');
const noOfRecord = 10;
exports.createinquiry = async function (req, res) {
    try {
        let inquiry = await Inquiry.findOne({ name: req.body.name, isDelete :false});
        if (inquiry) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST]
            });
        }
        if (req.body.projectId) {
            let project = await Project.findOne({ _id: req.body.projectId })
            req.body.builderFirmId = project.builderFirmId;
        }
        inquiry = new Inquiry(req.body)
        await inquiry.save()
        whatsapp.newInquiry(inquiry.phoneCode, inquiry.phone, inquiry, inquiry.name)
        return res.json({
            success: true,
            data: {
                inquiry
            },
            success_code: process.env.SUCCESS_STRING_INQUIRY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteinquiry = async function (req, res) {
    try {
        await Inquiry.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_INQUIRY_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateinquiry = async function (req, res) {
    try {
        let inquiry
        if (req.body.name) {
            inquiry = await Inquiry.findOne({ _id: { $ne: req.body.inquiryId }, name: req.body.name, isDelete: false });
            if (inquiry) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST]
                });
            }
        }
        inquiry = await Inquiry.findOneAndUpdate({ _id: req.body.inquiryId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                inquiry
            },
            success_code: process.env.SUCCESS_STRING_INQUIRY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getinquiries = async function (req, res) {
    try {
        let inquiries = []
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
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.builderId) {
            query.builderId = req.query.builderId;
        }
        if (req.query.projectId) {
            query.projectId = req.query.projectId;
        } else if (req.query.projectIds) {
            query.projectId = { $in: req.query.projectIds };
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.searchValue) {
            query["$or"] = [
                { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { phone: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { email: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { address: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { budget: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { details: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { attendBy: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "referance.name": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "referance.phone": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "referance.email": { $regex: new RegExp(req.query.searchValue, 'i') } },
            ]
        }
        if (req.query.export) {
            inquiries = await Inquiry.find(query).populate("projectId", { name: 1 }).populate("builderFirmId", { name: 1 });
            utils.generateExcel({ name: "string", phone: "string", phoneCode: "string", email: "string", address: "string", budget: "string", details: "string", attendBy: "string", isReferance: "string", referance_name: "string", referance_phoneCode: "string", referance_phone: "string", referance_adviceFee: "string", referance_email: "string", builderFirmId_name: "string", projectId_name: "string" }, inquiries, "inquiries.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            inquiries = await Inquiry.find(query).populate("projectId", { name: 1 }).populate("builderFirmId", { name: 1 });
            utils.generatePDF({ name: "string", phone: "string", phoneCode: "string", email: "string", address: "string", budget: "string", details: "string", attendBy: "string", isReferance: "string", referance_name: "string", referance_phoneCode: "string", referance_phone: "string", referance_adviceFee: "string", referance_email: "string", builderFirmId_name: "string", projectId_name: "string" }, generatedocuments, "inquiries.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            inquiries = await Inquiry.find(query).populate("projectId", { name: 1 }).populate("builderFirmId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Inquiry.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            inquiries = await Inquiry.find(query).sort(sortObj).skip(skip).limit(limit).populate("projectId", { name: 1 }).populate("builderId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                inquiries,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

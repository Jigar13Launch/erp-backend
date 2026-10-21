const PoForm = require('../models/poForm');
const utils = require('../utils');
const noOfRecord = 10;

exports.createPoForm = async function (req, res) {
    try {
        if (req.body.items){      
            req.body.userId = req.userId;
            req.body.user = req.user      
            let poForm = await PoForm.create(req.body);
            return res.json({
                success: true,
                data: {
                    poForm
                },
                success_code: process.env.SUCCESS_STRING_POFORM_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_POFORM_ADDED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatePoForm = async function (req, res) {
    try {
        let query = {};
        query = { _id: req.body.poFormId };
        if (req.body.itemName) {
            req.body.itemNameId = req.body.itemName;
        }
        req.body.userId = req.userId;
        req.body.user = req.user
        let poForm = await PoForm.findOneAndUpdate(query, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                poForm
            },
            success_code: process.env.SUCCESS_STRING_POFORM_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_POFORM_UPDATED_SUCCESSFULLY]
        });

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deletePoForm = async function (req, res) {
    try {
        await PoForm.findOneAndUpdate({ _id: req.body.poFormId, isDelete: false }, { isDelete: true }, { new: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_POFORM_DELETED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_POFORM_DELETED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}


exports.getPoForms = async function (req, res) {
    try {
        let poForms = []
        let page = 0;
        let totalRecord = 0;
        let limit = noOfRecord;
        let query = {
            userId:req.userId,
            isDelete: false
        };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.poFormId) {
            query._id = req.query.poFormId;
        } else if (req.query.poFormIds) {
            query._id = { $in: req.query.poFormIds };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();

            if (searchValue) {
                query.$or = [
                    
                    { sellerCompanyName: { $regex: new RegExp(searchValue, 'i') } },
                ]
            }
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if (req.query.export) {
            poForms = await PoForm.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            poForms = await PoForm.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            console.log("page is not present.");
            poForms = await PoForm.find(query);
        } else {
            totalRecord = await PoForm.countDocuments(query);
            page = parseInt(req.query.page);
            let skip = (page - 1) * limit;            
            poForms = await PoForm.find(query).sort(sortObj).skip(skip).limit(limit);

            console.log('poForms : ', poForms);
        }
        return res.json({
            success: true,
            data: {
                poForms,
                page,
                total:totalRecord
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
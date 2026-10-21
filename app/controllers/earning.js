const Earning = require('../models/earning')
const utils = require('../utils');
const noOfRecord = 10;
exports.createEarning = async function (req, res) {
    try {

        req.body.userId = req.userId;
        req.body.user = req.user;
        let earning = await Earning.create(req.body);
        if(earning){
            return res.json({
                success: true,
                data: {
                    earning
                },
                success_code: process.env.SUCCESS_STRING_EARNING_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EARNING_ADDED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateEarning = async function (req, res) {
    try {
        let query = { _id: req.body.earningId };
        req.body.userId = req.userId;
        req.body.user = req.user;
        let earning = await Earning.findOneAndUpdate(query, req.body, { new: true })
        if(earning){
            return res.json({
                success: true,
                data: {
                    earning
                },
                success_code: process.env.SUCCESS_STRING_EARNING_UPDATED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EARNING_UPDATED_SUCCESSFULLY]
            });
        }

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteEarning = async function (req, res) {
    try {
        await Earning.findOneAndUpdate({ _id: req.body.earningId, isDelete: false }, { isDelete: true }, { new: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_EARNING_DELETED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EARNING_DELETED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.getEarnings = async function (req, res) {
    try {
        let earnings = [];
        let query = {userId:req.userId, isDelete: false };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: 1 };
        }
        if(req.query.companyId){
            query.companyId = req.query.companyId
        }
        if (req.query.earningId) {
            query._id = req.query.earningId;
        } else if (req.query.earningIds) {
            query._id = { $in: req.query.earningIds };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();

            if (searchValue) {
                query.$or = [
                    { receivePerson: { $regex: new RegExp(searchValue, 'i') } },
                    { companyName: { $regex: new RegExp(searchValue, 'i') } },
                ]
            }
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            earnings = await Earning.find(query).populate('companyId');
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            earnings = await Earning.find(query).populate('companyId');
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            earnings = await Earning.find(query).populate('companyId');
            return res.json({
                success: true,
                data: {
                    earnings                  
                }
            });
        } else {
            // page = req.query.page;
            // let skip = (page - 1) * limit;
            // totalPage = await Store.countDocuments(query);
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let skipIndex = (page - 1) * limit;            
            let totalRecord = await Earning.countDocuments(query);
            let pageNumber = Math.ceil(totalRecord / limit);
            earnings = await Earning.find(query).populate('companyId').sort(sortObj).skip(skipIndex).limit(limit);
            return res.json({
                success: true,
                data: {
                    earnings,
                    page:pageNumber,
                    total:totalRecord
                }
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
const DeliveryChallan = require('../models/deliveryChallan');
const utils = require('../utils');
const noOfRecord = 10;

exports.createDeliveryChallan = async function (req, res) {
    try {
        if(req.body.products){
            let deliveryChallan = await DeliveryChallan.create(req.body)
            return res.json({
                success: true,
                data: {
                    deliveryChallan
                },
                success_code: process.env.SUCCESS_STRING_DELIVERYCHALLAN_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DELIVERYCHALLAN_ADDED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateDeliveryChallan = async function (req, res) {
    try {
        let query = {};
        query = { _id: req.body.deliveryChallanId };
        let deliveryChallan = await DeliveryChallan.findOneAndUpdate(query, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                deliveryChallan
            },
            success_code: process.env.SUCCESS_STRING_DELIVERYCHALLAN_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DELIVERYCHALLAN_UPDATED_SUCCESSFULLY]
        });

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteDeliveryChallan = async function (req, res) {
    try {
        await DeliveryChallan.findOneAndUpdate({ _id: req.body.deliveryChallanId, isDelete: false }, { isDelete: true }, { new: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_DELIVERYCHALLAN_DELETED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DELIVERYCHALLAN_DELETED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}


exports.getDeliveryChallans = async function (req, res) {
    try {
        let deliveryChallans = []
        let page = 0;
        let totalRecord = 0;
        let limit = noOfRecord;
        let query = { userId:req.userId, isDelete: false };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.deliveryChallanId) {
            query._id = req.query.deliveryChallanId;
        } else if (req.query.deliveryChallanIds) {
            query._id = { $in: req.query.deliveryChallanIds };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();

            if (searchValue) {
                query.$or = [
                    { customerName: { $regex: new RegExp(searchValue, 'i') } },
                    { deliveryChallanNumber: { $regex: new RegExp(searchValue, 'i') } },
                ]
            }
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if (req.query.export) {
            deliveryChallans = await DeliveryChallan.find(query).populate('customerName', 'name');
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            deliveryChallans = await DeliveryChallan.find(query).populate('customerName', 'name');
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            deliveryChallans = await DeliveryChallan.find(query).populate('customerName', 'name');
        } else {
            page = parseInt(req.query.page);
            let skip = (page - 1) * limit;
            totalRecord = await DeliveryChallan.countDocuments(query);
            deliveryChallans = await DeliveryChallan.find(query).populate('customerName', 'name').sort(sortObj).skip(skip).limit(limit);
        }
        return res.json({
            success: true,
            data: {
                deliveryChallans,
                page,
                totalRecord
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
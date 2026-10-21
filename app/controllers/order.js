const Order = require('../models/Order')
const User = require('../models/User')
const utils = require('../utils');
const noOfRecord = 10;
exports.createOrder = async function (req, res) {
    try {
        if(req.body.paymentOption == 1){
            req.body.total = req.body.qty * req.body.price;
        }else if(req.body.paymentOption == 2){
            req.body.total = req.body.qty * req.body.price;
            req.body.total = (req.body.total + (req.body.GST + req.body.SGST + req.body.CGST)) / 100;
        }
        let order = new Order(req.body)
        await order.save();
        // if (project.fixPrice && project.fixPrice > 0){
        //     utils.generateBuilderInvoice(project)
        // }
        return res.json({
            success: true,
            data: {
                order
            },
            success_code: process.env.SUCCESS_STRING_ORDER_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ORDER_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateOrder = async function (req, res) {
    try {
        let query = {};
        query = { _id: req.body.orderId }; 
        let order = await Order.findOneAndUpdate(query, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                order
            },
            success_code: process.env.SUCCESS_STRING_ORDER_UPDATE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ORDER_UPDATE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteOrder = async function (req, res) {
    try {
        await Order.findOneAndUpdate({ _id: req.body.deleteId , isDelete: false}, { isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_ORDER_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_ORDER_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.getOrders = async function (req, res) {
    try {
        let orders = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.orderId) {
            query._id = req.query.orderId;
        } else if (req.query.orderIds) {
            query._id = {$in:req.query.orderIds};
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            orders = await Order.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string"}, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            orders = await Order.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            orders = await Order.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Order.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
                orders = await Order.find(query).sort(sortObj).skip(skip).limit(limit);
        }
        return res.json({
            success: true,
            data: {
                orders,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
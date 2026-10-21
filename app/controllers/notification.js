const Notification = require('../models/Notification')
const utils = require('../utils');
const noOfRecord = 15;

exports.readnotifications = async function (req, res) {
    try {
        let forId = [req.headers.user._id]
        if (req.headers['user'].role == "Advocate" && req.headers['advocateFirm']) {
            forId.push(req.headers['advocateFirm']._id)
        }
        let query = { for: { $in: forId } };
        await Notification.updateMany(query, { read :true})
        exports.countnotifications(req, res)
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.countnotifications = async function (req, res) {
    try {
        let forId = [req.headers.user._id]
        if (req.headers['user'].role == "Advocate" && req.headers['advocateFirm']) {
            forId.push(req.headers['advocateFirm']._id)
        }
        let query = { for: { $in: forId }, read :false};
        let notificationCount = await Notification.countDocuments(query)
        return res.json({
            success: true,
            data:{
                notificationCount: notificationCount
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getnotifications = async function (req, res) {
    try {
        let notifications = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let forId = [req.headers.user._id]
        if (req.headers['user'].role == "Advocate" && req.headers['advocateFirm']){
            forId.push(req.headers['advocateFirm']._id)
        }
        let query = {for: { $in: forId }};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.$or = [
                {title:{ $regex: new RegExp(req.query.searchValue, 'i') }},
                { description:{ $regex: new RegExp(req.query.searchValue, 'i') }}
            ]
        }
        if (req.query.type) {
            query.type = req.query.type
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            notifications = await Notification.find(query);
            utils.generateExcel({ name: "string" }, notifications, "notifications.xlsx", req, res)
            return;
        } else if(req.query.pdf) {
            notifications = await Notification.find(query);
            utils.generatePDF({ name: "string" }, notifications, "notifications.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            notifications = await Notification.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Notification.countDocuments(query);
           /*  if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            notifications = await Notification.find(query).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                notifications,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

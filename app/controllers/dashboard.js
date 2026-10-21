const Template = require('../models/Template');
const GenerateDocument = require('../models/GenerateDocument');
const MasterInvoice = require('../models/MasterInvoice');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Project = require('../models/Project');
const ProjectUnit = require('../models/ProjectUnit');
var Schema = require('mongoose').Types.ObjectId;
const utils = require('../utils');
exports.counts = async function (req, res) {
    try {
        let queryTemplates = { isDelete: { $ne: true } };
        if (req.headers.user.districtId){
            queryTemplates.districtId = req.headers.user.districtId;
        }
        if (req.headers.user.bankId){
            queryTemplates.bankId = req.headers.user.bankId;
        }
        if (req.headers.user.advocateFirmId){
            queryTemplates.advocateFirmId = req.headers.user.advocateFirmId;
        }
        if (req.headers.user.builderFirmId){
            queryTemplates.builderFirmId = req.headers.user.builderFirmId;
        }
        if (req.headers.user.portal){
            queryTemplates.portal = req.headers.user.portal;
        }
        let totalTemplates = await Template.countDocuments(queryTemplates);
        let generatedDocument = await GenerateDocument.countDocuments(queryTemplates);
        return res.json({
            success: true,
            data:{
                totalTemplates,
                generatedDocument,
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.newcounts = async function (req, res) {
    try {
        let totalBuilders = await User.countDocuments({ role:"Builder",isDelete: { $ne: true } });
        let totalAdvocates = await User.countDocuments({ role:"Advocate",isDelete: { $ne: true } });
        let totalDrafters = await User.countDocuments({ role: "Drafter Operational Head",isDelete: { $ne: true } });
        let totalBanks = await Bank.countDocuments({ isDelete: { $ne: true } });
        let query = { isDelete: { $ne: true } };
        let query2 = { isDelete: { $ne: true } };
        if (["Builder"].includes(req.headers.user.role)) {
            query.builderFirmId = req.headers.user.builderFirm._id
        }
        if (["Advocate"].includes(req.headers.user.role)) {
            query.advocateFirmId = req.headers.user.advocateFirm._id
        }
        let totalProjects = await Project.countDocuments(query);
        let totalProjectUnits;
        if (["Builder","Advocate"].includes(req.headers.user.role)) {
            let projects = await Project.distinct("_id",query);
            query2.projectId = { $in: projects };
            totalProjectUnits = await ProjectUnit.countDocuments(query2);
        }else{
            totalProjectUnits = await ProjectUnit.countDocuments(query2);
        }
        return res.json({
            success: true,
            data:{
                totalDrafters,
                totalBanks,
                totalProjects,
                totalProjectUnits,
                totalAdvocates,
                totalBuilders,
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.bankcountsbydistrict = async function (req, res) {
    try {
        let queryTemplates = { isDelete: { $ne: true } };
        if (req.headers.user.districtId){
            queryTemplates.districtId = new Schema(req.headers.user.districtId);
        }
        if (req.headers.user.bankId){
            queryTemplates.bankId = new Schema(req.headers.user.bankId);
        }
        if (req.headers.user.stateId){
            queryTemplates.stateId = new Schema(req.headers.user.stateId);
        }
        if (req.headers.user.advocateFirmId){
            queryTemplates.advocateFirmId = new Schema(req.headers.user.advocateFirmId);
        }
        if (req.headers.user.builderFirmId){
            queryTemplates.builderFirmId = new Schema(req.headers.user.builderFirmId);
        }
        queryTemplates.portal = "Bank";
        let group = {
            $group: {
                _id: "$districtId",
                total: { $sum: 1 }
            }
        }
        let lookup2 = {
            $lookup: {
                from: 'districts',
                let: {
                    districtId: "$_id"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$districtId"]
                            }]
                        }
                    }
                }, {
                    $project: {
                        name: 1
                    }
                }],
                as: 'districtDetail'
            }
        }
        let unwind2 = {
            $unwind: {
                path: "$districtDetail",
                preserveNullAndEmptyArrays: true
            }
        };
        let generatedDocument = await GenerateDocument.aggregate([
            { $match: queryTemplates },
            group, lookup2, unwind2
        ]);
        return res.json({
            success: true,
            data:{
                generatedDocument,
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.countsbydate = async function (req, res) {
    try {
        let queryTemplates = { isDelete: { $ne: true } };
        if (req.headers.user.districtId){
            queryTemplates.districtId = new Schema(req.headers.user.districtId);
        }
        if (req.headers.user.bankId){
            queryTemplates.bankId = new Schema(req.headers.user.bankId);
        }
        if (req.headers.user.stateId){
            queryTemplates.stateId = new Schema(req.headers.user.stateId);
        }
        if (req.headers.user.advocateFirmId){
            queryTemplates.advocateFirmId = new Schema(req.headers.user.advocateFirmId);
        }
        if (req.headers.user.builderFirmId){
            queryTemplates.builderFirmId = new Schema(req.headers.user.builderFirmId);
        }
        if (req.headers.user.portal){
            queryTemplates.portal = req.headers.user.portal;
        }
        let groupQuery = {}
        if(req.query.filter == "Y"){
            groupQuery = { portal: "$portal", filter: { $dateToString: { format: "%Y", date: "$createdAt" } } }
        } else if (req.query.filter == "M") {
            groupQuery = { portal: "$portal", filter: { $dateToString: { format: "%m", date: "$createdAt" } } }
        }
        let group = {
            $group: {
                _id: groupQuery,
                total: { $sum: 1 }
            }
        }
       
        let generatedDocument = await GenerateDocument.aggregate([
            { $match: queryTemplates },
            group
        ]);
        return res.json({
            success: true,
            data:{
                generatedDocument,
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateAllInvoice = async function (req, res, next) {
    try {
        await MasterInvoice.findOneAndUpdate({ _id: req.body.invoiceId }, { isApproved: req.body.isApproved });
        return res.json({
            success: true,
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.newAllInvoices = async function (req, res, next) {
    try {
        let query = {
            $and: []
        };
        if (req.headers.user.role == "Admin" || req.headers.user.role == "Staff Admin") {
        } else if (req.headers.user.role == "City Head" || req.headers.user.role == "Branch Head" || req.headers.user.role == "Operational Head" || req.headers.user.role == "District Head" || req.headers.user.role == "State Head" || req.headers.user.role == "Drafter Head" || req.headers.user.role == "Drafter" || req.headers.user.role == "Drafter Operational Head") {
            let or = [];
            or.push({ "sender._id": req.headers.user.bankId })
            or.push({ "receiver._id": req.headers.user.bankId, isApproved: 1 })
            query.$and.push({
                $or: or
            })
        } else if (req.headers.user.role == "Advocate") {
            let or = [];
            or.push({ "sender._id": req.headers.user.advocateFirmId })
            or.push({ "receiver._id": req.headers.user.advocateFirmId, isApproved: 1 })
            query.$and.push({
                $or: or
            })
        } else if (req.headers.user.role == "Builder" || req.headers.user.role == "Manager" || req.headers.user.role == "Salesman") {
            let or = [];
            or.push({ "sender._id": req.headers.user.builderFirmId })
            or.push({ "receiver._id": req.headers.user.builderFirmId, isApproved: 1 })
            query.$and.push({
                $or: or
            })
        } else if (req.headers.user.role == "Advocate Staff") {
            let or = [];
            or.push({ "sender._id": req.headers.user._id })
            or.push({ "receiver._id": req.headers.user._id, isApproved: 1 })
            query.$and.push({
                $or: or
            })
        } else if (req.headers.user.role == "Drafter Head" || req.headers.user.role == "Drafter" || req.headers.user.role == "Drafter Operational Head") {
            let or = [];
            or.push({ "sender._id": req.headers.user.drafterFirmId })
            or.push({ "receiver._id": req.headers.user.drafterFirmId, isApproved: 1 })
            query.$and.push({
                $or: or
            })
        } else{
            return
        }
        
        if (req.query.invoiceType) {
            query.$and.push({ 'invoiceType': { $in: Number(req.query.invoiceType) } })
        }
        if (req.query.isApproved) {
            query.$and.push({ 'isApproved': { $in: Number(req.query.isApproved) } })
        }
       
        if (req.query.receiverRemainingToSend == "true") {
            query.$and.push({
                "receiverTime": { $ne: null }
            });
        } else if (req.query.receiverRemainingToSend == "false") {
            query.$and.push({
                "receiverTime": { $eq: null }
            });
        }
        if (req.query.searchValue && req.query.searchValue != "") {
            query.$and.push({
                $or: [
                    {
                        "sender.name": { $regex: new RegExp(req.query.searchValue, 'i') }
                    }, {
                        "receiver.name": { $regex: new RegExp(req.query.searchValue, 'i') }
                    }, {
                        "invoiceNo": { $regex: new RegExp(req.query.searchValue, 'i') }
                    }
                ]
            });
        }
        if (req.query.startDate && req.query.startDate != "") {
            let startDate = new Date(req.query.startDate);
            query.$and.push({ invoiceDate: { $gte: startDate } });
        }
        if (req.query.endDate && req.query.endDate != "") {
            let endDate = new Date(req.query.endDate);
            endDate = endDate.setHours(23, 59, 59, 999);
            endDate = new Date(endDate);
            if (req.headers.user.role == "Admin" || req.headers.user.role == "Staff Admin") {
                if (endDate > new Date()) {
                    endDate = new Date();
                }
            }
            query.$and.push({ invoiceDate: { $lte: endDate } });
        } else {
            if (!(req.headers.user.role == "Admin" || req.headers.user.role == "Staff Admin")) {
                query.$and.push({ invoiceDate: { $lte: new Date() } });
            }
        }
        let sort = {};
        if (req.query.sortColumn != "invoiceNo") {
            sort[req.query.sortColumn] = Number(req.query.sortDirection);
        } else {
            sort["invoiceUniqueNo"] = Number(req.query.sortDirection);
        }
        if (req.query.sortColumn != "invoiceNo") {
            sort["invoiceNo"] = -1;
        }
        let page = 1;
        if (req.query.page != undefined) {
            page = req.query.page;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        let skip = (page - 1) * limit;
        if (query.$and.length == 0) {
            query = {}
        }
        
        let invoices
        
        invoices = await MasterInvoice.find(query).sort(sort).skip(skip).limit(limit);
        
        let totalPage = await MasterInvoice.countDocuments(query);
        return res.json({
            success: true,
            data: {
                invoices,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.downloadInvoices = async function (req, res, next) {
    try {
        let query = {}
        query._id = req.query.invoiceId
        let masterInvoice = await MasterInvoice.findOne(query);
        if (!masterInvoice) {
            return;
        }
        utils.getDownloadInvoice(masterInvoice, res, req.query.email, req.query.json)
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
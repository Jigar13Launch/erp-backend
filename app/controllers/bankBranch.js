const BankBranch = require('../models/BankBranch')
const City = require('../models/City')
const utils = require('../utils');
const noOfRecord = 10;
exports.createbankbranch = async function (req, res) {
    try {
        let bankBranch = await BankBranch.findOne({ name: req.body.name, bankId: req.body.bankId, isDelete: false });
        if (bankBranch) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_BANK_BRANCH_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BANK_BRANCH_ALREADY_EXIST]
            });
        }
        if (req.body.cityId){
            let city = await City.findOne({ _id: req.body.cityId })
            req.body.stateId = city.stateId;
            req.body.districtId = city.districtId;
            req.body.countryId = city.countryId;
        }
        bankBranch = new BankBranch(req.body)
        await bankBranch.save()
        return res.json({
            success: true,
            data: {
                bankBranch
            },
            success_code: process.env.SUCCESS_STRING_BANK_BRANCH_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_BRANCH_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatebankbranch = async function (req, res) {
    try {
        let bankBranch
        if (req.body.name){
            bankBranch = await BankBranch.findOne({ _id: { $ne: req.body.bankBranchId }, bankId: req.body.bankId, name: req.body.name, isDelete: false });
            if (bankBranch) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_BANK_BRANCH_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BANK_BRANCH_ALREADY_EXIST]
                });
            }
        }
        if (req.body.cityId) {
            let city = await City.findOne({ _id: req.body.cityId })
            req.body.stateId = city.stateId;
            req.body.districtId = city.districtId;
            req.body.countryId = city.countryId;
        }
        bankBranch = await BankBranch.findOneAndUpdate({ _id: req.body.bankBranchId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                bankBranch
            },
            success_code: process.env.SUCCESS_STRING_BANK_BRANCH_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_BRANCH_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletebankbranch = async function (req, res) {
    try {
        await BankBranch.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_BANK_BRANCH_FIRM_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_BRANCH_FIRM_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getbankbranches = async function (req, res) {
    try {
        let bankBranches = []
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
        
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.bankId) {
            query.bankId = req.query.bankId
        }
        if (!req.query.bankId && req.query.bankIds) {
            query.bankId = { $in: req.query.bankIds.split(",") };
        }
        if (req.query.cityId) {
            query.cityId = req.query.cityId;
        }
        if (req.query.stateId) {
            query.stateId = req.query.stateId;
        }
        if (req.query.districtId) {
            query.districtId = req.query.districtId;
        }
        if (req.query.countryId) {
            query.countryId = req.query.countryId;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.searchValue) {
            query["$or"] = [
                { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { phone: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { ifsc: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { address: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { pincode: { $regex: new RegExp(req.query.searchValue, 'i') } }
            ]
        }
        if (req.query.export) {
            bankBranches = await BankBranch.find(query).populate("bankId", { name: 1 }).populate("cityId", { name: 1 }).populate("stateId", { name: 1 });
            utils.generateExcel({ name: "string", ifsc: "string", phone: "string", address: "string", pincode: "string", "bankId_name": "string", "cityId_name": "string", "stateId_name": "string" }, bankBranches, "bankBranches.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            bankBranches = await BankBranch.find(query).populate("bankId", { name: 1 }).populate("cityId", { name: 1 }).populate("stateId", { name: 1 });
            utils.generatePDF({ name: "string", ifsc: "string", phone: "string", address: "string", pincode: "string", "bankId_name": "string", "cityId_name": "string", "stateId_name": "string" }, bankBranches, "bankBranches.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            bankBranches = await BankBranch.find(query).populate("bankId", { name: 1 }).populate("cityId", { name: 1 }).populate("stateId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await BankBranch.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            bankBranches = await BankBranch.find(query).sort(sortObj).skip(skip).limit(limit).populate("bankId", { name: 1 }).populate("cityId", { name: 1 }).populate("stateId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                bankBranches,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

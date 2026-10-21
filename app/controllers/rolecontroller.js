const Role = require('../models/Role');
const utils = require('../utils');
const whatsapp = require('../whatsapp');
const noOfRecord = 10;
const mongoose = require('mongoose');
exports.createrole = async function (req, res) {
    try {
        let role = await Role.findOne({ name: req.body.name, isDelete :false});
        if (role) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST]
            });
        }
        let body = { ...req.body, createdBy: new mongoose.Types.ObjectId(req.header.userId) }
        role = new Role(body)
        await role.save()
        return res.json({
            success: true,
            data: {
                role
            },
            success_code: process.env.SUCCESS_STRING_INQUIRY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleterole = async function (req, res) {
    try {
        await Role.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_INQUIRY_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updaterole = async function (req, res) {
    try {
        let role
        if (req.body.name) {
            role = await Role.findOne({ _id: { $ne: req.body.roleId }, name: req.body.name, isDelete: false });
            if (role) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_INQUIRY_ALREADY_EXIST]
                });
            }
        }
        role = await Role.findOneAndUpdate({ _id: req.body.roleId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                role
            },
            success_code: process.env.SUCCESS_STRING_INQUIRY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_INQUIRY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getroles = async function (req, res) {
    try {
        let roles = []
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
       
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.searchValue) {
            query["$or"] = [
                { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
            ]
        }
        if (req.query.export) {
            roles = await Role.find(query);
            utils.generateExcel({ name: "string" }, roles, "roles.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            roles = await Role.find(query);
            utils.generatePDF({ name: "string" }, roles, "roles.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            roles = await Role.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Role.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            roles = await Role.find(query).sort(sortObj).skip(skip).limit(limit);
        }
        return res.json({
            success: true,
            data: {
                roles,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

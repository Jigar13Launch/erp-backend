const RegistrarOffice = require('../models/RegistrarOffice')
const utils = require('../utils');
const noOfRecord = 10;
exports.createregistraroffice = async function (req, res) {
    try {
        let registraroffice = await RegistrarOffice.findOne({ name: req.body.name });
        if (registraroffice) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_REGISTRAR_OFFICE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_REGISTRAR_OFFICE_ALREADY_EXIST]
            });
        }
        registraroffice = new RegistrarOffice(req.body)
        await registraroffice.save()
        return res.json({
            success: true,
            data: {
                registraroffice
            },
            success_code: process.env.SUCCESS_STRING_REGISTRAR_OFFICE_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_OFFICE_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateregistraroffice = async function (req, res) {
    try {
        let registraroffice
        if (req.body.name){
            registraroffice = await RegistrarOffice.findOne({ _id: { $ne: req.body.registrarOfficeId }, name: req.body.name });
            if (registraroffice) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_REGISTRAR_OFFICE_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_REGISTRAR_OFFICE_ALREADY_EXIST]
                });
            }
        }
        registraroffice = await RegistrarOffice.findOneAndUpdate({ _id: req.body.registrarOfficeId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                registraroffice
            },
            success_code: process.env.SUCCESS_STRING_REGISTRAR_OFFICE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_OFFICE_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteregistraroffice = async function (req, res) {
    try {
        await RegistrarOffice.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_REGISTRAR_OFFICE_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_OFFICE_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getregistraroffices = async function (req, res) {
    try {
        let registraroffices = []
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
            query["$or"] = [
                { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { address: { $regex: new RegExp(req.query.searchValue, 'i') } }
            ]
        }
        if (!req.query.district) {
            if (req.query.districtId) {
                query.districtId = req.query.districtId;
            }
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            registraroffices = await RegistrarOffice.find(query).populate("districtId", { name: 1 });
            utils.generateExcel({ name: "string", address: "string", districtId_name: "string" }, registraroffices, "registraroffices.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            registraroffices = await RegistrarOffice.find(query).populate("districtId", { name: 1 });
            utils.generatePDF({ name: "string", address: "string", districtId_name: "string" }, registraroffices, "registraroffices.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            registraroffices = await RegistrarOffice.find(query).populate("districtId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await RegistrarOffice.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            registraroffices = await RegistrarOffice.find(query).sort(sortObj).skip(skip).limit(limit).populate("districtId", { name: 1 })
        }
        return res.json({
            success: true,
            data: {
                registraroffices,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

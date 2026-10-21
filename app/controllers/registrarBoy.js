const RegistrarBoy = require('../models/RegistrationBoy')
const utils = require('../utils');
const noOfRecord = 10;
exports.createregistrarboy = async function (req, res) {
    try {
        let registrarboy = await RegistrarBoy.findOne({ name: req.body.name, isDelete: false });
        if (registrarboy) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_REGISTRAR_BOY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_REGISTRAR_BOY_ALREADY_EXIST]
            });
        }
        registrarboy = new RegistrarBoy(req.body)
        await registrarboy.save()
        return res.json({
            success: true,
            data: {
                registrarboy
            },
            success_code: process.env.SUCCESS_STRING_REGISTRAR_BOY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_BOY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteregistrarboy = async function (req, res) {
    try {
        await RegistrarBoy.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_REGISTRAR_BOY_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_BOY_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateregistrarboy = async function (req, res) {
    try {
        let registrarboy
        if (req.body.name){
            registrarboy = await RegistrarBoy.findOne({ _id: { $ne: req.body.registrarBoyId }, name: req.body.name, isDelete: false });
            if (registrarboy) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_REGISTRAR_BOY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_REGISTRAR_BOY_ALREADY_EXIST]
                });
            }
        }
        registrarboy = await RegistrarBoy.findOneAndUpdate({ _id: req.body.registrarBoyId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                registrarboy
            },
            success_code: process.env.SUCCESS_STRING_REGISTRAR_BOY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_REGISTRAR_BOY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getregistrarboys = async function (req, res) {
    try {
        let registrarboys = []
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
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.districtId) {
            query.districtId = req.query.districtId;
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            registrarboys = await RegistrarBoy.find(query).populate("districtId", { name: 1 });
            utils.generateExcel({ name: "string", address: "string", districtId_name: "string" }, registrarboys, "registrarboys.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            registrarboys = await RegistrarBoy.find(query).populate("districtId", { name: 1 });
            utils.generatePDF({ name: "string", address: "string", districtId_name: "string" }, registrarboys, "registrarboys.xlsx", req, res)
            return;
        } else if (req.query.page == undefined) {
            registrarboys = await RegistrarBoy.find(query).populate("districtId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await RegistrarBoy.countDocuments(query);
           /*  if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            registrarboys = await RegistrarBoy.find(query).sort(sortObj).skip(skip).limit(limit).populate("districtId", { name: 1 })
        }
        return res.json({
            success: true,
            data: {
                registrarboys,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

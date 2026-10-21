const Bank = require('../models/Bank')
const DrafterFirm = require('../models/DrafterFirm')
const utils = require('../utils');
const noOfRecord = 10;
exports.createbank = async function (req, res) {
    try {
        let bank = await Bank.findOne({ name: req.body.name, isDelete:false });
        if (bank) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_BANK_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BANK_ALREADY_EXIST]
            });
        }
        req.body.invoiceDetail = {
            name:req.body.invoiceName,
            address:req.body.invoiceAddress,
            email:req.body.invoiceEmail,
            gstNo:req.body.invoiceGstNo,
        }
        bank = new Bank(req.body)
        if (req.files && req.files.length > 0) {
            var image_name = bank._id;
            var url = utils.getImageFolderPath(req, 14) + image_name + '.docx';
            bank.titleDoc = {
                url: url,
                originalname: req.files[0].originalname,
            };
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.docx', 14);
        }
        await bank.save()
        return res.json({
            success: true,
            data: {
                bank
            },
            success_code: process.env.SUCCESS_STRING_BANK_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatebank = async function (req, res) {
    try {
        let bank
        if (req.body.name){
            bank = await Bank.findOne({ _id: { $ne: req.body.bankId }, name: req.body.name, isDelete: false });
            if (bank) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_BANK_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BANK_ALREADY_EXIST]
                });
            }
        }
        req.body.invoiceDetail = {
            name: req.body.invoiceName,
            address: req.body.invoiceAddress,
            email: req.body.invoiceEmail,
            gstNo: req.body.invoiceGstNo,
        }
        console.log(req.body)
        bank = await Bank.findOneAndUpdate({ _id: req.body.bankId }, req.body, { new: true })
        if (req.files && req.files.length > 0) {
            var image_name = bank._id;
            var url = utils.getImageFolderPath(req, 14) + image_name + '.docx';
            bank.titleDoc ={
                url: url,
                originalname: req.files[0].originalname,
            };
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.docx', 14);
            await bank.save()
        }
        return res.json({
            success: true,
            data: {
                bank
            },
            success_code: process.env.SUCCESS_STRING_BANK_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletebank = async function (req, res) {
    try {
        await Bank.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete :true});
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_BANK_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BANK_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getbanks = async function (req, res) {
    try {
        let banks = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = { isDelete: { $ne: true }};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.mpanel) {
            query.titleDoc = { $exists: true };
        }
        if (req.query.bankIds) {
            query._id = { $in: req.query.bankIds.split(",") };
        }
        if (req.query.bankId) {
            query._id = req.query.bankId
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            banks = await Bank.find(query);
            utils.generateExcel({ name: "string" }, banks, "banks.xlsx", req, res)
            return;
        } else if(req.query.pdf) {
            banks = await Bank.find(query);
            utils.generatePDF({ name: "string" }, banks, "banks.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            banks = await Bank.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Bank.countDocuments(query);
           /*  if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            banks = await Bank.find(query).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                banks,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

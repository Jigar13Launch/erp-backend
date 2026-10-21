const AWS = require('aws-sdk');
const fs = require("fs");
const path = require('path');
const excellent = require('excellent');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
const moment = require('moment');
const utils = require('./utils');
const emailController = require('./email');
const moment_timezone = require('moment-timezone');
const numberToText = require('number2text');
const { ToWords } = require('to-words');
const { PDFDocument, rgb } = require('pdf-lib');
const sizeOf = require('image-size');
const fmt = require('indian-number-format')
const TemplateKeys = require('./models/TemplateKeys');
const AutoIncrement = require('./models/AutoIncrement');
const Category = require('./models/Category');
const Firm = require('./models/AdvocateFirm');
const Bank = require('./models/Bank');
const MasterInvoice = require('./models/MasterInvoice');
const User = require('./models/User');
const DocumentLogsScema = require('./models/DocumentLogs');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const BuilderFirm = require('./models/BuilderFirm')
const DrafterFirm = require('./models/DrafterFirm')
const libre = require('libreoffice-convert');
const axios = require('axios');

exports.excludesParams = async function () {
    return ["CUSTOMER_CARE", "WEBSITE_LINK", "STAMP_DUTY", "CUSTOMER_PHONE", "SALES_PHONE", "REGISTRATION_FEE", "TOTAL_FEE", "STAMP_DUTY_RELEASE", "REGISTRATION_FEE_RELEASE", "TOTAL_FEE_RELEASE", "NO", "LAWYER_FEE", "BRANCH_NAME", "BRANCH_ADDRESS", "BANK_NAME", "BANK_ADDRESS", "REGISTRATION_OFFICE_NAME", "REGISTRATION_OFFICE_ADDRESS", "DISTRICT_NAME", ""]
}
exports.excludesProjectParams = async function () {
    return {
        RECEIVED_PAYMENT: "",
        RECEIVED_PAYMENT_IN_WORDS: "",
        REMAINING_PAYMENT: "",
        REMAINING_PAYMENT_IN_WORDS: "",
        SALE_DEED_AMOUNT: "",
        SALE_DEED_AMOUNT_IN_WORDS: "",
        PURCHASER_ALL: {
            "AUTHORISED_PERSON": "",
            "GST": "",
            "PURCHASING_TYPE": "",
            "NAME": "",
            "PHONE": "",
            "EMAIL": "",
            "AGE": "",
            "OCCUPATION": "",
            "RELIGION": "",
            "PAN_NO": "",
            "AADHAR_NO": "",
            "ADDRESS": "",
        },
        PAYMENT_ALL: {
            "DATE": "",
            "AMOUNT": "",
            "AMOUNT_IN_WORDS": "",
            "PAY_TYPE": "",
            "REF_NO": "",
            "BANK": "",
            "BRANCH": "",
            "CITY": "",
            "COMMENTS": ""
        },
        UNIT: "",
        BLOCK: "",
        FLOOR: "",
        CARPET_AREA: "",
        BUILTUP_AREA: "",
        SUPERBUILTUP_AREA: "",
        UNDIVIDED_LAND: "",
        BALCONY_AREA: "",
        ADJOINING_LAND_AREA: "",
        TOTAL_PLOT_AREA: "",
        TARRACE_AREA: "",
        WASH_AREA: "",
        CARPET_AREA_FEET: "",
        BUILTUP_AREA_FEET: "",
        SUPERBUILTUP_AREA_FEET: "",
        UNDIVIDED_LAND: "",
        BALCONY_AREA_FEET: "",
        ADJOINING_LAND_AREA_FEET: "",
        TOTAL_PLOT_AREA_FEET: "",
        TARRACE_AREA_FEET: "",
        WASH_AREA_FEET: "",
        CARPET_AREA_YARD: "",
        BUILTUP_AREA_YARD: "",
        SUPERBUILTUP_AREA_YARD: "",
        UNDIVIDED_LAND: "",
        BALCONY_AREA_YARD: "",
        ADJOINING_LAND_AREA_YARD: "",
        TOTAL_PLOT_AREA_YARD: "",
        TARRACE_AREA_YARD: "",
        WASH_AREA_YARD: "",
        EAST_SIDE: "",
        WEST_SIDE: "",
        SOUTH_SIDE: "",
        NORTH_SIDE: "",
        PARKING_NO: "",
        PROJECT_NAME: "",
        CURRENT_DATE: "",
    }
}
exports.documentLogs = async function (req, actionType, generatedDocumentId) {
    try {
        let actionString = "";
        switch (actionType) {
            case "Create":
                actionString = `Document is created by ${req.headers['user'].name} (${req.headers['user'].role})`
                break;
            case "Update":
                actionString = `Document is updated by ${req.headers['user'].name} (${req.headers['user'].role})`
                break;
            case "Remove":
                actionString = `Document is removed by ${req.headers['user'].name} (${req.headers['user'].role})`
                break;
            case "Status Change":
                actionString = `Document's Status is updated by ${req.headers['user'].name} (${req.headers['user'].role})`
                break;
            case "Regestation Detail":
                actionString = `Document's Regestation Detail is updated by ${req.headers['user'].name} (${req.headers['user'].role})`
                break;
            case "Legal Fee Received":
                actionString = `Document's Legal Fee is Received`
                break;
            case "PO Detail":
                actionString = `Document's PO Detail is Received`
                break;
            default:
                break;
        }
        await DocumentLogsScema.create({
            actionType: actionType,
            actionString: actionString,
            actionBy: req.headers['user'] ? req.headers['user']._id : null,
            generatedDocumentId: generatedDocumentId
        })
    } catch (err) {
        console.log(err)
    }
};
exports.tokenGenerator = function (length) {

    if (typeof length == "undefined")
        length = 32;
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    return token;

};
exports.otpGenerator = function (length) {

    if (typeof length == "undefined")
        length = 4;
    var token = "";
    var possible = "0123456789";
    for (var i = 0; i < length; i++)
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    return token;

};
// this function is use to set predefine variables for project unit ,payment & purchaser detail
exports.setDefaultDocument = async function (projectUnit, project, timezone = "Asia/Calcutta", template) {
    let data = {};
    data["RECEIVED_PAYMENT"] = fmt.format(Number(projectUnit.invoice.receivedAmount));
    data["RECEIVED_PAYMENT_IN_WORDS"] = numberToText(Number(projectUnit.invoice.receivedAmount), 'Indian');

    data["REMAINING_PAYMENT"] = fmt.format(Number(projectUnit.invoice.pendingAmount));
    data["REMAINING_PAYMENT_IN_WORDS"] = numberToText(Number(projectUnit.invoice.pendingAmount), 'Indian');
    data["SALE_DEED_AMOUNT"] = fmt.format(Number(projectUnit.saleDeedAmount));
    data["SALE_DEED_AMOUNT_IN_WORDS"] = numberToText(Number(projectUnit.saleDeedAmount), 'Indian');
    data["PURCHASER_ALL"] = [];
    data["PAYMENT_ALL"] = [];
    for (let purchaser of projectUnit.purchaser) {
        let obj = {
            "AUTHORISED_PERSON": purchaser.authorisedPerson,
            "GST": purchaser.gst,
            "PURCHASING_TYPE": purchaser.purchaserType,
            "NAME": purchaser.name.toLocaleUpperCase(),
            "PHONE": purchaser.phoneCode + purchaser.phone,
            "EMAIL": purchaser.email,
            "AGE": purchaser.age,
            "OCCUPATION": purchaser.occupation,
            "RELIGION": purchaser.religion,
            "PAN_NO": purchaser.panNo,
            "AADHAR_NO": purchaser.aadharNo,
            "ADDRESS": purchaser.address
        }
        data["PURCHASER_ALL"].push(obj)
    }
    for (let payment of projectUnit.payment) {
        let obj = {
            "DATE": moment_timezone(payment.date).tz(timezone).format("DD.MM.YYYY"),
            "AMOUNT": fmt.format(Number(payment.amount)),
            "AMOUNT_IN_WORDS": numberToText(Number(payment.amount), 'Indian'),
            "PAY_TYPE": payment.payType,
            "REF_NO": payment.refNo,
            "BANK": payment.bank,
            "BRANCH": payment.branch,
            "CITY": payment.city,
            "COMMENTS": payment.comments,
        }
        data["PAYMENT_ALL"].push(obj)
    }
    data["UNIT"] = projectUnit.unit;
    data["BLOCK"] = projectUnit.block;
    data["FLOOR"] = projectUnit.floor;
    data["CARPET_AREA"] = projectUnit.carpetArea;
    data["BUILTUP_AREA"] = projectUnit.builtUpArea;
    data["SUPERBUILTUP_AREA"] = projectUnit.superBuiltUpArea;
    data["UNDIVIDED_LAND"] = projectUnit.undevidedLand;
    data["EAST_SIDE"] = projectUnit.eastSide;
    data["WEST_SIDE"] = projectUnit.westSide;
    data["SOUTH_SIDE"] = projectUnit.southSide;
    data["NORTH_SIDE"] = projectUnit.northSide;
    data["TOTAL_PLOT_AREA"] = projectUnit.totalPlotArea;
    data["PARKING_NO"] = projectUnit.parkingNo;
    data["TARRACE_AREA"] = projectUnit.tarraceArea;
    data["WASH_AREA"] = projectUnit.washArea;
    data["BALCONY_AREA"] = projectUnit.balconyArea;
    data["ADJOINING_LAND_AREA"] = projectUnit.adjoiningLandArea;
    data["REMARK"] = projectUnit.remark;
    if (data["CARPET_AREA"]) {
        data["CARPET_AREA_FEET"] = Math.floor(data["CARPET_AREA"] * 10.7639100001464);
    } else {
        data["CARPET_AREA_FEET"] = "";
    }
    if (data["BUILTUP_AREA"]) {
        data["BUILTUP_AREA_FEET"] = Math.floor(data["BUILTUP_AREA"] * 10.7639100001464);
    } else {
        data["BUILTUP_AREA_FEET"] = "";
    }
    if (data["SUPERBUILTUP_AREA"]) {
        data["SUPERBUILTUP_AREA_FEET"] = Math.floor(data["SUPERBUILTUP_AREA"] * 10.7639100001464);
    } else {
        data["SUPERBUILTUP_AREA_FEET"] = "";
    }
    if (data["UNDIVIDED"]) {
        data["UNDIVIDED_LAND"] = Math.floor(data["UNDIVIDED"] * 10.7639100001464);
    } else {
        data["UNDIVIDED_LAND"] = "";
    }
    if (data["BALCONY_AREA"]) {
        data["BALCONY_AREA_FEET"] = Math.floor(data["BALCONY_AREA"] * 10.7639100001464);
    } else {
        data["BALCONY_AREA_FEET"] = "";
    }
    if (data["ADJOINING_LAND_AREA"]) {
        data["ADJOINING_LAND_AREA_FEET"] = Math.floor(data["ADJOINING_LAND_AREA"] * 10.7639100001464);
    } else {
        data["ADJOINING_LAND_AREA_FEET"] = "";
    }
    if (data["TOTAL_PLOT_AREA"]) {
        data["TOTAL_PLOT_AREA_FEET"] = Math.floor(data["TOTAL_PLOT_AREA"] * 10.7639100001464);
    } else {
        data["TOTAL_PLOT_AREA_FEET"] = "";
    }
    if (data["TARRACE_AREA"]) {
        data["TARRACE_AREA_FEET"] = Math.floor(data["TARRACE_AREA"] * 10.7639100001464);
    } else {
        data["TARRACE_AREA_FEET"] = "";
    }
    if (data["WASH_AREA"]) {
        data["WASH_AREA_FEET"] = Math.floor(data["WASH_AREA"] * 10.7639100001464);
    } else {
        data["WASH_AREA_FEET"] = "";
    }
    if (data["CARPET_AREA"]) {
        data["CARPET_AREA_YARD"] = Math.floor(data["CARPET_AREA"] * 1.19599);
    } else {
        data["CARPET_AREA_YARD"] = "";
    }
    if (data["BUILTUP_AREA"]) {
        data["BUILTUP_AREA_YARD"] = Math.floor(data["BUILTUP_AREA"] * 1.19599);
    } else {
        data["BUILTUP_AREA_YARD"] = "";
    }
    if (data["SUPERBUILTUP_AREA"]) {
        data["SUPERBUILTUP_AREA_YARD"] = Math.floor(data["SUPERBUILTUP_AREA"] * 1.19599);
    } else {
        data["SUPERBUILTUP_AREA_YARD"] = "";
    }
    if (data["UNDIVIDED"]) {
        data["UNDIVIDED_LAND"] = Math.floor(data["UNDIVIDED"] * 1.19599);
    } else {
        data["UNDIVIDED_LAND"] = "";
    }
    if (data["BALCONY_AREA"]) {
        data["BALCONY_AREA_YARD"] = Math.floor(data["BALCONY_AREA"] * 1.19599);
    } else {
        data["BALCONY_AREA_YARD"] = "";
    }
    if (data["ADJOINING_LAND_AREA"]) {
        data["ADJOINING_LAND_AREA_YARD"] = Math.floor(data["ADJOINING_LAND_AREA"] * 1.19599);
    } else {
        data["ADJOINING_LAND_AREA_YARD"] = "";
    }
    if (data["TOTAL_PLOT_AREA"]) {
        data["TOTAL_PLOT_AREA_YARD"] = Math.floor(data["TOTAL_PLOT_AREA"] * 1.19599);
    } else {
        data["TOTAL_PLOT_AREA_YARD"] = "";
    }
    if (data["TARRACE_AREA"]) {
        data["TARRACE_AREA_YARD"] = Math.floor(data["TARRACE_AREA"] * 1.19599);
    } else {
        data["TARRACE_AREA_YARD"] = "";
    }
    if (data["WASH_AREA"]) {
        data["WASH_AREA_YARD"] = Math.floor(data["WASH_AREA"] * 1.19599);
    } else {
        data["WASH_AREA_YARD"] = "";
    }

    data["PROJECT_NAME"] = project.name;
    data["BUILDER_NAME"] = "";
    data["CURRENT_DATE"] = moment_timezone().tz(timezone).format("DD.MM.YYYY");
    return data;
}
exports.setAmountAndNo = async function (array, isSub = false) {
    for (let i = 0; i < array.length; i++) {

        array[i]["NO"] = i + 1
        if (array[i]["PROPERTY_DESCRIPTION"]) {
            array[i]["PROPERTY_DESCRIPTION"] = array[i]["PROPERTY_DESCRIPTION"].replace(/\r/g, ' ');
            array[i]["PROPERTY_DESCRIPTION"] = array[i]["PROPERTY_DESCRIPTION"].replace(/\n/g, ' ');
        }
        if (array[i]["AMOUNT"]) {
            array[i]["AMOUNT"] = array[i]["AMOUNT"].replace(/,/g, '')
            array[i]["AMOUNT"] = fmt.format(array[i]["AMOUNT"]);
        }
        for (let key of Object.keys(array[i])) {
            if (typeof array[i][key] == "object") {
                array[i][key] = await exports.setAmountAndNo(array[i][key], true)
            }
        }
    }
    return array;
}
exports.templateDataWithHeader = async function (templateData, templateKey, template, generateDocument = null) {
    let newData = JSON.parse(JSON.stringify(templateData));
    let variables = Object.keys(newData);
    for (let variable of variables) {
        let entry = templateKey.find((x) => x.name == variable);
        if (typeof newData[variable] == "object") {
            if (entry && entry.isHeaders && entry.headers) {

                let headers = entry.headers
                let obj = {

                }
                for (let header of Object.keys(headers)) {
                    obj[header] = headers[header][template.language]
                }
                newData[variable].unshift(obj)
                newData[variable] = await exports.setAmountAndNo(newData[variable])
            } else {
                newData[variable] = await exports.setAmountAndNo(newData[variable])
            }
        }
        if (variable == "LOAN_AMOUNT") {
            let amount = Number(newData["LOAN_AMOUNT"].replace(/,/g, ""));
            if (amount <= 100000000) {
                newData["STAMP_DUTY"] = amount * 0.35 * 0.01;
            } else {
                newData["STAMP_DUTY"] = amount * 0.7 * 0.01;
            }
            newData["STAMP_DUTY"] = Math.round(newData["STAMP_DUTY"]);
            newData["REGISTRATION_FEE"] = 5600;
            newData["TOTAL_FEE"] = Number(newData["STAMP_DUTY"]) + Number(newData["REGISTRATION_FEE"]);
            newData["STAMP_DUTY_RELEASE"] = 300;
            newData["REGISTRATION_FEE_RELEASE"] = 500;
            newData["TOTAL_FEE_RELEASE"] = Number(newData["STAMP_DUTY_RELEASE"]) + Number(newData["REGISTRATION_FEE_RELEASE"]);

            newData["STAMP_DUTY"] = fmt.format(newData["STAMP_DUTY"]);
            newData["REGISTRATION_FEE"] = fmt.format(newData["REGISTRATION_FEE"]);
            newData["TOTAL_FEE"] = fmt.format(newData["TOTAL_FEE"]);
            newData["STAMP_DUTY_RELEASE"] = fmt.format(newData["STAMP_DUTY_RELEASE"]);
            newData["REGISTRATION_FEE_RELEASE"] = fmt.format(newData["REGISTRATION_FEE_RELEASE"]);
            newData["TOTAL_FEE_RELEASE"] = fmt.format(newData["TOTAL_FEE_RELEASE"]);
        }
    }
    if (generateDocument.branchId) {
        newData["BRANCH_NAME"] = generateDocument.branchId.name;
        newData["BRANCH_ADDRESS"] = generateDocument.branchId.address;
    } else {
        newData["BRANCH_NAME"] = "";
        newData["BRANCH_ADDRESS"] = "";
    }
    if (generateDocument.bankId) {
        newData["BANK_NAME"] = generateDocument.bankId.name;
        newData["BANK_ADDRESS"] = generateDocument.bankId.address;
    } else {
        newData["BANK_NAME"] = "";
        newData["BANK_ADDRESS"] = "";
    }
    if (generateDocument.registrarOfficeId) {
        newData["REGISTRATION_OFFICE_NAME"] = generateDocument.registrarOfficeId.name;
        newData["REGISTRATION_OFFICE_ADDRESS"] = generateDocument.registrarOfficeId.address;
    } else {
        newData["REGISTRATION_OFFICE_NAME"] = "";
        newData["REGISTRATION_OFFICE_ADDRESS"] = "";
    }
    if (generateDocument.districtId) {
        newData["DISTRICT_NAME"] = generateDocument.districtId.name;
    } else {
        newData["DISTRICT_NAME"] = "";
    }
    newData["LAWYER_FEE"] = template.fees;
    newData["CUSTOMER_PHONE"] = generateDocument.customerPhoneCode + generateDocument.customerPhone;
    newData["SALES_PHONE"] = generateDocument.salesPhoneCode + generateDocument.salesPhone;
    newData["CUSTOMER_CARE"] = settings.supportPhone;
    newData["WEBSITE_LINK"] = settings.frontUrl;
    return newData;
}
exports.textConverter = async function (key, language, templateData, isSub = false) {

    if (typeof templateData[key] == "object") {
        for (let i = 0; i < templateData[key].length; i++) {
            for (let key2 of Object.keys(templateData[key][i])) {
                await exports.textConverter(key2, language, templateData[key][i], true)
            }
        }
    } else if (key.includes("_IN_WORDS") && templateData[key.replace("_IN_WORDS", "")]) {

        let amount = templateData[key.replace("_IN_WORDS", "")].match(/\d+/g).join("");
        if (language == "English") {
            templateData[key] = numberToText(Number(amount), 'Indian') + " Only";
        } else if (language == "Hindi") {
            const toWords = new ToWords({
                localeCode: 'hi-IN',
                converterOptions: {
                    currency: true,
                    currencyOptions: {
                        // can be used to override defaults for the selected locale
                        name: 'रुपये',
                        plural: 'रुपये',
                        symbol: '₹',
                        fractionalUnit: {
                            name: 'पैसा',
                            plural: 'पैसा',
                            symbol: '',
                        },
                    },
                }
            });

            templateData[key] = toWords.convert(Number(amount)) + " पूरा";
        } else {
            const toWords = new ToWords({
                localeCode: 'gu-IN',
                converterOptions: {
                    currency: true,
                    currencyOptions: {
                        // can be used to override defaults for the selected locale
                        name: 'રૂપિયા',
                        plural: 'રૂપિયા',
                        symbol: '₹',
                        fractionalUnit: {
                            name: 'પૈસા',
                            plural: 'પૈસા',
                            symbol: '',
                        },
                    },
                }
            });

            templateData[key] = toWords.convert(Number(amount)) + " પુરા";
        }
    }
    return;
}
exports.setGeneralKeys = async function (templateData, timezone = "Asia/Calcutta", template) {

    let variables = Object.keys(templateData)
    let templateKeys = await TemplateKeys.find({ name: { $in: variables } });
    for (let templateKey of templateKeys) {
        if (!templateData[templateKey.name] && templateKey.speciality == "date") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("DD.MM.YYYY")
        } else if (!templateData[templateKey.name] && templateKey.speciality == "year") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("YYYY")
        } else if (!templateData[templateKey.name] && templateKey.speciality == "dayname") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("dddd")
        } else if (!templateData[templateKey.name] && templateKey.speciality == "day") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("dd")
        } else if (!templateData[templateKey.name] && templateKey.speciality == "monthname") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("MMMM")
        } else if (!templateData[templateKey.name] && templateKey.speciality == "month") {
            templateData[templateKey.name] = moment_timezone().tz(timezone).format("MM")
        } else if (templateKey.speciality == "amount" && templateData[templateKey.name]) {
            let amount = String(templateData[templateKey.name]).match(/\d+/g).join("");
            templateData[templateKey.name] = fmt.format(Number(amount));
        }
    }
    for (const [key, values] of Object.entries(templateData)) {
        if (typeof values == "object") {
            for (let value of values) {
                for (const [key2, value2] of Object.entries(value)) {
                    await exports.textConverter(key2, template.language, value)
                }
            }
        } else {
            await exports.textConverter(key, template.language, templateData)
        }
    }
    return templateData;
}
exports.catchErrorLog = async function (error, req = null, res = null) {
    console.error('ERROR! ', new Date());
    if (res) {

        res.json({
            success: false,
            error_code: process.env.ERROR_CODE_SOMETHING_WENT_WRONG,
            error_message: error.message
        });
    }
    if (req) {
        console.error(req.query);
        console.error(req.body);
        console.error(req.originalUrl);
    }
    console.error(error);
}
exports.getImageFolderPath = function (req, id) {
    //// return req.protocol + '://' + req.get('host') + utils.getImageFolderName(id);
    return utils.getImageFolderName(id);
};
exports.getImageFolderName = function (id) {
    switch (id) {
        case 1:
            return 'products/';
        case 2:
            return 'buy/';
        case 3:
            return 'expenses/';
        case 4:
            return 'sells/';
        case 5:
            return 'doc3/';
        case 6:
            return 'unitdocs/';
        case 7:
            return 'projectdocs/';
        case 8:
            return 'profile/';
        case 9:
            return 'logo/';
        case 10:
            return 'keydocuments/';
        case 11:
            return 'po/';
        case 12:
            return 'lawdocs/';
        case 13:
            return 'signature/';
        case 14:
            return 'bank/';
        case 15:
            return 'folderfile/';
        default:
            break;
    }
};
exports.saveImageFolderPath = function (id) {

    if (settings.isUseAwsBucket && [15].includes(id)) {
        return utils.getImageFolderName(id);
    } else {
        return './uploads/' + utils.getImageFolderName(id);
    }
};
const IMAGE_TYPE_EXTENSIONS = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    html: 'text/html',
    pdf: 'application/pdf',
    htm: 'text/html',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    zip: 'application/x-zip-compressed'
}
exports.saveImageFromBrowser = function (local_image_path, image_name, id, content = null, subfolderId = null) {
    let file_new_path;
    if (subfolderId) {
        file_new_path = utils.saveImageFolderPath(id) + subfolderId;
        console.log('Saving image to:', file_new_path);
        if (settings.isUseAwsBucket && file_new_path.includes("folderfile/")) {

        } else {
            if (!fs.existsSync(file_new_path)) {
                console.log('Creating directory:', file_new_path); // add this
                fs.mkdirSync(file_new_path, { recursive: true });
                console.log('Folder created successfully');        // add this
            }
        }
        file_new_path = file_new_path + "/" + image_name;

    } else {
        const folderPath = utils.saveImageFolderPath(id);
        if (!fs.existsSync(folderPath)) {
            console.log('Creating directory:', folderPath);
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Folder created successfully');
        }
        file_new_path = folderPath + image_name;
    }
    let data
    if (local_image_path) {
        data = fs.readFileSync(local_image_path);
    } else {
        data = content;
    }
    if (settings.isUseAwsBucket && file_new_path.includes("folderfile/")) {
        AWS.config.update({ accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretKeyId });
        var s3 = new AWS.S3();
        var base64data = new Buffer(data, 'binary');
        let uploadObjectData = {
            Bucket: settings.awsBucketName,
            Key: file_new_path,
            Body: base64data,
            //ACL: 'public-read'
        }
        let ext = file_new_path.split(".")
        if (Object.keys(FILE_TYPE_EXTENSIONS).includes(ext[ext.length - 1].toLowerCase())) {
            uploadObjectData['ContentType'] = FILE_TYPE_EXTENSIONS[ext[ext.length - 1].toLowerCase()]
        }
        s3.putObject(uploadObjectData, function (resp, data) {
            if (local_image_path && fs.existsSync(local_image_path)) {
                fs.unlinkSync(local_image_path);
            }
            fs.unlink(local_image_path, function (err, file) {
                if (err) {
                    console.error(err);
                } else {
                }
            });
        });
    } else {
        fs.writeFile(file_new_path, data, 'binary', function (err) {
            if (err) {
            } else {
                response = {
                    message: 'File uploaded successfully'
                };
                /* fs.unlink(local_image_path, function (err, file) {
                    if (err) {
                        console.error(err);
                    } else {
                    }
                }); */
            }
        });
    }
};
exports.deleteImageFromFolder = function (old_img_path, id, subfolderId = null) {


    if (old_img_path != "" || old_img_path != null) {
        var old_file_name = old_img_path.split('/');

        var fs = require('fs');
        let old_file_path
        if (subfolderId) {
            old_file_path = utils.saveImageFolderPath(id) + subfolderId + "/" + old_file_name[old_file_name.length - 1];
        } else {
            old_file_path = utils.saveImageFolderPath(id) + old_file_name[old_file_name.length - 1];
        }

        if (settings.isUseAwsBucket && old_file_path.includes("folderfile/")) {
            AWS.config.update({ accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretKeyId });
            var s3 = new AWS.S3();
            s3.deleteObject({
                Bucket: settings.awsBucketName,
                Key: old_file_path
            }, function (err, data) {
            })
        } else {
            fs.unlink(old_file_path, function (err, file) {
                if (err) {
                    console.error(err);
                } else {
                }
            });
        }
    }

};
exports.PdfWithSignature = function (filepath, ImageBytes) {
    const fs = require('fs').promises;

    async function main() {
        const inputPath = './uploads/' + filepath;
        const outputPath = inputPath.replace("/lawdocs/", "/titlesignature/");

        // Read file
        let pdfBuf = await fs.readFile(inputPath);

        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        //let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        // Here in done you have pdf file which you can save or transfer in another stream
        const scaleToFitPage = (imageWidth, imageHeight, pageWidth, pageHeight) => {
            const scaleX = pageWidth / imageWidth;
            const scaleY = pageHeight / imageHeight;
            return Math.min(scaleX, scaleY);
        };
        const pdfDoc = await PDFDocument.load(pdfBuf);
        const dimensions = sizeOf(ImageBytes);
        let embeddedImage = await pdfDoc.embedPng(ImageBytes)
        const pages = pdfDoc.getPages();
        pages.forEach(page => {
            const scaleFactor = scaleToFitPage(dimensions.width, dimensions.height, page.getWidth(), page.getHeight());
            const scaledWidth = dimensions.width * scaleFactor;
            const scaledHeight = dimensions.height * scaleFactor;
            page.drawImage(embeddedImage, {
                x: 500,
                y: 10,
                width: 80,
                height: 40,
            });
        });
        pdfBuf = await pdfDoc.save()
        console.log(outputPath)
        await fs.writeFile(outputPath, pdfBuf);
        /*  if (generateDocument.salesEmail && !generateDocument.isDraft){
             var buffer = await Buffer.from(pdfBuf, "base64");
             attachments = [{
                 filename: template.name + ".pdf",
                 //content: await fs.createReadStream(req.files[0].path),
                 content: buffer,
             }];
             let generatedBy = await User.findById(generateDocument.generatedById)
             let category = await Category.findById(generateDocument.categoryId)
             emailController.bankDocument(null, generateDocument.salesEmail,{
                 amount: generateDocument.description["LOAN_AMOUNT"],
                 name: generateDocument.customerName,
                 template: category.name,
                 sendedBy: generatedBy.name
             }, attachments)
             // utils.mail_notification(generateDocument.salesEmail, "Generated Document", "", "",true,attachments)
         } */
    }

    main().catch(function (err) {
        console.log(`Error converting file: ${err}`);
    });
}
exports.docToPdfWithSignature = function (titleRequest, docxBuf) {
    let filepath = titleRequest.titleDoc.url;
    const fs = require('fs').promises;
    libre.convertAsync = require('util').promisify(libre.convert);

    async function main() {
        const ext = '.pdf'
        const inputPath = './uploads/' + filepath;
        const outputPath = inputPath.replace(".docx", ext);

        // Read file
        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        const pdfDoc = await PDFDocument.load(pdfBuf);
        if (titleRequest.titleDocSearchReport1 && titleRequest.titleDocSearchReport1.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocSearchReport1" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }
        if (titleRequest.titleDocSearchReport2 && titleRequest.titleDocSearchReport2.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocSearchReport2" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }
        if (titleRequest.titleDocSearchReceipt1 && titleRequest.titleDocSearchReceipt1.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocSearchReceipt1" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }
        if (titleRequest.titleDocSearchReceipt2 && titleRequest.titleDocSearchReceipt2.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocSearchReceipt2" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }
        if (titleRequest.titleDocReveanue1 && titleRequest.titleDocReveanue1.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocReveanue1" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }
        if (titleRequest.titleDocReveanue2 && titleRequest.titleDocReveanue2.url) {
            const ImageBytes = await fs.readFile(inputPath.replace(".docx", "-titleDocReveanue2" + ext));
            const sourcePdf = await PDFDocument.load(ImageBytes);
            for (const sourcePage of sourcePdf.getPages()) {
                const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                const pageDims = pageEmbed.scale(1);
                const newPage = pdfDoc.addPage();
                // Draw the embedded page in the center of the new page
                newPage.drawPage(pageEmbed, {
                    x: newPage.getWidth() / 2 - pageDims.width / 2,
                    y: newPage.getHeight() / 2 - pageDims.height / 2,
                    width: pageDims.width,
                    height: pageDims.height,
                });
            }
        }

        pdfBuf = await pdfDoc.save()
        await fs.writeFile(outputPath, pdfBuf);
    }

    main().catch(function (err) {
        console.log(`Error converting file: ${err}`);
    });
}
exports.docToPdf = function (filepath, generateDocument, template, images = []) {
    const fs = require('fs').promises;
    libre.convertAsync = require('util').promisify(libre.convert);

    async function main() {
        const ext = '.pdf'
        const inputPath = './uploads/' + filepath;
        const outputPath = inputPath.replace(".docx", ext);

        // Read file
        const docxBuf = await fs.readFile(inputPath);

        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        // Here in done you have pdf file which you can save or transfer in another stream
        const scaleToFitPage = (imageWidth, imageHeight, pageWidth, pageHeight) => {
            const scaleX = pageWidth / imageWidth;
            const scaleY = pageHeight / imageHeight;
            return Math.min(scaleX, scaleY);
        };
        if (images && images.length) {
            const pdfDoc = await PDFDocument.load(pdfBuf);
            for (let image of images) {
                const extension = path.extname(image.url).toLowerCase();
                if (extension === '.jpg' || extension === '.png' || extension === '.pdf') {
                    const ImageBytes = await fs.readFile('./uploads/' + image.url);
                    let file
                    if (extension === '.jpg') {
                        const dimensions = sizeOf(ImageBytes);
                        file = await pdfDoc.embedJpg(ImageBytes)
                        const page = pdfDoc.addPage()
                        const scaleFactor = scaleToFitPage(dimensions.width, dimensions.height, page.getWidth(), page.getHeight());
                        let scaledWidth = dimensions.width * scaleFactor;
                        let scaledHeight = dimensions.height * scaleFactor;
                        /* page.drawText(image.tableName+" : "+image.i, {
                            x: 50,
                            y: 2,
                            size: 20,
                            color: rgb(0, 0.53, 0.71),
                        }) */
                        // Draw the JPG image in the center of the page
                        page.drawImage(file, {
                            x: page.getWidth() / 2 - scaledWidth / 2,
                            y: page.getHeight() / 2 - scaledHeight / 2,
                            width: scaledWidth,
                            height: scaledHeight,
                        })
                    } else if (extension === '.png') {
                        const dimensions = sizeOf(ImageBytes);
                        file = await pdfDoc.embedPng(ImageBytes)
                        const page = pdfDoc.addPage()
                        const scaleFactor = scaleToFitPage(dimensions.width, dimensions.height, page.getWidth(), page.getHeight());
                        let scaledWidth = dimensions.width * scaleFactor;
                        let scaledHeight = dimensions.height * scaleFactor;
                        /* page.drawText(image.tableName+" : "+image.i, {
                            x: 50,
                            y: 2,
                            size: 20,
                            color: rgb(0, 0.53, 0.71),
                        }) */
                        // Draw the JPG image in the center of the page
                        page.drawImage(file, {
                            x: page.getWidth() / 2 - scaledWidth / 2,
                            y: page.getHeight() / 2 - scaledHeight / 2,
                            width: scaledWidth,
                            height: scaledHeight,
                        })
                    } else if (extension === '.pdf') {
                        const sourcePdf = await PDFDocument.load(ImageBytes); // Load the source PDF
                        for (const sourcePage of sourcePdf.getPages()) {
                            const pageEmbed = await pdfDoc.embedPage(sourcePage); // Embed each page of the PDF
                            const pageDims = pageEmbed.scale(1);
                            const newPage = pdfDoc.addPage();
                            /* newPage.drawText(image.tableName+" : "+image.i, {
                                x: 50,
                                y: 2,
                                size: 20,
                                color: rgb(0, 0.53, 0.71),
                            }) */
                            // Draw the embedded page in the center of the new page
                            newPage.drawPage(pageEmbed, {
                                x: newPage.getWidth() / 2 - pageDims.width / 2,
                                y: newPage.getHeight() / 2 - pageDims.height / 2,
                                width: pageDims.width,
                                height: pageDims.height,
                            });
                        }
                    }
                }
            }
            pdfBuf = await pdfDoc.save()
        }
        await fs.writeFile(outputPath, pdfBuf);
        if (generateDocument.salesEmail && !generateDocument.isDraft) {
            var buffer = await Buffer.from(pdfBuf, "base64");
            attachments = [{
                filename: template.name + ".pdf",
                //content: await fs.createReadStream(req.files[0].path),
                content: buffer,
            }];
            let generatedBy = await User.findById(generateDocument.generatedById)
            let category = await Category.findById(generateDocument.categoryId)
            emailController.bankDocument(null, generateDocument.salesEmail, {
                amount: generateDocument.description["LOAN_AMOUNT"],
                name: generateDocument.customerName,
                template: category.name,
                sendedBy: generatedBy.name
            }, attachments)
            // utils.mail_notification(generateDocument.salesEmail, "Generated Document", "", "",true,attachments)
        }
    }

    main().catch(function (err) {
        console.log(`Error converting file: ${err}`);
    });
}
exports.generateExcel = function (cells, data, filename, req, res, columnMapping = null) {
    let columns = [{
        cells: Object.keys(cells).map((x) => {
            if (columnMapping && columnMapping[x]) {
                x = columnMapping[x]
            }
            let coulumnName = x;
            return { value: coulumnName.replace("Id_name", ""), style: 'lemonBgBold' }
        })
    }]
    let dkGreyBorder = { style: 'thin', color: 'Charcoal Gray' };
    for (let record of data) {
        columns.push({
            cells: Object.keys(cells).map((x) => {

                let sp = x.split("_");
                let value = record[x]
                if (sp.length > 1 && record[sp[0]]) {
                    value = record[sp[0]][sp[1]]
                }
                if (value && cells[x] == "date") {
                    value = moment(new Date(value)).format("DD-MM-YYYY HH:mm")
                }
                return value
            })
        })
    }
    var date = new Date(Date.now())
    var time = date.getTime()
    var doc = excellent.create({
        sheets: {
            'User': {
                //image: {image: fs.readFileSync('./data/web_images/authorised_image.png'), filename: 'authorised_image.png'},
                rows: columns
            }
        },
        styles: {
            borders: [{ label: 'dkGrey', left: dkGreyBorder, right: dkGreyBorder, top: dkGreyBorder, bottom: dkGreyBorder }],
            fonts: [{ label: 'bold', bold: true }, { label: 'brick', color: 'Brick Red' }],
            fills: [{ label: 'lemon', type: 'pattern', color: 'Cerulean' }],
            cellStyles: [
                { label: 'bold', font: 'bold' },
                { label: 'brick', font: 'brick', border: 'dkGrey' },
                { label: 'lemonBg', fill: 'lemon' },
                { label: 'lemonBgBold', font: 'bold', fill: 'lemon' },
                { label: 'dotty', width: '10px' }
            ]
        }
    });

    fs.writeFileSync('./uploads/xlsheet/' + time + '_' + filename, doc.file);
    var url = 'https://' + req.get('host') + "/xlsheet/" + time + "_" + filename;
    res.json({ success: true, url: url, url_name: time + "_" + filename });
    setTimeout(function () {
        fs.unlink('uploads/xlsheet/' + time + '_' + filename, function (err, file) {
        });
    }, 30000)
}
exports.readExcelFile = function (filePath, columnMapping, defaultValues, project) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const mappedData = data.map(row => {
        const mappedRow = {};
        row.forEach((value, index) => {
            const header = data[0][index];
            const propertyName = columnMapping[header];
            if (propertyName) {
                mappedRow[propertyName] = value || defaultValues[propertyName];
            }
        });
        if (project) {
            mappedRow.builderFirmId = project.builderFirmId;
            mappedRow.advocateFirmId = project.advocateFirmId;
            mappedRow.projectId = project._id;
            mappedRow.name = project.name;
        }
        return mappedRow;
    });

    mappedData.shift();

    return mappedData;
}
exports.generatePDF = function (cells, data, filename, req, res) {
    let widths = Object.keys(cells).map((x) => "*");
    let array = Object.keys(cells).map((x) => {
        let coulumnName = x;
        return { text: coulumnName.replace("Id_name", "").toLocaleUpperCase(), style: 'tableHeader' }
    })
    array = [array];
    for (let record of data) {
        array.push(Object.keys(cells).map((x) => {
            let sp = x.split("_");
            let value = record[x]
            if (sp.length > 1 && record[sp[0]]) {
                value = record[sp[0]][sp[1]]
            }
            if (value && cells[x] == "date") {
                value = moment(new Date(value)).format("DD-MM-YYYY HH:mm")
            }
            return { text: value, style: 'tableContent' }
        }))
    }
    let content = [{
        style: "tableExample1",
        margin: [0, 0, 0, 0],
        table: {
            widths: widths,
            body: array
        },

    }]
    var docDefinition = {
        pageOrientation: 'A4',
        header: {
            columns: []
        },
        headerMargins: [10, 10, 10, 10],
        content: content,
        styles: {
            tableHeader: {
                bold: true,
                fontSize: 8,
                color: 'black'
            },
            tableContent: {
                fontSize: 8,
                color: 'black'
            }
        },
        pageOrientation: "landscape",
        defaultStyle: {
            fontSize: 10
        },
    };
    var pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64(async function (buffer) {
        return res.json({ success: true, base64: buffer, filename: filename });
    })
}

exports.sendWhatsapp = async (phoneCode, phone, message, pdf = null, filename = null, template = null) => {
    //with zipper
    try {
        let response;
        if (phone) {
            let number = phoneCode + phone
            if (settings.whatsApp.provider == "zipper.io") {
                number = number.replace("+", "")
                let url = `https://ziper.io/api/send.php?number=${number}&message=${message}&instance_id=${settings.whatsApp.instanceId}&access_token=${settings.whatsApp.accessToken}`
                if (pdf) {
                    url = url + `&media_url=${pdf}`;
                    url = url + `&type=media`;
                } else {
                    url = url + `&type=text`;
                }
                if (filename) {
                    url = url + `&filename=${filename}`;
                }
                response = await axios({
                    url,
                    method: "get",
                });
            } else if (settings.whatsApp.provider == "iconicsolution" && template) {
                number = number.replace("+", "")
                let url = `https://wa.iconicsolution.co.in/wapp/api/send/bytemplate/json`
                let body = {
                    "templatename": template, // template name
                    // "country": phoneCode,//your country code (click here to see list)
                    "mobile": number, //multiple mobile number
                    "dvariables": message,
                    //"senton": "DD-MM-YYYY HH:SS" // Schedule Date
                }
                let headers = {
                    'X-API-KEY': settings.whatsApp.accessToken,
                    'Content-Type': 'application/json'
                }
                if (filename) {
                    data.media = filename;
                }
                response = await axios.post(url, body, { headers })
                console.log(body)
                console.log(response.data)
            } else if (settings.whatsApp.provider == "whatsify.me") {
                let chat = {
                    "secret": settings.whatsApp.accessToken, // your API secret from (Tools -> API Keys) page
                    "account": settings.whatsApp.instanceId,
                    "recipient": number,
                    "type": "text",
                    "message": message
                }

                response = await axios.post("https://whatsify.me/api/send/whatsapp", chat)
            }
        }
        return response

    } catch (err) {
        console.log(err)
    }
}
exports.sms = function (phoneCode, phone, text) {
    console.log(phoneCode)
    console.log(phone)
    console.log(text)
}
exports.mail_notification = function (to, sub, text, html, is_attachment_added = false, attachment_array = []) {

    try {
        let smtp_configuration = null;
        if (settings.smtp.provider == 'gmail') {
            smtp_configuration = {
                service: 'gmail',
                auth: {
                    user: settings.smtp.email, // Your email id
                    pass: settings.smtp.password // Your password
                }
            }
        } else {
            var secure = false;
            if (Number(settings.smtp.port) == 465) {
                secure = true;
            }
            smtp_configuration = {
                host: settings.smtp.host,
                port: Number(settings.smtp.port),
                secure: secure,
                auth: {
                    user: settings.smtp.email,
                    pass: settings.smtp.password
                }
            }
        }
        var transporter = nodemailer.createTransport(smtp_configuration);

        var mailOptions = {
            from: settings.smtp.email,
            to: to,
            subject: sub,
            text: text,
            html: html
        }

        if (is_attachment_added == true) {
            mailOptions.attachments = attachment_array
        }
        if (settings.smtp.email && settings.smtp.password) {

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                } else {
                    console.info("send company mail ===========");
                    console.info(to, sub);
                };
            });
        }

    } catch (error) {
        console.error(sub);
        console.error(error);
    }
};
exports.InvoiceNoStringGenerate = async function (append, senderId, year, count) {
    //return append + (senderId + '').padStart(5, '0') + "Y" + year.toString().substr(-2) + "N" + (count + '').padStart(4, '0');
    return append + (senderId + '').padStart(5, '0') + year.toString().substr(-2) + (count + '').padStart(4, '0');
}
exports.generateBankInvoice = async function (titleRequest) {
    let startTime = new Date(titleRequest.completedAt);
    let endTime = new Date(titleRequest.completedAt);
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let year = startTime.getFullYear();
    if (titleRequest.paidByBank) {
        let invoice = await MasterInvoice.findOne({
            "sender._id": null,
            "receiver._id": titleRequest.bankId,
            startTime: startTime,
            endTime: endTime,
            invoiceType: 1,
        })
        if (!invoice) {
            let bankDetail = await Bank.findOne({ _id: titleRequest.bankId });
            let autoIncrement = await AutoIncrement.findOneAndUpdate({
                table: "admininvoice"
            }, { $inc: { "lastId": 1 } }, { new: true })
            if (!autoIncrement) {
                autoIncrement = await AutoIncrement.create({
                    table: "admininvoice",
                    lastId: 1
                })
            }
            invoice = await MasterInvoice.create({
                invoiceDate: endTime,
                startTime: startTime,
                endTime: endTime,
                connectedId: titleRequest._id,
                invoiceType: 1,
                refSenderModel: "User",
                refReceiverModel: "Bank",
                invoiceUniqueNo: autoIncrement.lastId,
                invoiceNo: await exports.InvoiceNoStringGenerate("LOD", 0, year, autoIncrement.lastId),
                sender: {
                    _id: null,
                    name: settings.invoiceDetail.name,
                    address: settings.invoiceDetail.address,
                    email: settings.invoiceDetail.email,
                    gstNo: settings.invoiceDetail.gstNo,
                    invoiceNote: settings.invoiceDetail.invoiceNote,
                    accountNo: settings.invoiceDetail.accountNo,
                    ifsc: settings.invoiceDetail.ifsc
                },
                receiver: {
                    _id: bankDetail._id,
                    name: bankDetail.invoiceDetail.name,
                    address: bankDetail.invoiceDetail.address,
                    email: bankDetail.invoiceDetail.email,
                    gstNo: bankDetail.invoiceDetail.gstNo,
                    invoiceNote: bankDetail.invoiceDetail.invoiceNote,
                },
                summeryDetails: [{
                    description: "Tilte Request Payment",
                    amount: 0,
                }],
                total: {
                    totalWithoutVat: 0,  //total excl vat 
                    vat1: 0,  // vat 21%
                    vat2: 0,  // vat 21%
                    totalWithVat: 0,  //total incl vat. 
                },
                invoiceDetails: [],
                summeryDetails: [],
            })
        }
        let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(titleRequest._id));

        let totalWithoutVat = titleRequest.applicantFees;
        let vat1 = titleRequest.applicantFees * settings.bankCGST * 0.01;
        let vat2 = titleRequest.applicantFees * settings.bankSGST * 0.01;
        let totalWithVat = titleRequest.applicantFees + vat1 + vat2;
        vat1 = Number(vat1.toFixed(2))
        totalWithoutVat = Number(totalWithoutVat.toFixed(2))
        vat2 = Number(vat2.toFixed(2))
        totalWithVat = Number(totalWithVat.toFixed(2))
        if (index != -1) {
            invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].applicantFees;
            console.log(invoice.total.totalWithoutVat)
        }
        invoice.total.totalWithoutVat += totalWithoutVat;
        invoice.total.vat1 = invoice.total.totalWithoutVat * settings.bankCGST * 0.01;
        invoice.total.vat2 = invoice.total.totalWithoutVat * settings.bankSGST * 0.01;
        invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

        invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
        invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
        invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
        invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))

        if (index != -1) {
            invoice.invoiceDetails[index] = {
                _id: titleRequest._id,
                name: titleRequest.name,
                applicationNo: titleRequest.applicationNo,
                apfNo: titleRequest.apfNo,
                propertyAddress: titleRequest.propertyAddress,
                ownerName: titleRequest.ownerName,
                customer: titleRequest.customer,
                applicantFees: titleRequest.applicantFees,
                vat1: vat1,
                vat2: vat2,
                totalWithVat: totalWithVat,
            };
        } else {
            invoice.invoiceDetails.push({
                _id: titleRequest._id,
                name: titleRequest.name,
                applicationNo: titleRequest.applicationNo,
                apfNo: titleRequest.apfNo,
                propertyAddress: titleRequest.propertyAddress,
                ownerName: titleRequest.ownerName,
                customer: titleRequest.customer,
                applicantFees: titleRequest.applicantFees,
                vat1: vat1,
                vat2: vat2,
                totalWithVat: totalWithVat,
            });
        }
        invoice.markModified("invoiceDetails");
        invoice.markModified("summeryDetails");
        await invoice.save()
    }
}

exports.generateBuilderInvoice = async function (project, projectUnit = null, template = null) {
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let fees = project.fixPrice;
    let templateId = null;
    let description = "Fix Cost";
    if (template) {
        templateId = template._id;
        fees = template.fees;
        description = template.name;
    }
    let year = startTime.getFullYear();
    let invoice = await MasterInvoice.findOne({
        "sender._id": null,
        "receiver._id": project.builderFirmId,
        startTime: startTime,
        endTime: endTime,
        invoiceType: 2,
    })
    if (!invoice) {
        let builkderFirmDetail = await BuilderFirm.findOne({ _id: project.builderFirmId });
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "admininvoice"
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "admininvoice",
                lastId: 1
            })
        }
        invoice = await MasterInvoice.create({
            invoiceDate: endTime,
            startTime: startTime,
            endTime: endTime,
            connectedId: project._id,
            invoiceType: 2,
            refSenderModel: "User",
            refReceiverModel: "BuilderFirm",
            invoiceUniqueNo: autoIncrement.lastId,
            invoiceNo: await exports.InvoiceNoStringGenerate("LOD", 0, year, autoIncrement.lastId),
            sender: {
                _id: null,
                name: settings.invoiceDetail.name,
                address: settings.invoiceDetail.address,
                email: settings.invoiceDetail.email,
                gstNo: settings.invoiceDetail.gstNo,
                invoiceNote: settings.invoiceDetail.invoiceNote,
                accountNo: settings.invoiceDetail.accountNo,
                ifsc: settings.invoiceDetail.ifsc
            },
            receiver: {
                _id: builkderFirmDetail._id,
                name: builkderFirmDetail.invoiceDetail.name,
                address: builkderFirmDetail.invoiceDetail.address,
                email: builkderFirmDetail.invoiceDetail.email,
                gstNo: builkderFirmDetail.invoiceDetail.gstNo,
                invoiceNote: builkderFirmDetail.invoiceDetail.invoiceNote,
            },
            summeryDetails: [{
                description: project.name + " Payment",
                amount: 0,
            }],
            total: {
                totalWithoutVat: 0,  //total excl vat 
                vat1: 0,  // vat 21%
                vat2: 0,  // vat 21%
                totalWithVat: 0,  //total incl vat. 
            },
            invoiceDetails: [],
            summeryDetails: [],
        })
    }
    let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(templateId));

    let totalWithoutVat = fees;
    let vat1 = fees * settings.builderCGST * 0.01;
    let vat2 = fees * settings.builderSGST * 0.01;
    let totalWithVat = fees + vat1 + vat2;
    vat1 = Number(vat1.toFixed(2))
    totalWithoutVat = Number(totalWithoutVat.toFixed(2))
    vat2 = Number(vat2.toFixed(2))
    totalWithVat = Number(totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].applicantFees;
    }
    invoice.total.totalWithoutVat += totalWithoutVat;
    invoice.total.vat1 = invoice.total.totalWithoutVat * settings.builderCGST * 0.01;
    invoice.total.vat2 = invoice.total.totalWithoutVat * settings.builderSGST * 0.01;
    invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

    invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
    invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
    invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
    invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))

    if (index != -1) {
        invoice.invoiceDetails[index] = {
            _id: projectUnit ? projectUnit._id : project._id,
            templateId: templateId,
            description: description,
            block: projectUnit ? projectUnit.block + "-" + projectUnit.unit : project.name,
            applicantFees: fees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        };
    } else {
        invoice.invoiceDetails.push({
            _id: projectUnit ? projectUnit._id : project._id,
            templateId: templateId,
            description: description,
            block: projectUnit ? projectUnit.block + "-" + projectUnit.unit : project.name,
            applicantFees: fees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        });
    }
    invoice.markModified("invoiceDetails");
    invoice.markModified("summeryDetails");
    await invoice.save()
}
exports.generateInvoice = async function (titleRequest) {
    let startTime = new Date(titleRequest.completedAt);
    let endTime = new Date(titleRequest.completedAt);
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let year = startTime.getFullYear();

    let invoice = await MasterInvoice.findOne({
        "sender._id": titleRequest.advocateFirmId,
        "receiver._id": null,
        startTime: startTime,
        endTime: endTime,
        invoiceType: 0,
    })
    if (!invoice) {
        let firmDetail = await Firm.findOne({ _id: titleRequest.advocateFirmId });
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "advocateinvoice-" + firmDetail.uniqueId
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "advocateinvoice-" + firmDetail.uniqueId,
                lastId: 1
            })
        }
        invoice = await MasterInvoice.create({
            invoiceDate: endTime,
            startTime: startTime,
            endTime: endTime,
            connectedId: titleRequest._id,
            invoiceType: 0,
            refSenderModel: "AdvocateFirm",
            refReceiverModel: "User",
            invoiceUniqueNo: autoIncrement.lastId,
            invoiceNo: await exports.InvoiceNoStringGenerate("LOD", firmDetail.uniqueId, year, autoIncrement.lastId),
            sender: {
                _id: firmDetail._id,
                name: firmDetail.invoiceDetail.name,
                address: firmDetail.invoiceDetail.address,
                email: firmDetail.invoiceDetail.email,
                gstNo: firmDetail.invoiceDetail.gstNo,
                invoiceNote: firmDetail.invoiceDetail.invoiceNote,
                accountNo: firmDetail.invoiceDetail.accountNo,
                ifsc: firmDetail.invoiceDetail.ifsc
            },
            receiver: {
                _id: null,
                name: settings.invoiceDetail.name,
                address: settings.invoiceDetail.address,
                email: settings.invoiceDetail.email,
                gstNo: settings.invoiceDetail.gstNo,
                invoiceNote: settings.invoiceDetail.invoiceNote
            },
            summeryDetails: [{
                description: "Tilte Request Payment",
                amount: 0,
            }],
            total: {
                totalWithoutVat: 0,  //total excl vat 
                vat1: 0,  // vat 21%
                vat2: 0,  // vat 21%
                totalWithVat: 0,  //total incl vat. 
            },
            invoiceDetails: [],
            summeryDetails: [],
        })
    }
    let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(titleRequest._id));

    let totalWithoutVat = titleRequest.lawyerFees;
    let vat1 = titleRequest.lawyerFees * settings.advocateCGST * 0.01;
    let vat2 = titleRequest.lawyerFees * settings.advocateSGST * 0.01;
    let totalWithVat = titleRequest.lawyerFees + vat1 + vat2;
    vat1 = Number(vat1.toFixed(2))
    totalWithoutVat = Number(totalWithoutVat.toFixed(2))
    vat2 = Number(vat2.toFixed(2))
    totalWithVat = Number(totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].lawyerFees;
    }
    invoice.total.totalWithoutVat += totalWithoutVat;
    invoice.total.vat1 = invoice.total.totalWithoutVat * settings.advocateCGST * 0.01;
    invoice.total.vat2 = invoice.total.totalWithoutVat * settings.advocateSGST * 0.01;
    invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

    invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
    invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
    invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
    invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.invoiceDetails[index] = {
            _id: titleRequest._id,
            name: titleRequest.name,
            applicationNo: titleRequest.applicationNo,
            apfNo: titleRequest.apfNo,
            propertyAddress: titleRequest.propertyAddress,
            ownerName: titleRequest.ownerName,
            customer: titleRequest.customer,
            applicantFees: titleRequest.lawyerFees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        };
    } else {
        invoice.invoiceDetails.push({
            _id: titleRequest._id,
            name: titleRequest.name,
            applicationNo: titleRequest.applicationNo,
            apfNo: titleRequest.apfNo,
            propertyAddress: titleRequest.propertyAddress,
            ownerName: titleRequest.ownerName,
            customer: titleRequest.customer,
            applicantFees: titleRequest.lawyerFees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        });

    }
    invoice.markModified("invoiceDetails");
    invoice.markModified("summeryDetails");
    await invoice.save()
}
exports.generateDrafterInvoice = async function (generatedDocument) {
    let startTime = new Date(generatedDocument.createdAt);
    let endTime = new Date(generatedDocument.createdAt);
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let year = startTime.getFullYear();

    let invoice = await MasterInvoice.findOne({
        "sender._id": generatedDocument.drafterFirmId,
        "receiver._id": null,
        startTime: startTime,
        endTime: endTime,
        invoiceType: 4,
    })
    if (!invoice) {
        let firmDetail = await DrafterFirm.findOne({ _id: generatedDocument.drafterFirmId });
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "drafterinvoice-" + firmDetail.uniqueId
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "drafterinvoice-" + firmDetail.uniqueId,
                lastId: 1
            })
        }
        invoice = await MasterInvoice.create({
            invoiceDate: endTime,
            startTime: startTime,
            endTime: endTime,
            connectedId: generatedDocument._id,
            invoiceType: 4,
            refSenderModel: "DrafterFirm",
            refReceiverModel: "User",
            invoiceUniqueNo: autoIncrement.lastId,
            invoiceNo: await exports.InvoiceNoStringGenerate("LOD", firmDetail.uniqueId, year, autoIncrement.lastId),
            sender: {
                _id: firmDetail._id,
                name: firmDetail.invoiceDetail.name,
                address: firmDetail.invoiceDetail.address,
                email: firmDetail.invoiceDetail.email,
                gstNo: firmDetail.invoiceDetail.gstNo,
                invoiceNote: firmDetail.invoiceDetail.invoiceNote,
                accountNo: firmDetail.invoiceDetail.accountNo,
                ifsc: firmDetail.invoiceDetail.ifsc
            },
            receiver: {
                _id: null,
                name: settings.invoiceDetail.name,
                address: settings.invoiceDetail.address,
                email: settings.invoiceDetail.email,
                gstNo: settings.invoiceDetail.gstNo,
                invoiceNote: settings.invoiceDetail.invoiceNote
            },
            summeryDetails: [{
                description: "Mortgage Commision",
                amount: 0,
            }],
            total: {
                totalWithoutVat: 0,  //total excl vat 
                vat1: 0,  // vat 21%
                vat2: 0,  // vat 21%
                totalWithVat: 0,  //total incl vat. 
            },
            invoiceDetails: [],
            summeryDetails: [],
        })
    }
    let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(generatedDocument._id));

    let totalWithoutVat = generatedDocument.drafterFees;
    let vat1 = generatedDocument.drafterFees * settings.drafterCGST * 0.01;
    let vat2 = generatedDocument.drafterFees * settings.drafterSGST * 0.01;
    let totalWithVat = generatedDocument.drafterFees + vat1 + vat2;
    vat1 = Number(vat1.toFixed(2))
    totalWithoutVat = Number(totalWithoutVat.toFixed(2))
    vat2 = Number(vat2.toFixed(2))
    totalWithVat = Number(totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].drafterFees;
    }
    invoice.total.totalWithoutVat += totalWithoutVat;
    invoice.total.vat1 = invoice.total.totalWithoutVat * settings.drafterCGST * 0.01;
    invoice.total.vat2 = invoice.total.totalWithoutVat * settings.drafterSGST * 0.01;
    invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

    invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
    invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
    invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
    invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.invoiceDetails[index] = {
            _id: generatedDocument._id,
            customerName: generatedDocument.customerName,
            customerPhone: generatedDocument.customerPhone,
            salesName: generatedDocument.salesName,
            salesPhone: generatedDocument.salesPhone,
            applicantFees: generatedDocument.drafterFees,
            createdAt: generatedDocument.createdAt,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        };
    } else {
        invoice.invoiceDetails.push({
            _id: generatedDocument._id,
            customerName: generatedDocument.customerName,
            customerPhone: generatedDocument.customerPhone,
            salesName: generatedDocument.salesName,
            salesPhone: generatedDocument.salesPhone,
            applicantFees: generatedDocument.drafterFees,
            createdAt: generatedDocument.createdAt,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        });

    }
    invoice.markModified("invoiceDetails");
    invoice.markModified("summeryDetails");
    await invoice.save()
}
exports.generateDrafterTitleInvoice = async function (titleRequest) {
    let startTime = new Date(titleRequest.completedAt);
    let endTime = new Date(titleRequest.completedAt);
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let year = startTime.getFullYear();
    if (!titleRequest.isLink && !titleRequest.paidByBank) {
        let invoice = await MasterInvoice.findOne({
            "sender._id": null,
            "receiver._id": titleRequest.bankId,
            startTime: startTime,
            endTime: endTime,
            invoiceType: 5,
        })
        let drafterFirmDetail = await DrafterFirm.findOne({ _id: titleRequest.drafterFirmId });
        if (!invoice && drafterFirmDetail) {
            let autoIncrement = await AutoIncrement.findOneAndUpdate({
                table: "admininvoice"
            }, { $inc: { "lastId": 1 } }, { new: true })
            if (!autoIncrement) {
                autoIncrement = await AutoIncrement.create({
                    table: "admininvoice",
                    lastId: 1
                })
            }
            invoice = await MasterInvoice.create({
                invoiceDate: endTime,
                startTime: startTime,
                endTime: endTime,
                connectedId: titleRequest._id,
                invoiceType: 5,
                refSenderModel: "User",
                refReceiverModel: "DrafterFirm",
                invoiceUniqueNo: autoIncrement.lastId,
                invoiceNo: await exports.InvoiceNoStringGenerate("LOD", 0, year, autoIncrement.lastId),
                sender: {
                    _id: null,
                    name: settings.invoiceDetail.name,
                    address: settings.invoiceDetail.address,
                    email: settings.invoiceDetail.email,
                    gstNo: settings.invoiceDetail.gstNo,
                    invoiceNote: settings.invoiceDetail.invoiceNote,
                    accountNo: settings.invoiceDetail.accountNo,
                    ifsc: settings.invoiceDetail.ifsc
                },
                receiver: {
                    _id: drafterFirmDetail._id,
                    name: drafterFirmDetail.invoiceDetailTitle.nameTitle,
                    address: drafterFirmDetail.invoiceDetailTitle.addressTitle,
                    email: drafterFirmDetail.invoiceDetailTitle.emailTitle,
                    gstNo: drafterFirmDetail.invoiceDetailTitle.gstNoTitle,
                    invoiceNote: drafterFirmDetail.invoiceDetailTitle.invoiceNoteTitle,
                },
                summeryDetails: [{
                    description: "Tilte Request Payment Drafter",
                    amount: 0,
                }],
                total: {
                    totalWithoutVat: 0,  //total excl vat 
                    vat1: 0,  // vat 21%
                    vat2: 0,  // vat 21%
                    totalWithVat: 0,  //total incl vat. 
                },
                invoiceDetails: [],
                summeryDetails: [],
            })
        }
        let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(titleRequest._id));

        let totalWithoutVat = titleRequest.applicantFees;
        let vat1 = titleRequest.applicantFees * settings.drafterTitleCGST * 0.01;
        let vat2 = titleRequest.applicantFees * settings.drafterTitleSGST * 0.01;
        let totalWithVat = titleRequest.applicantFees + vat1 + vat2;
        vat1 = Number(vat1.toFixed(2))
        totalWithoutVat = Number(totalWithoutVat.toFixed(2))
        vat2 = Number(vat2.toFixed(2))
        totalWithVat = Number(totalWithVat.toFixed(2))
        if (index != -1) {
            invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].applicantFees;
        }
        invoice.total.totalWithoutVat += totalWithoutVat;
        invoice.total.vat1 = invoice.total.totalWithoutVat * settings.drafterTitleCGST * 0.01;
        invoice.total.vat2 = invoice.total.totalWithoutVat * settings.drafterTitleSGST * 0.01;
        invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

        invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
        invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
        invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
        invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))

        if (index != -1) {
            invoice.invoiceDetails[index] = {
                _id: titleRequest._id,
                name: titleRequest.name,
                applicationNo: titleRequest.applicationNo,
                apfNo: titleRequest.apfNo,
                propertyAddress: titleRequest.propertyAddress,
                ownerName: titleRequest.ownerName,
                customer: titleRequest.customer,
                applicantFees: titleRequest.applicantFees,
                vat1: vat1,
                vat2: vat2,
                totalWithVat: totalWithVat,
            };
        } else {
            invoice.invoiceDetails.push({
                _id: titleRequest._id,
                name: titleRequest.name,
                applicationNo: titleRequest.applicationNo,
                apfNo: titleRequest.apfNo,
                propertyAddress: titleRequest.propertyAddress,
                ownerName: titleRequest.ownerName,
                customer: titleRequest.customer,
                applicantFees: titleRequest.applicantFees,
                vat1: vat1,
                vat2: vat2,
                totalWithVat: totalWithVat,
            });
        }
        invoice.markModified("invoiceDetails");
        invoice.markModified("summeryDetails");
        await invoice.save()
    }
}
exports.generateStaffInvoice = async function (titleRequest) {
    let startTime = new Date(titleRequest.completedAt);
    let endTime = new Date(titleRequest.completedAt);
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
    let year = startTime.getFullYear();

    let invoice = await MasterInvoice.findOne({
        "sender._id": titleRequest.staffId,
        "receiver._id": titleRequest.advocateFirmId,
        startTime: startTime,
        endTime: endTime,
        invoiceType: 3,
    })
    if (!invoice) {
        let user = await User.findOne({ _id: titleRequest.staffId });
        let firmDetail = await Firm.findOne({ _id: titleRequest.advocateFirmId });
        let autoIncrement = await AutoIncrement.findOneAndUpdate({
            table: "staffinvoice-" + firmDetail.uniqueId
        }, { $inc: { "lastId": 1 } }, { new: true })
        if (!autoIncrement) {
            autoIncrement = await AutoIncrement.create({
                table: "staffinvoice-" + firmDetail.uniqueId,
                lastId: 1
            })
        }
        invoice = await MasterInvoice.create({
            invoiceDate: endTime,
            startTime: startTime,
            endTime: endTime,
            connectedId: titleRequest._id,
            invoiceType: 3,
            refSenderModel: "User",
            refReceiverModel: "AdvocateFirm",
            invoiceUniqueNo: autoIncrement.lastId,
            invoiceNo: await exports.InvoiceNoStringGenerate("LOD", user.uniqueId, year, autoIncrement.lastId),
            sender: {
                _id: user._id,
                name: user.invoiceDetail.name,
                address: user.invoiceDetail.address,
                email: user.invoiceDetail.email,
                gstNo: user.invoiceDetail.gstNo,
                invoiceNote: user.invoiceDetail.invoiceNote,
                accountNo: user.invoiceDetail.accountNo,
                ifsc: user.invoiceDetail.ifsc
            },
            receiver: {
                _id: firmDetail._id,
                name: firmDetail.invoiceDetail.name,
                address: firmDetail.invoiceDetail.address,
                email: firmDetail.invoiceDetail.email,
                gstNo: firmDetail.invoiceDetail.gstNo,
                invoiceNote: firmDetail.invoiceDetail.invoiceNote,
                accountNo: firmDetail.invoiceDetail.accountNo,
                ifsc: firmDetail.invoiceDetail.ifsc
            },
            summeryDetails: [{
                description: "Tilte Request Staff Payment",
                amount: 0,
            }],
            total: {
                totalWithoutVat: 0,  //total excl vat 
                vat1: 0,  // vat 21%
                vat2: 0,  // vat 21%
                totalWithVat: 0,  //total incl vat. 
            },
            invoiceDetails: [],
            summeryDetails: [],
        })
    }
    let index = invoice.invoiceDetails.findIndex((x) => String(x._id) == String(titleRequest._id));

    let totalWithoutVat = titleRequest.staffFees;
    let vat1 = titleRequest.staffFees * settings.advocateCGST * 0.01;
    let vat2 = titleRequest.staffFees * settings.advocateSGST * 0.01;
    let totalWithVat = titleRequest.staffFees + vat1 + vat2;
    vat1 = Number(vat1.toFixed(2))
    totalWithoutVat = Number(totalWithoutVat.toFixed(2))
    vat2 = Number(vat2.toFixed(2))
    totalWithVat = Number(totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.total.totalWithoutVat -= invoice.invoiceDetails[index].staffFees;
    }
    invoice.total.totalWithoutVat += totalWithoutVat;
    invoice.total.vat1 = invoice.total.totalWithoutVat * settings.advocateCGST * 0.01;
    invoice.total.vat2 = invoice.total.totalWithoutVat * settings.advocateSGST * 0.01;
    invoice.total.totalWithVat = invoice.total.totalWithoutVat + invoice.total.vat1 + invoice.total.vat2;

    invoice.total.totalWithoutVat = Number(invoice.total.totalWithoutVat.toFixed(2))
    invoice.total.vat1 = Number(invoice.total.vat1.toFixed(2))
    invoice.total.vat2 = Number(invoice.total.vat2.toFixed(2))
    invoice.total.totalWithVat = Number(invoice.total.totalWithVat.toFixed(2))
    if (index != -1) {
        invoice.invoiceDetails[index] = {
            _id: titleRequest._id,
            name: titleRequest.name,
            applicationNo: titleRequest.applicationNo,
            apfNo: titleRequest.apfNo,
            propertyAddress: titleRequest.propertyAddress,
            ownerName: titleRequest.ownerName,
            customer: titleRequest.customer,
            applicantFees: titleRequest.staffFees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        };
    } else {
        invoice.invoiceDetails.push({
            _id: titleRequest._id,
            name: titleRequest.name,
            applicationNo: titleRequest.applicationNo,
            apfNo: titleRequest.apfNo,
            propertyAddress: titleRequest.propertyAddress,
            ownerName: titleRequest.ownerName,
            customer: titleRequest.customer,
            applicantFees: titleRequest.staffFees,
            vat1: vat1,
            vat2: vat2,
            totalWithVat: totalWithVat,
        });

    }
    invoice.markModified("invoiceDetails");
    invoice.markModified("summeryDetails");
    await invoice.save()
}
exports.getDownloadInvoice = async function (masterInvoice, res, email = null, json = null) {

    var timezone = "Asia/Calcutta";
    let senderCompany = "";
    let footerDetail = "";
    if (masterInvoice.sender.name) {
        senderCompany += masterInvoice.sender.name + "\n";
        footerDetail += masterInvoice.sender.name;
    }

    footerDetail += " | " + masterInvoice.sender.address;
    if (masterInvoice.sender.phone) {
        footerDetail += " | " + masterInvoice.sender.country_phone_code + masterInvoice.sender.phone;
    }
    if (masterInvoice.sender.email) {
        footerDetail += " | " + masterInvoice.sender.email;
    }
    if (masterInvoice.sender.address) {
        senderCompany += masterInvoice.sender.address + "\n";
    }
    if (masterInvoice.sender.accountNo) {
        senderCompany += "Account No: " + masterInvoice.sender.accountNo.toUpperCase() + "\n";
        footerDetail += " | Account No: " + masterInvoice.sender.accountNo.toUpperCase();
    }
    if (masterInvoice.sender.ifsc) {
        senderCompany += "IFSC: " + masterInvoice.sender.ifsc.toUpperCase() + "\n";
        footerDetail += " | IFSC: " + masterInvoice.sender.ifsc.toUpperCase();
    }
    if (masterInvoice.sender.gstNo) {
        senderCompany += "GST NO: " + masterInvoice.sender.gstNo.toUpperCase() + "\n";
        footerDetail += " | GST NO: " + masterInvoice.sender.gstNo.toUpperCase();
    }
    let receiverCompany = "";
    if (masterInvoice.receiver.name) {
        receiverCompany += masterInvoice.receiver.name + "\n";
    }
    if (masterInvoice.receiver.address) {
        receiverCompany += masterInvoice.receiver.address + "\n";
    }
    if (masterInvoice.receiver.accountNo) {
        receiverCompany += "Account No " + masterInvoice.receiver.accountNo.toUpperCase() + "\n";
    }
    if (masterInvoice.receiver.ifsc) {
        receiverCompany += "IFSC: " + masterInvoice.receiver.ifsc.toUpperCase() + "\n";
    }
    if (masterInvoice.receiver.gstNo) {
        receiverCompany += "GST NO: " + masterInvoice.receiver.gstNo.toUpperCase() + "\n";
    }
    let headerTable = {
        style: "tableExample",
        table: {
            widths: [300],
            body: [
                []
            ]
        },
        layout: "noBorders"
    };
    headerTable.table.body[0].push({ text: "", alignment: 'left', decoration: 'overline', margin: [15, 0, 15, 0] })
    headerTable.table.widths.push("*")
    headerTable.table.widths.push(0)
    headerTable.table.body[0].push({ text: senderCompany, style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] })
    headerTable.table.body[0].push({ text: "", style: "tableHeader2", alignment: "right", margin: [0, 2, 5, 0] });

    let array = [];
    let widths = [];
    let invoiceDate = masterInvoice.invoiceDate;
    if (!invoiceDate) {
        invoiceDate = masterInvoice.endTime;
    }
    let invoiceNumberAndDate = [
        [{ text: "\n\n\n", color: "black" }, { text: "", color: "black" }],
        [
            { text: "Invoice Number :", style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] },
            { text: masterInvoice.invoiceNo, style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] }
        ],
        [
            { text: "Invoice Date :", style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] },
            { text: moment_timezone(invoiceDate).tz(timezone).format("DD-MM-YYYY"), style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] }
        ],
        [
            { text: "Invoice Period", style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] },
            { text: moment_timezone(masterInvoice.startTime).tz(timezone).format("DD-MM-YYYY") + ' - ' + moment_timezone(masterInvoice.endTime).tz(timezone).format("DD-MM-YYYY"), style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] }
        ],
    ]

    let payouts = [];
    if (masterInvoice.invoiceType == 1) {
        payouts = [
            [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
            [
                { text: '', color: 'black' },
                { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "CGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat1 ? masterInvoice.total.vat1 : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "SGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat2 ? masterInvoice.total.vat2 : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ]
        ]
        widths = [40, 40, "*", 40, "*", "*", "*", "*", "*", "*"],
            array.push([
                { text: "CHANNEL", alignment: "center", color: "black" },
                { text: "APP No", alignment: "center", color: "black" },
                { text: "APF No", alignment: "center", color: "black" },
                { text: "Property Address", alignment: "center", color: "black" },
                { text: "Owner Name", alignment: "center", color: "black" },
                { text: "Customer Name", alignment: "center", color: "black" },
                { text: "Fee", alignment: "center", color: "black" },
                { text: "CGST", alignment: "center", color: "black" },
                { text: "SGST", alignment: "center", color: "black" },
                { text: "PAYOUT", alignment: "center", color: "black" }
            ]);
        masterInvoice.invoiceDetails.forEach((request) => {
            array.push([
                { text: request.name, alignment: "center", color: "black" },
                { text: request.applicationNo, alignment: "center", color: "black" },
                { text: request.apfNo, alignment: "center", color: "black" },
                { text: request.propertyAddress, alignment: "center", color: "black" },
                { text: request.ownerName, alignment: "center", color: "black" },
                { text: request.customer.name, alignment: "center", color: "black" },
                { text: "₹ " + (request.applicantFees).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat1).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat2).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.totalWithVat).toFixed(2), alignment: "center", color: "black" },
            ])
        })
    } else if (masterInvoice.invoiceType == 5) {
        payouts = [
            [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
            [
                { text: '', color: 'black' },
                { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "CGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat1 ? masterInvoice.total.vat1 : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "SGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat2 ? masterInvoice.total.vat2 : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ]
        ]
        widths = [40, 40, "*", 40, "*", "*", "*", "*", "*", "*"],
            array.push([
                { text: "CHANNEL", alignment: "center", color: "black" },
                { text: "APP No", alignment: "center", color: "black" },
                { text: "APF No", alignment: "center", color: "black" },
                { text: "Property Address", alignment: "center", color: "black" },
                { text: "Owner Name", alignment: "center", color: "black" },
                { text: "Customer Name", alignment: "center", color: "black" },
                { text: "Fee", alignment: "center", color: "black" },
                { text: "CGST", alignment: "center", color: "black" },
                { text: "SGST", alignment: "center", color: "black" },
                { text: "PAYOUT", alignment: "center", color: "black" }
            ]);
        masterInvoice.invoiceDetails.forEach((request) => {
            array.push([
                { text: request.name, alignment: "center", color: "black" },
                { text: request.applicationNo, alignment: "center", color: "black" },
                { text: request.apfNo, alignment: "center", color: "black" },
                { text: request.propertyAddress, alignment: "center", color: "black" },
                { text: request.ownerName, alignment: "center", color: "black" },
                { text: request.customer.name, alignment: "center", color: "black" },
                { text: "₹ " + (request.applicantFees).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat1).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat2).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.totalWithVat).toFixed(2), alignment: "center", color: "black" },
            ])
        })
    } else if (masterInvoice.invoiceType == 2) {
        payouts = [
            [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
            [
                { text: '', color: 'black' },
                { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "CGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat1 ? masterInvoice.total.vat1 : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "SGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.vat2 ? masterInvoice.total.vat2 : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ]
        ]
        widths = ["*", "*", "*", "*", "*", "*"],
            array.push([
                { text: "NAME", alignment: "center", color: "black" },
                { text: "DESCRIPTION", alignment: "center", color: "black" },
                { text: "Fee", alignment: "center", color: "black" },
                { text: "CGST", alignment: "center", color: "black" },
                { text: "SGST", alignment: "center", color: "black" },
                { text: "PAYOUT", alignment: "center", color: "black" }
            ]);
        masterInvoice.invoiceDetails.forEach((request) => {
            array.push([
                { text: request.block, alignment: "center", color: "black" },
                { text: request.description, alignment: "center", color: "black" },
                { text: "₹ " + (request.applicantFees).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat1).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat2).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.totalWithVat).toFixed(2), alignment: "center", color: "black" },
            ])
        })
    } else if (masterInvoice.invoiceType == 4) {
        payouts = [
            [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
            [
                { text: '', color: 'black' },
                { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ]
        ];
        widths = [40, 40, "*", 40, "*", "*", "*"],
            array.push([
                { text: "CUSTOMER", alignment: "center", color: "black" },
                { text: "CUSTOMER No", alignment: "center", color: "black" },
                { text: "Date", alignment: "center", color: "black" },
                { text: "Commision", alignment: "center", color: "black" },
                { text: "CGST", alignment: "center", color: "black" },
                { text: "SGST", alignment: "center", color: "black" },
                { text: "PAYOUT", alignment: "center", color: "black" }
            ]);
        masterInvoice.invoiceDetails.forEach((request) => {
            array.push([
                { text: request.customerName, alignment: "center", color: "black" },
                { text: request.customerPhone, alignment: "center", color: "black" },
                { text: moment_timezone(request.createdAt).tz(timezone), alignment: "center", color: "black" },
                { text: "₹ " + (request.applicantFees).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat1).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.vat2).toFixed(2), alignment: "center", color: "black" },
                { text: "₹ " + (request.totalWithVat).toFixed(2), alignment: "center", color: "black" },
            ])
        })
    } else {
        payouts = [
            [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
            [
                { text: '', color: 'black' },
                { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
            ],
            [
                { text: '', color: 'black' },
                { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
            ]
        ];
        widths = [40, 40, "*", 40, "*", "*", "*", "*", "*", "*"],
            array.push([
                { text: "CHANNEL", alignment: "center", color: "black" },
                { text: "APP No", alignment: "center", color: "black" },
                { text: "APF No", alignment: "center", color: "black" },
                { text: "Property Address", alignment: "center", color: "black" },
                { text: "Owner Name", alignment: "center", color: "black" },
                { text: "Customer Name", alignment: "center", color: "black" },
                { text: "PAYOUT", alignment: "center", color: "black" }
            ]);
        masterInvoice.invoiceDetails.forEach((request) => {
            array.push([
                { text: request.name, alignment: "center", color: "black" },
                { text: request.applicationNo, alignment: "center", color: "black" },
                { text: request.apfNo, alignment: "center", color: "black" },
                { text: request.propertyAddress, alignment: "center", color: "black" },
                { text: request.ownerName, alignment: "center", color: "black" },
                { text: request.customer.name, alignment: "center", color: "black" },
                { text: "₹ " + (request.totalWithVat).toFixed(2), alignment: "center", color: "black" },
            ])
        })
    }

    let content = [
        headerTable,
        {
            style: "tableExample",
            table: {
                widths: [200, "*"],
                body: [
                    [{ text: "", color: "black" }, { text: "", color: "black" }],
                    [
                        { text: receiverCompany, style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] },
                        { text: "", style: "tableHeader2", alignment: "left", margin: [0, 2, 5, 0] }
                    ]
                ]
            },
            layout: "noBorders"
        },
        {
            style: "tableExample",
            table: {
                widths: [140, "*"],
                body: invoiceNumberAndDate
            },
            layout: "noBorders"
        },

        {
            style: 'tableExample',
            table: {
                widths: ['*', 200, 100],
                body: [
                    [{ text: '', color: 'black' }, { text: '', color: 'black' }, { text: '', color: 'black' }],
                    [
                        { text: '', color: 'black' },
                        { text: "Total", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                        { text: '₹ ' + (masterInvoice.total.totalWithoutVat ? masterInvoice.total.totalWithoutVat : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
                    ],
                    [
                        { text: '', color: 'black' },
                        { text: "CGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                        { text: '₹ ' + (masterInvoice.total.vat1 ? masterInvoice.total.vat1 : 0).toFixed(2), color: "#434A54", fontSize: 13, alignment: 'right', margin: [0, 2, 5, 0] }
                    ],
                    [
                        { text: '', color: 'black' },
                        { text: "SGST", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                        { text: '₹ ' + (masterInvoice.total.vat2 ? masterInvoice.total.vat2 : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
                    ],
                    [
                        { text: '', color: 'black' },
                        { text: "Payout", style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] },
                        { text: '₹ ' + (masterInvoice.total.totalWithVat ? masterInvoice.total.totalWithVat : 0).toFixed(2), style: 'tableHeader2', alignment: 'right', margin: [0, 2, 5, 0] }
                    ]
                ]
            },
            layout: 'noBorders'
        },
        {
            style: "",
            table: {
                widths: ["*", 0],
                body: [
                    [{ text: "", color: "black" }, { text: "", color: "black", alignment: "center" }],
                    [{ text: "Last payment date is " + masterInvoice.invoiceDueDays + " days after the invoice date", margin: [0, 60, 0, 0], italics: true, color: 'black', alignment: "center" },
                    { text: "", alignment: "center" }
                    ]
                ]
            },
            layout: "noBorders"
        },
    ]
    footerDetail = "";
    if (masterInvoice.sender.invoiceNote) {
        footerDetail = masterInvoice.sender.invoiceNote;
    }
    if (footerDetail) {
        content.push({
            style: "",
            table: {
                widths: ["*", 0],
                body: [
                    [{ text: "\n", color: "black" }, { text: "", color: "black", alignment: "center" }],
                    [{ text: footerDetail, color: 'black', alignment: "center" },
                    { text: "", style: "tableHeader2", alignment: "center" }
                    ]
                ]
            },
            layout: "noBorders"
        });
    }
    if (array.length) {
        content.push({
            text: moment_timezone(masterInvoice.startTime).tz(timezone).format("DD-MM-YYYY") + ' - ' + moment_timezone(masterInvoice.endTime).tz(timezone).format("DD-MM-YYYY"),
            style: "header",
            pageBreak: "before",
            pageOrientation: "landscape"
        })
        content.push({
            style: "tableExample1",
            margin: [0, 0, 0, 0],
            table: {
                widths: widths,
                body: array
            }
        })
    }
    let qimage = "data:image/png;base64," + fs.readFileSync('./uploads/logo/logo-sm.png', { encoding: 'base64' })
    var docDefinition = {
        pageOrientation: 'A4',
        header: {
            columns: []
        },
        footer: function (currentPage, pageCount, pageSize) {
            let add = 0;
            if (pageSize.width > 600) {
                add = 50
            }
            return {
                columns: [
                    {
                        width: (pageSize.width / 3) + add,
                        text: ''
                    },
                    {
                        width: 20,
                        image: qimage,
                        fit: [15, 15],
                        alignment: 'left',
                        decoration: 'overline'
                    },
                    { width: '*', text: "invoice generated and powered by Legal On Desk", italics: true, color: '#808080', alignment: "left", bold: true },
                ]
            }
        },
        headerMargins: [10, 10, 10, 10],
        content: content,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                color: "#434A59"
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [10, 5, 0, 5],
                fillColor: "#33414E"
            },
            tableExample: {
                margin: [0, 5, 0, 10],
                color: "white",
                fillColor: "white"
            },
            tableExample1: {
                fontSize: 7,
                margin: [0, 5, 0, 10],
                color: "white",
                fillColor: "white"
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: "#434A54",
                fillColor: "white",
                margin: [10, 3, 0, 0]
            },
            tableHeader2: {
                bold: true,
                fontSize: 13,
                color: "#434A54",
                fillColor: "white",
            },
            total: {
                bold: true,
                fontSize: 15,
                fillColor: "#688DAA",
                color: "#ffffff",
                margin: [0, 0, 10, 0]
            },
            total4: {
                bold: true,
                fontSize: 15,
                fillColor: "#688DAA",
                color: "#ffffff",
                margin: [0, 3, 10, 0]
            },
            value: {
                fontSize: 10,
                margin: [0, 3, 10, 0]
            },
        },
        defaultStyle: {
            fontSize: 10
        },
    };
    var pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64(async function (buffer) {

        if (email) {
            attachments = [{
                filename: masterInvoice.invoiceNo + ".pdf",
                //content: await fs.createReadStream(req.files[0].path),
                content: await Buffer.from(buffer, "base64"),
            }];
            masterInvoice.receiverTime = new Date();
            masterInvoice.save();
            emailController.invoiceDocument(null, "b.ghodasara1994@gmail.com", {
                body: "Invoice for Period " + moment_timezone(masterInvoice.startTime).tz("Asia/Calcutta").format("DD-MM-YYYY") + " - " + moment_timezone(masterInvoice.endTime).tz("Asia/Calcutta").format("DD-MM-YYYY"),
                name: masterInvoice.invoiceNo + " By " + masterInvoice.sender.name,
            }, attachments)
            if (res) {
                return res.json({
                    success: true,
                    success_code: process.env.SUCCESS_STRING_EMAIL_SEND_SUCCESSFULLY,
                    success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EMAIL_SEND_SUCCESSFULLY]
                });
            }
        } else {
            if (res) {
                if (json) {
                    return res.json({ success: true, base64: buffer, filename: masterInvoice.invoiceNo });
                } else {
                    res.type('application/pdf');
                    res.header('Content-Disposition', `attachment; filename="${masterInvoice.invoiceNo}.pdf"`);
                    return res.send(Buffer.from(buffer, 'base64'));
                }
            }
        }
    })
}
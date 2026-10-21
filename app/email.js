const ejs = require("ejs");
const fs = require("fs");
const utils = require('./utils');
const Email = require('./models/Email');
const sms = require('./sms');
exports.emailForgotPassword = async function (req, email, data) {
    try {
        let emailTemp = await Email.findOne({ unique: "NEW PASSWORD" })
        exports.defaultSetting(req, email, data, emailTemp)
        sms.newPassword(data.phoneCode, data.phone, {
            name:data.name,
            password: data.password,
        })
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.emailSendOtp = async function (req, email, data) {
    try {
        let emailTemp = await Email.findOne({ unique: "NEW OTP" })
        console.log("OTP",emailTemp)
        exports.defaultSetting(req, email, data, emailTemp)
        sms.newOtp(data.phoneCode, data.phone, {
            name:data.name,
            otp: data.otp,
        })
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.defaultSetting = function (req, email, data, emailTemp, isattachments = false, attachments = []) {
    let SENDED_BY = new RegExp("%SENDED_BY%", 'g');
    let AMOUNT = new RegExp("%AMOUNT%", 'g');
    let SPPORT_PHONE = new RegExp("%SPPORT_PHONE%", 'g');
    let SPPORT_EMAIL = new RegExp("%SPPORT_EMAIL%", 'g');
    let USERNAME = new RegExp("%USERNAME%", 'g');
    let NAME = new RegExp("%NAME%", 'g');
    let BUILDER_FIRM = new RegExp("%BUILDER_FIRM%", 'g');
    let BUILDER = new RegExp("%BUILDER%", 'g');
    let DESIGN_BY = new RegExp("%DESIGN_BY%", 'g');
    let FRONT_URL = new RegExp("%FRONT_URL%", 'g');
    let COMPANY = new RegExp("%COMPANY%", 'g');
    let API_URL = new RegExp("%API_URL%", 'g');
    let UNIT_NO = new RegExp("%UNIT_NO%", 'g');
    let TEMPLATE = new RegExp("%TEMPLATE%", 'g');
    let PASSWORD = new RegExp("%PASSWORD%", 'g');
    let OTP = new RegExp("%OTP%", 'g');
    let STATUS = new RegExp("%STATUS%", 'g');
    // emailTemp.title = emailTemp.title.replace(TEMPLATE, data.template);
    emailTemp.title = emailTemp.title.replace(NAME, data.name);
    emailTemp.title = emailTemp.title.replace(COMPANY, settings.company);
    emailTemp.content = emailTemp.content.replace(SPPORT_PHONE, settings.supportPhone);
    emailTemp.content = emailTemp.content.replace(SPPORT_EMAIL, settings.supportEmail);
    emailTemp.content = emailTemp.content.replace(API_URL, settings.apiUrl);
    emailTemp.content = emailTemp.content.replace(COMPANY, settings.company);
    emailTemp.content = emailTemp.content.replace(FRONT_URL, settings.frontUrl);
    emailTemp.content = emailTemp.content.replace(DESIGN_BY, settings.designBy);
    // emailTemp.content = emailTemp.content.replace(SENDED_BY, data.sendedBy);
    // emailTemp.content = emailTemp.content.replace(AMOUNT, data.amount);
    // emailTemp.content = emailTemp.content.replace(USERNAME, data.username);
    // emailTemp.content = emailTemp.content.replace(UNIT_NO, data.unitNo);
    emailTemp.content = emailTemp.content.replace(NAME, data.name);
    // emailTemp.content = emailTemp.content.replace(BUILDER, data.builder);
    // emailTemp.content = emailTemp.content.replace(BUILDER_FIRM, data.builder);
    emailTemp.content = emailTemp.content.replace(PASSWORD, data.password);
    emailTemp.content = emailTemp.content.replace(OTP, data.otp);
    emailTemp.content = emailTemp.content.replace(STATUS, data.status);
    emailTemp.content = emailTemp.content.replace(TEMPLATE, data.template);
    // emailTemp.content = emailTemp.content.replace("%BODY%", data.body);
    let template = process.cwd() + '/app/views/emails/email.html';
    let file = fs.readFileSync(template, 'utf8');
    var compiledTmpl = ejs.compile(file, { filename: template });
    var htmls = compiledTmpl({ content: emailTemp.content });
    utils.mail_notification(email, emailTemp.title, "", htmls, isattachments, attachments);
}
exports.emailBooking = async function (req, email, data, phoneCode = null, phone = null) {
    try {
        let emailTemp = await Email.findOne({ unique: "BOOKING" })
        exports.defaultSetting(req, email, data, emailTemp)
        if (phone){
            utils.sendWhatsapp(phoneCode, phone, [], null, null, "emailBooking")
        }
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.register = async function (req, email, data) {
    try {
        let emailTemp = await Email.findOne({ unique: "WELCOME" })
        exports.defaultSetting(req, email, data, emailTemp)
        sms.welcome(data.phoneCode, data.phone, {
            name: data.name,
            password: data.password,
        })
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.document = async function (req, email, data, phoneCode = null, phone = null) {
    try {
        let emailTemp = await Email.findOne({ unique: "DOCUMENT" })
        exports.defaultSetting(req, email, data, emailTemp)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.builderRequest = async function (req, email, data, phoneCode = null, phone = null) {
    try {
        let emailTemp = await Email.findOne({ unique: "BUILDER REQUEST" })
        exports.defaultSetting(req, email, data, emailTemp)
        if (phone) {
            utils.sendWhatsapp(phoneCode, phone, [], null, null, "builderRequest")
        }
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.atsDosGenerate = async function (req, email, data, phoneCode = null, phone = null) {
    try {
        let emailTemp = await Email.findOne({ unique: "ADVOCATE START GENERATE" })
        exports.defaultSetting(req, email, data, emailTemp)
        if (phone) {
            utils.sendWhatsapp(phoneCode, phone, [], null, null, "atsDosGenerate")
        }
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.bankDocument = async function (req, email, data, attachments = [], phoneCode = null, phone = null) {
    try {
        
        let emailTemp = await Email.findOne({ unique: "BANK DOCUMENT" })
        exports.defaultSetting(req, email, data, emailTemp, attachments.length ? true : false, attachments)
        if (phone) {
            utils.sendWhatsapp(phoneCode, phone, [], null, null, "bankDocument")
        }
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.invoiceDocument = async function (req, email, data, attachments = [], phoneCode = null, phone = null) {
    try {
        
        let emailTemp = await Email.findOne({ unique: "INVOICE" })
        exports.defaultSetting(req, email, data, emailTemp, attachments.length ? true : false, attachments)
        if (phone) {
            utils.sendWhatsapp(phoneCode, phone, [], null, null, "invoiceDocument")
        }
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.templates = function (req, email, title, body, attachments=[]) {
    try {
        exports.defaultSetting(req, email, {}, { content: body, title: title }, attachments.length ? true : false, attachments)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }

};

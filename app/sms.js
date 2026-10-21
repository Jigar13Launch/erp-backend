const utils = require('./utils');
const moment = require('moment');
const RegistrarOffice = require('./models/RegistrarOffice')
const BuilderFirm = require('./models/BuilderFirm')
const Project = require('./models/Project')
exports.welcome = function (phoneCode, phone, data) {
    try {
        let message = "Welcome %NAME% to %COMPANY%. Please login with your mobile - %PHONE% and Password - %PASSWORD% at %FRONT_URL%";
        message = message.replace("%NAME%",data.name);
        message = message.replace("%PHONE%", phoneCode + phone);
        message = message.replace("%PASSWORD%",data.password);
        message = message.replace("%COMPANY%", settings.company);
        message = message.replace("%FRONT_URL%", settings.frontUrl);
        utils.sms(phoneCode, phone, message)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.newOtp = function (phoneCode, phone, data) {
    try {
        let message = "Dear %NAME%, Your OTP of %COMPANY% is %OTP%";
        message = message.replace("%OTP%",data.otp);
        message = message.replace("%NAME%", data.name);
        message = message.replace("%COMPANY%", settings.company);
        utils.sms(phoneCode, phone, message)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.newPassword = function (phoneCode, phone, data) {
    try {
        let message = "Dear %NAME%, Your new password of %COMPANY% is %PASSWORD% at %FRONT_URL%";
        message = message.replace("%NAME%", data.name);
        message = message.replace("%PASSWORD%", data.password);
        message = message.replace("%COMPANY%", settings.company);
        message = message.replace("%FRONT_URL%", settings.frontUrl);
        utils.sms(phoneCode, phone, message)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.linkSend = function (phoneCode, phone, data, name) {
    try {
        let paymentLink = settings.frontUrl + data.links.legalFee;
        let portalLink = settings.frontUrl;
        let documentLink = data.attachment.replace(".docx", ".pdf");
        utils.sendWhatsapp(phoneCode, phone, [name, paymentLink, settings.apiUrl + documentLink, portalLink], null, null, settings.bankEmailTemplate.paymentLink)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.titleLinkSend = function (phoneCode, phone, data, name) {
    try {
        let paymentLink = settings.frontUrl + "/auth/payment?titleId=" + data._id;
        utils.sendWhatsapp(phoneCode, phone, [name,paymentLink], null, null, settings.titleEmailTemplate.paymentLink)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.documentSend = function (phoneCode, phone, data) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [], null, null, "documentsSend")
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.documentGenerate = function (phoneCode, phone, data,name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.bankEmailTemplate.morgageCreate)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.queryRequesterToAdvocate = function (phoneCode, phone, data,name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.queryRequesterToAdvocate)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.queryAdvocateToRequester = function (phoneCode, phone, data, name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.queryAdvocateToRequester)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
}
exports.queryResolveAdvocateToRequester = function (phoneCode, phone, data, name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.queryResolveAdvo4cateToRequester)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.queryResolveRequesterToAdvocate = function (phoneCode, phone, data, name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.queryResolveRequesterToAdvocate)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.titleComplete = function (phoneCode, phone, data, name) {
    try {
       
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.complete)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.titlePaymentDone = function (phoneCode, phone, data, name) {
    try {
        utils.sendWhatsapp(phoneCode, phone, [name], null, null, settings.titleEmailTemplate.paymentComplete)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.paymentDone = async function (phoneCode, phone, data,name) {
    try {
        /* let medial = null;
        let filename = null;
        if (data.poFile) {
            medial = settings.apiUrl + data.attachment;
            filename = data.attachmentName;
        } */
        
        let registrarOffice = await RegistrarOffice.findById(data.registrarOfficeId)
        let attachmentLink = "";
        if (data.registrarDocument.doc1){
            attachmentLink = settings.apiUrl + data.registrarDocument.doc1;
        } else if (data.registrarDocument.doc2) {
            attachmentLink += " " + settings.apiUrl + data.registrarDocument.doc2;
        } else if (data.registrarDocument.doc3) {
            attachmentLink += " " + settings.apiUrl + data.registrarDocument.doc3;
        }
        utils.sendWhatsapp(phoneCode, phone, [name, moment(new Date(data.appointmentDate)).format("DD-MM-YYYY"), registrarOffice.address, attachmentLink], medial, filename, settings.bankEmailTemplate.paymentComplete)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.poLink = async function (phoneCode, phone, data,name) {
    try {
        let poLink = settings.frontUrl + '/auth/po-number?documentId=' + data._id;
        utils.sendWhatsapp(phoneCode, phone, [name, poLink], null, null, settings.bankEmailTemplate.poLink)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.builderPaymentReceipt = async function (phoneCode, phone, data,name) {
    try {
        let builderFirm = await BuilderFirm.findOne({ _id: data.builderFirmId })
        utils.sendWhatsapp(phoneCode, phone, [name, builderFirm.name, data.projectName, data.amount, data.date,data.transectionid,""], null, null, settings.builderEmailTemplate.paymentComplete)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.poLinkSubmitRequester = function (phoneCode, phone, data,name) {
    try {
        let medial = null;
        let filename = null;
        /* if (data.poFile){
            medial = settings.apiUrl + data.poFile.url;
            filename = data.poFile.originalname;
        } */
        let portalLink = settings.frontUrl;
        utils.sendWhatsapp(phoneCode, phone, [name, data.customerName, data.completedStatus, portalLink], medial, filename, settings.bankEmailTemplate.poLinkSubmitRequester)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
exports.poLinkSubmit = function (phoneCode, phone, data,name) {
    try {
        let medial = null;
        let filename = null;
        /* if (data.poFile){
            medial = settings.apiUrl + data.poFile.url;
            filename = data.poFile.originalname;
        } */
        let portalLink = settings.frontUrl;
        utils.sendWhatsapp(phoneCode, phone, [name, data.completedStatus, portalLink], medial, filename, settings.bankEmailTemplate.poLinkSubmit)
    } catch (error) {
        console.error('ERROR!');
        console.error(error);
    }
};
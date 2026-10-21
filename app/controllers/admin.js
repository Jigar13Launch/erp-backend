const Email = require('../models/Email');
const SMS = require('../models/SMS');
const Settings = require('../models/Settings');
const utils = require('../utils');
exports.settings = async function (req, res) {
    try {
        //utils.sendWhatsapp("+91","8200445203","hello")
        let emails = await Email.find({});
        let sms = await SMS.find({});
        return res.json({
            success: true,
            data: {
                emails,
                sms,
                settings
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.publicsetting = async function (req, res) {
    try {
        let permission = settings.role[req.query.role];
        if (req.headers.user && req.headers.user.role == "Advocate"){
            //delete permission
        }
        let isUploadOwnershipDowcument = false;
        let atsDosDownload = false;
        let isDrafter = true;
        let isTitlePortal = true;
        let isBuilderPortal = true;
        let privateFolder = false;

        if (req.headers['builderFirm']){
            isUploadOwnershipDowcument = req.headers['builderFirm'].isUploadOwnershipDowcument;
            atsDosDownload = req.headers['builderFirm'].atsDosDownload;
        }else if (req.headers['advocateFirm']){
            
            isUploadOwnershipDowcument = req.headers['advocateFirm'].isUploadOwnershipDowcument;
            isDrafter = req.headers['advocateFirm'].isDrafter;
            isTitlePortal = req.headers['advocateFirm'].isTitlePortal;
            isBuilderPortal = req.headers['advocateFirm'].isBuilderPortal;
            privateFolder = req.headers['advocateFirm'].privateFolder;
            atsDosDownload = true;
        } else if (req.query.role == "Admin"){
            isUploadOwnershipDowcument = true;
            atsDosDownload = true;
        }
        return res.json({
            success: true,
            data: {
                isDrafter: isDrafter,
                isTitlePortal: isTitlePortal,
                isBuilderPortal: isBuilderPortal,
                privateFolder: privateFolder,
                company:settings.company,
                designBy:settings.designBy,
                drafterEmailUrl:settings.drafterEmailUrl,
                supportEmail:settings.supportEmail,
                supportPhone:settings.supportPhone,
                address:settings.address,
                permission: permission,
                atsDosDownload: atsDosDownload,
                isUploadOwnershipDowcument: isUploadOwnershipDowcument
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.saveEmail = async function (req, res) {
    try {
        let email = await Email.findOne({_id:req.body.emailId});
        email.content = req.body.content;
        email.title = req.body.title;
        await email.save();
        return res.json({
            success: true,
            data: {
                email
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.saveSMS = async function (req, res) {
    try {
        let sms = await SMS.findOne({_id:req.body.smsId});
        sms.content = req.body.content;
        sms.title = req.body.title;
        await sms.save();
        return res.json({
            success: true,
            data: {
                sms
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.saveSetting = async function (req, res) {
    try {
        let setting = await Settings.findOneAndUpdate({},req.body,{new:true});
        global.settings = setting;   
        return res.json({
            success: true,
            data: {
                setting
            },
            success_code: process.env.SUCCESS_STRING_SETTING_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_SETTING_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateImage = async function (req, res) {
    try {
        for (let file of req.files) {
            const re = /(?:\.([^.]+))?$/;
            let ext = re.exec(file.originalname)[1];
            ext = "png"
            const image_name = req.body.imageName;
            utils.getImageFolderPath(req, 9) + image_name + '.' + ext;
            utils.saveImageFromBrowser(file.path, image_name + '.' + ext, 9);
        }
        return res.json({
            success: true
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
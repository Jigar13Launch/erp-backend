// let jwt = require('jwt-simple');
const User = require('../models/User')
const Bank = require('../models/Bank')
const DrafterFirm = require('../models/DrafterFirm')
const AdvocateFirm = require('../models/AdvocateFirm')
const BuilderFirm = require('../models/BuilderFirm')

module.exports = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.headers['userid'], status: true })
        
        if (!user) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_NOT_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_NOT_EXIST]
            });
        }
        if (!user.token || user.token != req.headers['token']) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
            });
        }
       
        req.headers['user'] = user;
        req.headers['permission'] = settings.role[user.role];
        
        if (["Buyer"].includes(req.headers.user.role)) {
            req.query.advocateFirmId = null;
            req.body.advocateFirmId = null;
            req.query.builderFirmId = null;
            req.body.builderFirmId = null;
            req.body.buyerId = req.headers.user._id;
            req.query.buyerId = req.headers.user._id;
            req.query.bankId = null;
            req.body.bankId = null;
            req.query.portal = "Law";
        }
        if (["Advisor"].includes(req.headers.user.role)) {
            req.query.advocateFirmId = null;
            req.body.advocateFirmId = null;
            req.query.builderFirmId = null;
            req.body.builderFirmId = null;
            req.body.advisorId = req.headers.user._id;
            req.query.advisorId = req.headers.user._id;
            req.query.bankId = null;
            req.body.bankId = null;
            req.query.portal = "Law";
        }
        if (["Drafter Head"/* , "Drafter" */, "Drafter Operational Head"].includes(req.headers.user.role)) {
            if (req.headers.user.drafterFirmId) {
                req.query.drafterFirmId = req.headers.user.drafterFirmId;
                req.body.drafterFirmId = req.headers.user.drafterFirmId;
                let firm = await DrafterFirm.findOne({ _id: req.headers.user.drafterFirmId }).populate("advocateFirmId", { name: 1, isTitlePortal: 1, isDrafter: 1, status:1 })
                if (!firm.status || !firm.advocateFirmId.status) {
                    return res.json({
                        success: false,
                        error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                        error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
                    });
                }else{
                    if (firm.advocateFirmId) {
                        req.query.advocateFirmId = firm.advocateFirmId;
                        req.body.advocateFirmId = firm.advocateFirmId;
                    }
                }
            }
            /* if ("Drafter" == req.headers.user.role) {
                req.query.drafterId = req.headers.user._id;
            } */
            if ("Drafter Operational Head" == req.headers.user.role) {
                req.query.generatedById = req.headers.user._id;
                //req.query.drafterId = req.headers.user.parentId;
                //req.body.drafterId = req.headers.user.parentId;
                req.query.bankIds = req.headers.user.bankIds.join(",");
                req.body.bankIds = req.headers.user.bankIds.join(",");
            }
            
            req.query.builderFirmId = null;
            req.body.builderFirmId = null;
            req.query.portal = "Bank";
            req.body.portal = "Bank";
            req.body.isDrafter = true;
            req.query.isDrafter = true;
            
        }
        if (["Operational Head", "State Head", "District Head", "Branch Head", "City Head", "Staff Admin"].includes(req.headers.user.role)) {
            //req.query.advocateFirmId = null;
            //req.body.advocateFirmId = null;
            req.query.builderFirmId = null;
            req.body.builderFirmId = null;
            req.body.isDrafter = false;
            req.query.isDrafter = false;
            if (req.headers.user.bankId){
                req.query.bankId = req.headers.user.bankId;
                req.body.bankId = req.headers.user.bankId;
                let bank = await Bank.findOne({ _id: req.headers.user.bankId })
                if (!bank.status){
                    return res.json({
                        success: false,
                        error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                        error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
                    });
                }
            }
            req.query.portal = "Bank";
            req.body.portal = "Bank";
            if (user.bankId)
            if ("State Head" == req.headers.user.role) {
                req.query.stateId = req.headers.user.stateId;
                req.body.stateId = req.headers.user.stateId;
            }
            if ("District Head" == req.headers.user.role) {
                req.query.districtId = req.headers.user.districtId;
                req.body.districtId = req.headers.user.districtId;
            }
            if ("Branch Head" == req.headers.user.role) {
                req.query.cityId = req.headers.user.cityId;
                req.body.cityId = req.headers.user.cityId;
                req.query.branchId = req.headers.user.branchId;
                req.body.branchId = req.headers.user.branchId;
            }
            if ("City Head" == req.headers.user.role) {
                req.query.cityId = req.headers.user.cityId;
                req.body.cityId = req.headers.user.cityId;
            }
            if ("Staff Admin" == req.headers.user.role) {
                req.query.staffAdminId = req.headers.user._id;
                req.body.staffAdminId = req.headers.user._id;
                if (req.headers.user.cityId){
                    req.query.cityId = req.headers.user.cityId;
                    req.body.cityId = req.headers.user.cityId;
                }
                if (req.headers.user.stateId){
                    req.query.stateId = req.headers.user.stateId;
                    req.body.stateId = req.headers.user.stateId;
                }
                if (req.headers.user.districtId){
                    req.query.districtId = req.headers.user.districtId;
                    req.body.districtId = req.headers.user.districtId;
                }
            }
            if ("Operational Head" == req.headers.user.role) {
                req.query.generatedById = req.headers.user._id;
                req.query.branchId = req.headers.user.branchId;
                req.body.branchId = req.headers.user.branchId;
                req.query.districtId = req.headers.user.districtId;
                req.body.districtId = req.headers.user.districtId;
                req.query.cityId = req.headers.user.cityId;
                req.body.cityId = req.headers.user.cityId;
            }
        }
        if (["Advocate Staff", "Advocate"].includes(req.headers.user.role)) {
            
            req.query.advocateFirmId = req.headers.user.advocateFirmId;
            req.body.advocateFirmId = req.headers.user.advocateFirmId;
            
            let advocateFirm = await AdvocateFirm.findOne({ _id: req.headers.user.advocateFirmId })
            req.headers['advocateFirm'] = advocateFirm;
            if (!advocateFirm.status) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
                });
            }
            if ("Advocate Staff" == req.headers.user.role){
                req.query.staffId = req.headers.user._id;
                req.body.staffId = req.headers.user._id;
            }
            if (!advocateFirm.isDrafter){
                req.query.portal = "Law";
                req.body.portal = "Law";
                req.query.bankId = null;
                req.body.bankId = null;
            }
        }
        if (["Builder", "Manager", "Salesman"].includes(req.headers.user.role)) {
            req.query.builderFirmId = req.headers.user.builderFirmId;
            req.body.builderFirmId = req.headers.user.builderFirmId;
            req.body.bankId = null;
            req.query.bankId = null;
            let builderFirm = await BuilderFirm.findOne({ _id: req.headers.user.builderFirmId })
            req.headers['builderFirm'] = builderFirm;
            if (!builderFirm.status) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
                });
            }
            if (["Manager", "Salesman"].includes(req.headers.user.role)) {
                req.query.projectIds = req.headers.user.projectIds;
                req.body.projectIds = req.headers.user.projectIds;
            }
            req.query.portal = "Law";
            req.body.portal = "Law";
        }
        
        next();
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
            error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
        });
    }

};
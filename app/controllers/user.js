const User = require('../models/User')
const utils = require('../utils');
var crypto = require('crypto');
const whatsapp = require('../whatsapp');
const mongoose = require("mongoose")
const noOfRecord = 10;
// const City = require('../models/City')
// const AutoIncrement = require('../models/AutoIncrement')
// const BankBranch = require('../models/BankBranch')
// const DrafterFirm = require('../models/DrafterFirm')
// const District = require('../models/District')
// const State = require('../models/State')
// const sms = require('../sms');
const email = require('../email');
// Privilege fields must never be set from a public request body
const stripPrivilegedFields = (body) => {
    delete body.role;
    delete body.createdBy;
    delete body.isActive;
    delete body.logo;
}
exports.createuser = async function (req, res) {
    try {
        stripPrivilegedFields(req.body);
        let user = await User.findOne({isDelete :false,$or: [
            { email: req.body.email },
            { loginId: req.body.loginId },
            { phone: req.body.phone },
          ]});
        if (user) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_ALREADY_EXIST]
            });
        }
        
        req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
        req.body.token = utils.tokenGenerator(32);        
        user = new User(req.body)
        await user.save()
        user = JSON.parse(JSON.stringify(user));
        delete user.password;
        return res.json({
            success: true,
            data: {
                user,
            },
            success_code: process.env.SUCCESS_STRING_USER_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.loginuser = async function (req, res) {
    try {
        let user 
        // const deviceId = req.body.deviceId;
        console.log("req.body",req.body)
        if(req.body.identifier){
            user = await User.findOne({ loginId: req.body.identifier, isDelete: false })
        }
        console.log("user",user)
                            
        if (!user) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_NOT_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_NOT_EXIST]
            });
        }
        if (user.isActive === false) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                error_message: "Your account is suspended. Please contact support."
            });
        }
        let hashPassword;
        let hashOtp;
        if (req.body.password){
            hashPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
            console.log("hashPassword",hashPassword)
            console.log("database pass",user.password)
        }
        if (req.body.otp){
            hashOtp = crypto.createHash('md5').update(req.body.otp).digest('hex');
        }
        // if (!deviceId) {
        //     return res.json({
        //         success: false,
        //         error_code: process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING,
        //         error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING]
        //     });
        // }
        if (req.body.otp && req.body.password && !req.body.isForgot) {
            if (user.otp != hashOtp){
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_USER_WRONG_OTP,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_WRONG_OTP]
                });
            } else {
                //set new password
                // await User.updateMany(
                //     { _id: { $ne: user._id }, deviceId: deviceId, token: { $ne: "" } },
                //     { $set: { token: "" } }
                // );
                req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
                let token = utils.tokenGenerator(32);
                console.log("new pass set",user)
                user.password = req.body.password;
                user.token = token;
                user.otp = "";
                await user.save();
                delete user.password
                return res.json({
                    success: true,
                    data: {
                        user,                        
                    },
                    success_code: process.env.SUCCESS_STRING_USER_LOGIN_SUCCESSFULLY,
                    success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_LOGIN_SUCCESSFULLY]
                });
            }
        } else if (user.password != hashPassword && !req.body.isForgot) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_WRONG_PASSWORD,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_WRONG_PASSWORD]
            });
        } else if (req.body.isForgot) {
            //forgot password submit
            let otp = utils.otpGenerator(4);
            user.otp = crypto.createHash('md5').update(otp).digest('hex');
            await user.save();
            // let password = utils.tokenGenerator(8);
            // user.password = crypto.createHash('md5').update(password).digest('hex') ;
            // await user.save();
            email.emailSendOtp(req, user.email, { otp: otp, phone: user.phone, phoneCode: user.phoneCode })
            return res.json({
                success: true,
                success_code: process.env.SUCCESS_STRING_OTP_SEND_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_OTP_SEND_SUCCESSFULLY]
            });
        }

        // await User.updateMany(
        //     { _id: { $ne: user._id }, deviceId: deviceId, token: { $ne: "" } },
        //     { $set: { token: "" } }
        // );
        var token = utils.tokenGenerator(32);
        user.token = token;
        // user.deviceId = deviceId;
        user.otp = "";
        user.lastLogin = new Date();
        await user.save();
        user = JSON.parse(JSON.stringify(user));        
        delete user.password;
        return res.json({
            success: true,
            data: {
                user,
                
            },
            success_code: process.env.SUCCESS_STRING_USER_LOGIN_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_LOGIN_SUCCESSFULLY]
        });

        
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.logoutuser = async function (req, res) {
    try {
        let user = await User.findOne({ _id: req.headers.userid });
        if (!user) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_NOT_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_NOT_EXIST]
            });
        }
        user.token = "";
        await user.save();
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_USER_LOGOUT_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_LOGOUT_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateuser = async function (req, res) {
    try {
        let user
        stripPrivilegedFields(req.body);
        if (req.body.userId){
            user = await User.findOne({ _id: { $ne: new mongoose.Types.ObjectId(req.body.userId) },$or: [
                { email: req.body.email },
                { loginId: req.body.loginId },
                { phone: req.body.phone }]
                , isDelete: false });
            if (user) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_USER_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_ALREADY_EXIST]
                });
            }
            if(req.body.password && req.body.password != ""){
                req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
            } else{
                user = await User.findOne({_id: new mongoose.Types.ObjectId(req.body.userId)})
                req.body.password = user.password
            }     
            user = await User.findOneAndUpdate({ _id: req.body.userId }, req.body, { new: true })
            return res.json({
                success: true,
                data: {
                    user
                },
                success_code: process.env.SUCCESS_STRING_USER_UPDATED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_UPDATED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteuser = async function (req, res) {
    try {
        await User.findOneAndUpdate({ _id: req.body.userId, isDelete:false }, {isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_USER_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_USER_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getusers = async function (req, res) {
    try {
        let users = []
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
            const searchRegex = new RegExp(req.query.searchValue, 'i');
            query.$or = [
                { firstName: { $regex: searchRegex } },
                { lastName: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
            ];
        }
        
        if (req.query.role) {
            query.role = { $regex: new RegExp(req.query.role, 'i') };
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            users = await User.find(query);
            utils.generateExcel({ firstName: "string", lastName: "string", email: "string", phoneCode: "string", phone: "string"}, users, "users.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            users = await User.find(query);
            utils.generatePDF({ firstName: "string", lastName: "string", email: "string", phoneCode: "string", phone: "string"}, users, "users.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            users = await User.find(query)
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await User.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            users = await User.find(query).sort(sortObj).skip(skip).limit(limit);
        }
        users = JSON.parse(JSON.stringify(users));
        users.map((x)=>{
            delete x.password;
            delete x.token;
            delete x.otp;
            return x;
        })
        return res.json({
            success: true,
            data: {
                users,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

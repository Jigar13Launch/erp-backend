const Company = require('../models/Company');
const Earning = require('../models/earning');
const Sell = require('../models/sell');
const User = require('../models/User')
const Buy = require('../models/buy');
const Ledger = require('../models/ledger')
const utils = require('../utils');
const mongoose = require("mongoose")
const crypto = require('crypto');
const noOfRecord = 10;

const isSuperAdmin = (req) => !!req.user && req.user.role === 'SUPER_ADMIN';
const md5 = (value) => crypto.createHash('md5').update(String(value)).digest('hex');
const notAuthorized = (res) => res.json({
    success: false,
    error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
    error_message: "You are not authorized to perform this action."
});
// Which login field is already used by another user (null if none)
async function findUserConflict({ excludeUserId, loginId, email, phone, gst }) {
    const or = [];
    if (loginId) or.push({ loginId });
    if (email) or.push({ email });
    if (phone) or.push({ phone: String(phone) });
    if (gst) or.push({ gst });
    if (!or.length) return null;
    const query = { isDelete: false, $or: or };
    if (excludeUserId) query._id = { $ne: excludeUserId };
    const dup = await User.findOne(query);
    if (!dup) return null;
    if (loginId && dup.loginId === loginId) return "Login ID";
    if (email && dup.email === email) return "Email";
    if (phone && dup.phone === String(phone)) return "Mobile number";
    return "GSTIN";
}
// Attach tenant login info (never the password/token) to companies that are linked to a tenant
async function withTenantInfo(companies) {
    const ids = companies.filter(c => c.tenantUserId).map(c => c.tenantUserId);
    if (!ids.length) return companies;
    const users = await User.find({ _id: { $in: ids } }).select('loginId email isActive logo').lean();
    const map = new Map(users.map(u => [String(u._id), u]));
    return companies.map(c => {
        const o = c.toObject();
        o.tenant = c.tenantUserId ? (map.get(String(c.tenantUserId)) || null) : null;
        return o;
    });
}

exports.createCompany = async function (req, res) {
    try {
        // tenantUserId is only ever set by the server
        delete req.body.tenantUserId;
        const isTenantCreate = !!req.body.loginId;
        if (isTenantCreate && !isSuperAdmin(req)) {
            return notAuthorized(res);
        }
        let query
        query = {userId: req.userId,isDelete: false,name:req.body.name}
      
        let company
        company = await Company.findOne(query);
        if (company) {
            return res.json({
                success: false,
                data:{
                  company  
                },
                error_code: process.env.ERROR_STRING_COMPANY_NAME_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_NAME_ALREADY_EXIST]
            });
        }
        query = { userId: req.userId,isDelete: false, mobileNumber:req.body.mobileNumber}
        company = await Company.findOne(query);
        if (company) {
            return res.json({
                success: false,
                data:{
                    company  
                },
                error_code: process.env.ERROR_STRING_COMPANY_PHONE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_PHONE_ALREADY_EXIST]
            });
        }
        if (req.body.gstin) {
            query = { userId: req.userId,isDelete: false, gstin:req.body.gstin}
            company = await Company.findOne(query);
            if (company) {
                return res.json({
                    success: false,
                    data:{
                      company  
                    },
                    error_code: process.env.ERROR_STRING_COMPANY_GST_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_GST_ALREADY_EXIST]
                });
            }
            let user = await User.findOne({_id: new mongoose.Types.ObjectId(req.userId)})
            console.log("user",user)
            if (user && String(user.gst) == String(req.body.gstin)) {
                return res.json({
                    success: false,
                    data:null,
                    error_code: process.env.ERROR_STRING_USER_GST_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_GST_ALREADY_EXIST]
                });
            }
        }
        req.body.userId = req.userId;
        req.body.user = req.user
        let tenantUser = null;
        if (isTenantCreate) {
            const { loginId, password, email, address, gstin, mobileNumber } = req.body;
            if (!password || !email || !address) {
                return res.json({
                    success: false,
                    error_message: "Email, address and password are required to create a tenant login."
                });
            }
            const conflict = await findUserConflict({ loginId, email, phone: mobileNumber, gst: gstin });
            if (conflict) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_USER_ALREADY_EXIST,
                    error_message: conflict + " is already used by another login."
                });
            }
            tenantUser = await User.create({
                name: req.body.contactName || req.body.name,
                companyName: req.body.name,
                gst: gstin || "",
                loginId,
                email,
                address,
                password: md5(password),
                phone: String(mobileNumber),
                token: utils.tokenGenerator(32),
                role: 'TENANT',
                createdBy: req.userId,
                logo: req.file ? 'logos/' + req.file.filename : "",
                isActive: true
            });
            req.body.tenantUserId = tenantUser._id;
        }
        delete req.body.password;
        delete req.body.loginId;
        delete req.body.contactName;
        let newCompany;
        try {
            newCompany = await Company.create(req.body);
        } catch (err) {
            // do not leave a login without its company
            if (tenantUser) await User.deleteOne({ _id: tenantUser._id });
            throw err;
        }
        return res.json({
            success: true,
            data: {
                newCompany,
                company: newCompany,
                tenant: tenantUser ? { loginId: tenantUser.loginId, email: tenantUser.email, isActive: tenantUser.isActive, logo: tenantUser.logo } : null
            },
            success_code: process.env.SUCCESS_STRING_COMPANY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_COMPANY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deleteCompany = async function (req, res) {
    try {
        if(req.body.companyId){
            let company = await Company.findOneAndUpdate({ _id: req.body.companyId, isDelete: false }, { isDelete: true });
            if(company){
                // deleting a tenant company also closes that tenant's login
                if (company.tenantUserId && isSuperAdmin(req) && String(company.userId) === String(req.userId)) {
                    await User.updateOne({ _id: company.tenantUserId }, { isDelete: true, isActive: false, token: "" });
                }
                await Sell.updateMany({companyId:req.body.companyId},{isActive:false});
                await Buy.updateMany({companyId:req.body.companyId},{isActive:false});
                await Earning.updateMany({companyId:req.body.companyId},{isActive:false});
                await Ledger.updateMany({companyId:req.body.companyId},{isActive:false});
                return res.json({
                    success: true,
                    success_code: process.env.SUCCESS_STRING_COMPANY_DELETE_SUCCESSFULLY,
                    success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_COMPANY_DELETE_SUCCESSFULLY]
                });
            }else{

                return res.json({
                    success: true,
                    success_code: process.env.ERROR_CODE_123,
                    success_message: process.env["SUCCESS_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND]
                });
            }
            
        }else{

            return res.json({
                success: true,
                success_code: process.env.ERROR_CODE_124,
                success_message: process.env["SUCCESS_CODE_" + process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateCompany = async function (req, res) {
    try {
        delete req.body.tenantUserId;
        let query
        query = { _id: {$ne:new mongoose.Types.ObjectId(req.body.companyId)},userId: req.userId,isDelete: false,name:req.body.name}
      
        let company
        company = await Company.findOne(query);
        if (company) {
            return res.json({
                success: false,
                data:{
                  company  
                },
                error_code: process.env.ERROR_STRING_COMPANY_NAME_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_NAME_ALREADY_EXIST]
            });
        }
        query = { _id: {$ne:new mongoose.Types.ObjectId(req.body.companyId)},userId: req.userId,isDelete: false,mobileNumber:req.body.mobileNumber}
        company = await Company.findOne(query);
        if (company) {
            return res.json({
                success: false,
                data:{
                  company  
                },
                error_code: process.env.ERROR_STRING_COMPANY_PHONE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_PHONE_ALREADY_EXIST]
            });
        }
        if (req.body.gstin) {
            query = { _id: {$ne:new mongoose.Types.ObjectId(req.body.companyId)},userId: req.userId,isDelete: false,gstin:req.body.gstin}
            company = await Company.findOne(query);
            if (company) {
                return res.json({
                    success: false,
                    data:{
                      company  
                    },
                    error_code: process.env.ERROR_STRING_COMPANY_GST_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COMPANY_GST_ALREADY_EXIST]
                });
            }
            let user = await User.findOne({_id: new mongoose.Types.ObjectId(req.userId)})
            console.log("user",user)
            if (user && String(user.gst) == String(req.body.gstin)) {
                return res.json({
                    success: false,
                    data:null,
                    error_code: process.env.ERROR_STRING_USER_GST_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_GST_ALREADY_EXIST]
                });
            }
        }
        // super admin editing a tenant company keeps the tenant login in sync
        let tenantUpdate = null;
        if (isSuperAdmin(req)) {
            const linked = await Company.findOne({ _id: req.body.companyId, userId: req.userId, isDelete: false, tenantUserId: { $ne: null } });
            if (linked) {
                const conflict = await findUserConflict({
                    excludeUserId: linked.tenantUserId,
                    email: req.body.email,
                    phone: req.body.mobileNumber,
                    gst: req.body.gstin
                });
                if (conflict) {
                    return res.json({
                        success: false,
                        error_code: process.env.ERROR_STRING_USER_ALREADY_EXIST,
                        error_message: conflict + " is already used by another login."
                    });
                }
                tenantUpdate = { userId: linked.tenantUserId, set: {} };
                if (req.body.name) tenantUpdate.set.companyName = req.body.name;
                if (req.body.gstin !== undefined) tenantUpdate.set.gst = req.body.gstin || "";
                if (req.body.mobileNumber) tenantUpdate.set.phone = String(req.body.mobileNumber);
                if (req.body.address) tenantUpdate.set.address = req.body.address;
                if (req.body.email) tenantUpdate.set.email = req.body.email;
                if (req.body.password) tenantUpdate.set.password = md5(req.body.password);
                if (req.file) tenantUpdate.set.logo = 'logos/' + req.file.filename;
            }
        }
        delete req.body.password;
        delete req.body.loginId;
        company = await Company.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.companyId),isDelete: false},req.body,{new:true});
        if (company && tenantUpdate && Object.keys(tenantUpdate.set).length) {
            await User.updateOne({ _id: tenantUpdate.userId }, { $set: tenantUpdate.set });
        }
        return res.json({
            success: true,
            data: {
                company
            },
            success_code: process.env.SUCCESS_STRING_COMPANY_UPDATE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_COMPANY_UPDATE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getCompanies = async function (req, res) {
    try {
        let companies = []
        let query = {userId:req.userId, isDelete: { $ne: true } };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();
            if (searchValue) {
                query.$or = [
                    { name: { $regex: new RegExp(searchValue, 'i') } },
                    { gstin: { $regex: new RegExp(searchValue, 'i') } },
                    { address: { $regex: new RegExp(searchValue, 'i') } }
                ];
            }
        }
        if (req.query.companyId) {
            query._id = req.query.companyId;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            companies = await Company.find(query);
            utils.generateExcel({ name: "string", address: "string", districtId_name: "string" }, registrarboys, "registrarboys.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            companies = await Company.find(query);
            utils.generatePDF({ name: "string", address: "string", districtId_name: "string" }, registrarboys, "registrarboys.xlsx", req, res)
            return;
        } else if (req.query.page == undefined) {
            companies = await Company.find(query).sort(sortObj);
            companies = await withTenantInfo(companies);
            return res.json({
                success: true,
                data: {
                    companies,
                }
            });
        } else {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let skipIndex = (page - 1) * limit;            
            let totalRecord = await Company.countDocuments(query);
            let pageNumber = Math.ceil(totalRecord / limit);
            companies = await Company.find(query).sort(sortObj).skip(skipIndex).limit(limit);
            companies = await withTenantInfo(companies);
            return res.json({
                success: true,
                data: {
                    companies,
                    total: totalRecord,
                    page: pageNumber,
                }
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

// ---- Tenant management (super admin only, enforced by requireRole in the route) ----
async function findOwnTenantCompany(req) {
    if (!req.body.companyId) return null;
    return Company.findOne({ _id: req.body.companyId, userId: req.userId, isDelete: false, tenantUserId: { $ne: null } });
}
exports.toggleTenantActive = async function (req, res) {
    try {
        const company = await findOwnTenantCompany(req);
        if (!company) {
            return res.json({ success: false, error_message: "Tenant company not found." });
        }
        const isActive = req.body.isActive === true || req.body.isActive === 'true';
        const update = { isActive };
        if (!isActive) update.token = ""; // ends any open session
        await User.updateOne({ _id: company.tenantUserId }, { $set: update });
        return res.json({
            success: true,
            data: { isActive },
            success_message: isActive ? "Tenant activated." : "Tenant suspended."
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.resetTenantPassword = async function (req, res) {
    try {
        const company = await findOwnTenantCompany(req);
        if (!company) {
            return res.json({ success: false, error_message: "Tenant company not found." });
        }
        if (!req.body.password || String(req.body.password).length < 6) {
            return res.json({ success: false, error_message: "Password must be at least 6 characters." });
        }
        await User.updateOne({ _id: company.tenantUserId }, { $set: { password: md5(req.body.password), token: "" } });
        return res.json({ success: true, success_message: "Password reset." });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
// Any logged-in user changes only their own logo
exports.updateMyLogo = async function (req, res) {
    try {
        if (!req.file) {
            return res.json({ success: false, error_message: "Please choose a logo image." });
        }
        const logo = 'logos/' + req.file.filename;
        await User.updateOne({ _id: req.userId }, { $set: { logo } });
        return res.json({ success: true, data: { logo }, success_message: "Logo updated." });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

const User = require('../models/User')
const checkPermission = (tab, type) => {
    return async (req, res, next) => {
        if (type =="create"){
            if (!settings.role[req.headers.user.role] || !settings.role[req.headers.user.role][req.body.role] || !settings.role[req.headers.user.role][req.body.role].create) {
                return res.json({
                    success: false,
                    condition: 3,
                    error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_NOT_AUTHORIZE]
                });
            }
            if (req.headers.user.role.includes("Advocate") && req.body.role.includes("Builder")) {
                req.body.assignAdvocateId = req.headers.user._id;
            }
            if (req.headers.user.role != "Admin"){
                req.body.portal = null;
                if (settings.Law.includes(req.body.role)) {
                    req.body.portal = "Law";
                }
                if (settings.Bank.includes(req.body.role)) {
                    req.body.portal = "Bank";
                }
            }
        } else if (type == "update") {
            let updateuser = await User.findOne({_id:req.body.userId})
            req.headers.updateuser = updateuser;
            if (String(req.headers.updateuser._id) == String(req.headers.user._id)){

            }else if (!settings.role[req.headers.user.role] || !settings.role[req.headers.user.role][updateuser.role] || !settings.role[req.headers.user.role][updateuser.role].update) {
                return res.json({
                    success: false,
                    condition: 3,
                    error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_NOT_AUTHORIZE]
                });
            }
            if (req.body.role && req.headers.user.role){
                if (req.headers.user.role.includes("Advocate") && req.body.role.includes("Builder")) {
                    req.body.assignAdvocateId = req.headers.user._id;
                }
            }
            delete req.body.portal;
            delete req.body.assignAdvocateId;
            delete req.body.builderFirmId;
            delete req.body.bankId;
            delete req.body.role;
            //delete req.body.branchId;
        }
        next();
    }
}
module.exports = checkPermission;
// app/middlewear/auth.js
const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const userId = req.headers.userid;
        const token = req.headers.token;

        if (!userId || !token) {
            return res.status(401).json({
                success: false,
                error_code: process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING]
            });
        }

        let user = await User.findOne({ _id: userId, token: token, isDelete: false, isActive: { $ne: false } });

        if (!user) {
            return res.status(401).json({
                success: false,
                error_code: process.env.ERROR_STRING_TOKEN_EXPIRED,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TOKEN_EXPIRED]
            });
        }
        delete user.password
        delete user.token
        delete user.otp
        delete user.loginId
        delete user.deviceId
        // User is valid, continue
        req.userId = userId;
        req.user = user;
        req.body.userId = userId;
        req.body.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            error_code: "INTERNAL_ERROR",
            error_message: "Something went wrong."
        });
    }
}

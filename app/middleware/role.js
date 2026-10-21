// Use after authenticate.js (needs req.user). Usage: requireRole('SUPER_ADMIN')
module.exports = function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                error_message: "You are not authorized to perform this action."
            });
        }
        next();
    };
};

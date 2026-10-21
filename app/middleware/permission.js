
const checkPermission= (tab, type) => {
    return (req, res, next) => {
        if (!settings.role[req.headers.user.role] || !settings.role[req.headers.user.role][tab] || !settings.role[req.headers.user.role][tab][type]){
            return res.json({
                success: false,
                condition:1,
                error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_NOT_AUTHORIZE]
            });
        }
        if (req.headers['user'].role == "Advocate" && (tab == "Drafter Statistic" || tab == "Drafter Generated Document" || tab == "Drafter Firm" || tab == "Bank Template") && !req.headers['advocateFirm'].isDrafter){
            return res.json({
                success: false,
                condition: 100,
                error_code: process.env.ERROR_STRING_NOT_AUTHORIZE,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_NOT_AUTHORIZE]
            });
        }
        if (tab == "Drafter Generated Document" || tab == "Drafter Statistic"){
            req.body.isDrafter = true;
            req.query.isDrafter = true;
        } else if (tab == "Project Generated Document" || tab == "Project Statistic" || tab == "Project Template"){
            req.body.isProject = true;
            req.query.isProject = true;
        } else if (tab == "Law Generated Document" || tab == "Law Statistic" || tab == "Law Template") {
            req.body.isLaw = true;
            req.query.isLaw = true;
        } else if (tab == "Bank Generated Document" || tab == "Bank Statistic" || tab == "Bank Template") {
            req.body.isBank = true;
            req.query.isBank = true;
        }
        next();
    }
}
module.exports = checkPermission;

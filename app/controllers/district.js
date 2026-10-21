const District = require('../models/District')
const State = require('../models/State')
const utils = require('../utils');
const noOfRecord = 10;
exports.createdistrict = async function (req, res) {
    try {
        let district = await District.findOne({ name: req.body.name, stateId: req.body.stateId });
        if (district) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_DISTRICT_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DISTRICT_ALREADY_EXIST]
            });
        }
        if (req.body.stateId) {
            let state = await State.findOne({ _id: req.body.stateId })
            req.body.countryId = state.countryId;
        }
        district = new District(req.body)
        await district.save()
        return res.json({
            success: true,
            data: {
                district
            },
            success_code: process.env.SUCCESS_STRING_DISTRICT_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DISTRICT_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatedistrict = async function (req, res) {
    try {
        let district
        if (req.body.name){
            district = await District.findOne({ _id: { $ne: req.body.districtId }, stateId: req.body.stateId, name: req.body.name });
            if (district) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_DISTRICT_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DISTRICT_ALREADY_EXIST]
                });
            }
        }
        if (req.body.stateId) {
            let state = await State.findOne({ _id: req.body.stateId })
            req.body.countryId = state.countryId;
        }
        district = await District.findOneAndUpdate({ _id: req.body.districtId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                district
            },
            success_code: process.env.SUCCESS_STRING_DISTRICT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_DISTRICT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getdistricts = async function (req, res) {
    try {
        let districts = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let project = { name: 1, district:1 };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.countryId) {
            query.countryId = req.query.countryId
        }
        if (req.query.stateId) {
            query.stateId = req.query.stateId
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.districtId) {
            query._id = req.query.districtId;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            districts = await District.find(query, project).populate("countryId", { name: 1 }).populate("stateId", { name: 1 });
            utils.generateExcel({ name: "string", "stateId_name": "string", "countryId_name": "string" }, districts, "districts.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            districts = await District.find(query, project).populate("countryId", { name: 1 }).populate("stateId", { name: 1 });
            utils.generatePDF({ name: "string", "stateId_name": "string", "countryId_name": "string" }, districts, "districts.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            districts = await District.find(query, project).populate("countryId", { name: 1 }).populate("stateId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await District.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            districts = await District.find(query, project).sort(sortObj).skip(skip).limit(limit).populate("countryId", { name: 1 }).populate("stateId", { name: 1 })
        }
        return res.json({
            success: true,
            data: {
                districts,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

const State = require('../models/State')
const utils = require('../utils');
const noOfRecord = 10;
exports.createstate = async function (req, res) {
    try {
        let state = await State.findOne({ name: req.body.name, countryId: req.body.countryId });
        if (state) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_STATE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_STATE_ALREADY_EXIST]
            });
        }
        state = new State(req.body)
        await state.save()
        return res.json({
            success: true,
            data: {
                state
            },
            success_code: process.env.SUCCESS_STRING_STATE_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_STATE_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatestate = async function (req, res) {
    try {
        let state
        if (req.body.name){
            state = await State.findOne({ _id: { $ne: req.body.stateId }, countryId: req.body.countryId, name: req.body.name });
            if (state) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_STATE_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_STATE_ALREADY_EXIST]
                });
            }
        }
        state = await State.findOneAndUpdate({ _id: req.body.stateId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                state
            },
            success_code: process.env.SUCCESS_STRING_STATE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_STATE_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getstates = async function (req, res) {
    try {
        let states = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
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
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            states = await State.find(query).populate("countryId", { name: 1 });
            utils.generateExcel({ name: "string", "countryId_name": "string" }, states, "states.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            states = await State.find(query).populate("countryId", { name: 1 });
            utils.generatePDF({ name: "string", "countryId_name": "string" }, states, "states.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            states = await State.find(query).populate("countryId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await State.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            states = await State.find(query).sort(sortObj).skip(skip).limit(limit).populate("countryId", { name: 1 })
        }
        return res.json({
            success: true,
            data: {
                states,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

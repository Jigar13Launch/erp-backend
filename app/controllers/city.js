const City = require('../models/City')
const District = require('../models/District')
const utils = require('../utils');
const noOfRecord = 10;
exports.createcity = async function (req, res) {
    try {
        let city = await City.findOne({ name: req.body.name, districtId: req.body.districtId });
        if (city) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_CITY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_CITY_ALREADY_EXIST]
            });
        }
        if (req.body.districtId) {
            let district = await District.findOne({ _id: req.body.districtId })
            req.body.countryId = district.countryId;
            req.body.stateId = district.stateId;
        }
        city = new City(req.body)
        await city.save()
        return res.json({
            success: true,
            data: {
                city
            },
            success_code: process.env.SUCCESS_STRING_CITY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_CITY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatecity = async function (req, res) {
    try {
        let city
        if (req.body.name){
            city = await City.findOne({ _id: { $ne: req.body.cityId }, districtId: req.body.districtId, name: req.body.name });
            if (city) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_CITY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_CITY_ALREADY_EXIST]
                });
            }
        }
        if (req.body.districtId) {
            let district = await District.findOne({ _id: req.body.districtId })
            req.body.countryId = district.countryId;
            req.body.stateId = district.stateId;
        }
        city = await City.findOneAndUpdate({ _id: req.body.cityId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                city
            },
            success_code: process.env.SUCCESS_STRING_CITY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_CITY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getcities = async function (req, res) {
    try {
        let cities = []
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
        if (req.query.cityId) {
            query._id = req.query.cityId;
        }
        if (req.query.countryId) {
            query.countryId = req.query.countryId
        }
        if (req.query.stateId) {
            query.stateId = req.query.stateId
        }
        if (req.query.districtId) {
            query.districtId = req.query.districtId
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.district) {
            query.district = req.query.district.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            cities = await City.find(query).populate("countryId", { name: 1 }).populate("stateId", { name: 1 }).populate("districtId", { name: 1 });
            utils.generateExcel({ name: "string", "districtId_name": "string", "stateId_name": "string", "countryId_name": "string" }, cities, "cities.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            cities = await City.find(query).populate("countryId", { name: 1 }).populate("stateId", { name: 1 }).populate("districtId", { name: 1 });
            utils.generatePDF({ name: "string", "districtId_name": "string", "stateId_name": "string", "countryId_name": "string" }, cities, "cities.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            cities = await City.find(query).populate("countryId", { name: 1 }).populate("stateId", { name: 1 }).populate("districtId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await City.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            cities = await City.find(query).sort(sortObj).skip(skip).limit(limit).populate("countryId", { name: 1 }).populate("stateId", { name: 1 }).populate("districtId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                cities,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

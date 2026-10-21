const Country = require('../models/Country')
const utils = require('../utils');
const noOfRecord = 10;
exports.createcountry = async function (req, res) {
    try {
        let country = await Country.findOne({ name: req.body.name });
        if (country) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_COUNTRY_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COUNTRY_ALREADY_EXIST]
            });
        }
        country = new Country({
            name: req.body.name
        })
        await country.save()
        return res.json({
            success: true,
            data: {
                country
            },
            success_code: process.env.SUCCESS_STRING_COUNTRY_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_COUNTRY_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatecountry = async function (req, res) {
    try {
        let country
        if (req.body.name){
            country = await Country.findOne({ _id: { $ne: req.body.countryId }, name: req.body.name });
            if (country) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_COUNTRY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_COUNTRY_ALREADY_EXIST]
                });
            }
        }
        country = await Country.findOneAndUpdate({ _id: req.body.countryId }, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                country
            },
            success_code: process.env.SUCCESS_STRING_COUNTRY_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_COUNTRY_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getcountries = async function (req, res) {
    try {
        let countries = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let project = { name: 1 };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            countries = await Country.find(query, project);
            utils.generateExcel({ name: "string" }, countries, "countries.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            countries = await Country.find(query, project);
            utils.generatePDF({ name: "string" }, countries, "countries.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            countries = await Country.find(query, project);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Country.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            countries = await Country.find(query, project).sort(sortObj).skip(skip).limit(limit)
        }
        return res.json({
            success: true,
            data: {
                countries,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

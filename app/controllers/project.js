const Project = require('../models/Project')
const User = require('../models/User')
const utils = require('../utils');
const noOfRecord = 10;
exports.createproject = async function (req, res) {
    try {
        let project = await Project.findOne({ name: req.body.name });
        if (project) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_PROJECT_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PROJECT_ALREADY_EXIST]
            });
        }
        if (req.body.advocateId) {
            let advocate = await User.findOne({ _id: req.body.advocateId })
            req.body.advocateFirmId = advocate.advocateFirmId;
        }
        if (req.body.builderId) {
            let builder = await User.findOne({ _id: req.body.builderId })
            req.body.builderFirmId = builder.builderFirmId;
        }
        project = new Project(req.body)
        await project.save();
        if (project.fixPrice && project.fixPrice > 0) {
            utils.generateBuilderInvoice(project)
        }
        return res.json({
            success: true,
            data: {
                project
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateproject = async function (req, res) {
    try {
        let query = {
            isDelete: { $ne: true }
        };
        if (req.body.advocateFirmId) {
            query.advocateFirmId = req.body.advocateFirmId;
        }
        if (req.body.builderFirmId) {
            query.builderFirmId = req.body.builderFirmId;
        }
        let project
        if (req.body.name) {
            query._id = { $ne: req.body.projectId };
            query.name = req.body.name;
            project = await Project.findOne(query);
            delete query.name;
            if (project) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_PROJECT_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PROJECT_ALREADY_EXIST]
                });
            }
        }
        query = { _id: req.body.projectId };
        delete req.body.advocateId;
        delete req.body.builderId;
        project = await Project.findOneAndUpdate(query, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                project
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectdocument = async function (req, res) {
    try {
        let query = {};
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        for (let file of req.files) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(file.originalname)[1];
            var image_name = project._id;
            var url = utils.getImageFolderPath(req, 7) + image_name + project.documents.length + '.' + ext;
            utils.saveImageFromBrowser(file.path, image_name + project.documents.length + '.' + ext, 7);
            project.documents.push({
                url: url,
                originalname: file.originalname,
            });
        }
        if (req.body.deleteId) {
            let index = project.documents.findIndex((x) => String(x._id) == req.body.deleteId);
            if (index != -1) {
                utils.deleteImageFromFolder(project.documents[index].url, 7)
                project.documents.splice(index, 1);
            }
        }
        project.markModified("documents");
        await project.save();
        return res.json({
            success: true,
            data: {
                project
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getprojects = async function (req, res) {
    try {
        let projects = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        if (req.query.advocateFirmId) {
            query.advocateFirmId = req.query.advocateFirmId;
        }
        if (req.query.staffAdminId) {
            query.staffAdminId = req.query.staffAdminId;
        }
        if (req.query.projectId) {
            query._id = req.query.projectId;
        } else if (req.query.projectIds) {
            query._id = { $in: req.query.projectIds };
        }
        if (req.query.staffAdvocateId) {
            query.staffAdvocateId = req.query.staffAdvocateId;
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
        if (req.query.advocateId) {
            query.advocateId = req.query.advocateId;
        }
        if (req.query.builderId) {
            query.builderId = req.query.builderId;
        }
        if (req.query.subBuilderId) {
            query.subBuilderId = req.query.subBuilderId;
        }
        if (req.query.staffBuilderId) {
            query.staffBuilderId = req.query.staffBuilderId;
        }
        if (req.query.staffAdvocateId) {
            query.staffAdvocateId = req.query.staffAdvocateId;
        }
        if (req.query.staffAdminId) {
            query.staffAdminId = req.query.staffAdminId;
        }
        if (req.query.export) {
            projects = await Project.find(query).populate("builderFirmId", { name: 1 }).populate("advocateFirmId", { name: 1 });
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            projects = await Project.find(query).populate("builderFirmId", { name: 1 }).populate("advocateFirmId", { name: 1 });
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            projects = await Project.find(query).populate("builderFirmId", { name: 1 }).populate("advocateFirmId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Project.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            projects = await Project.find(query).sort(sortObj).skip(skip).limit(limit).populate("builderFirmId", { name: 1 }).populate("advocateFirmId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                projects,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

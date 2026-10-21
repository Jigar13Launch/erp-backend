const FolderFile = require('../models/FolderFile.js')
const utils = require('../utils');
const noOfRecord = 10;
exports.updatefolderFile = async function (req, res) {
    try {
        await FolderFile.updateMany({ _id: { $in: req.body.folderFileIds } }, { private: req.body.private })
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.createfolderFile = async function (req, res) {
    try {
        let folderFile/*  = await FolderFile.findOne({ folderId: req.body.folderId});
        if (folderFile) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_FOLDERFILE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_FOLDERFILE_ALREADY_EXIST]
            });
        } */
        req.body.createdBy = req.headers['user']._id;
        folderFile = new FolderFile(req.body)
        if (req.files){
            for (let file of req.files) {
                var image_name = folderFile._id + utils.tokenGenerator(4);
                var url = utils.getImageFolderPath(req, 15) + folderFile.advocateFirmId + "/" + image_name + '.docx';
                folderFile.name = file.originalname;
                folderFile.url = url;
                utils.saveImageFromBrowser(file.path, image_name + '.docx', 15, null, folderFile.advocateFirmId);
            }
        }
        await folderFile.save()
        return res.json({
            success: true,
            data: {
                folderFile
            },
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getfolderFiles = async function (req, res) {
    try {
        let folderFiles = []
        let query = { };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.folderId && req.query.folderId != "null") {
            query.folderId = req.query.folderId;
        }else{
            if (req.query.filterAdvocateFirmId) {
                query.folderId = null;
            }
        }
        if (req.query.filterAdvocateFirmId){
            query.advocateFirmId = req.query.filterAdvocateFirmId;
            folderFiles = await FolderFile.find(query);
        }else{
            query.private = { $ne: true }
            folderFiles = await FolderFile.find(query).limit(20);
        }
        return res.json({
            success: true,
            data: {
                folderFiles,
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

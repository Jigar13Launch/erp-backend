const FolderFile = require('../models/FolderFile')
const utils = require('../utils');
const noOfRecord = 10;
exports.createfolderFile = async function (req, res) {
    try {
        let folderFile = await FolderFile.findOne({ folderId: req.body.folderId});
        if (folderFile) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_FOLDERFILE_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_FOLDERFILE_ALREADY_EXIST]
            });
        }
        folderFile = new FolderFile(req.body)
        for (let file of req.files) {
            var image_name = folderFile._id + utils.tokenGenerator(4);
            var url = utils.getImageFolderPath(req, 15) + folderFile.advocateFirmId + "/" + image_name + '.docx';
            folderFile.files.push({
                url: url,
                originalname: file.originalname,
            });
            folderFile.markModified('attachments');
            utils.saveImageFromBrowser(file.path, image_name + '.docx', 15, null, folderFile.advocateFirmId);
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
exports.updatefolderFile = async function (req, res) {
    try {
        let folderFile
        folderFile = await FolderFile.findOneAndUpdate({ _id: req.body.folderFileId }, req.body, { new: true })
        if (req.files){

        }
        if (req.files){
            
            for (let file of req.files) {
                var image_name = folderFile._id + utils.tokenGenerator(4);
                var url = utils.getImageFolderPath(req, 15) + folderFile.advocateFirmId + "/" + image_name + '.docx';
                folderFile.files.push({
                    url: url,
                    originalname: file.originalname,
                });
                utils.saveImageFromBrowser(file.path, image_name + '.docx', 15, null, folderFile.advocateFirmId);
            }
            folderFile.markModified('attachments');
        }
        await folderFile.save()
        return res.json({
            success: true,
            data: {
                folderFile
            },
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletefolder = async function (req, res) {
    try {
        let folderFile = await FolderFile.findOne({ _id: req.body.folderFileId });
        
        let index = folderFile.folders.findIndex((x) => String(x._id) == String(req.body.folderId));
        if (index != -1){
            folderFile.folders.splice(index,1)
            folderFile.markModified("folders");
            await folderFile.save();
        }
        folderFile = await FolderFile.findOne({ folderId: req.body.folderId });
        if (folderFile){
            await FolderFile.deleteOne({ _id: folderFile._id });
        }
        res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_DELETE_SUCCESSFULLY]
        });
        if (folderFile) {
            exports.removefiles(folderFile.files, folderFile.advocateFirmId)
            exports.removefolders(folderFile.folders, folderFile.advocateFirmId)
        }
        
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletefile = async function (req, res) {
    try {
        let folderFile = await FolderFile.findOne({ _id: req.body.folderFileId });
        
        let index = folderFile.files.findIndex((x) => String(x._id) == String(req.body.fileId));
        if (index != -1){
            utils.deleteImageFromFolder(folderFile.files[index].url, 15, folderFile.advocateFirmId)
            folderFile.files.splice(index,1)
            folderFile.markModified("folders");
            await folderFile.save();
        }
        res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_DELETE_SUCCESSFULLY]
        });
        
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.removefolders = async function (folders, advocateFirmId) {
    for (let folder of folders) {
        let folderFile = await FolderFile.findOne({ folderId: folder._id });
        await FolderFile.deleteOne({ folderId: folder._id });
        exports.removefolders(folderFile.folders, advocateFirmId)
        exports.removefiles(folderFile.files, advocateFirmId)
    }
}
exports.removefiles = async function (files, advocateFirmId) {
    for (let file of files) {
        utils.deleteImageFromFolder(file.url, 15,advocateFirmId)
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
            query.folderId = null;
        }
        if (req.query.folderFileId) {
            query._id = req.query.folderFileId
        }
        
        query.advocateFirmId = req.query.filterAdvocateFirmId;
        folderFiles = await FolderFile.findOne(query);
        if (!folderFiles){
            let folderFiles1 = await FolderFile.findOne({
                folderId: query.folderId,
                advocateFirmId: req.query.filterAdvocateFirmId,
            })
            if (!folderFiles1){
                folderFiles = await FolderFile.create({
                    folders:[],
                    files:[],
                    folderId: query.folderId,
                    advocateFirmId: req.query.filterAdvocateFirmId,
                })
            }
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

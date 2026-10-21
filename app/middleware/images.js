// let jwt = require('jwt-simple');
const User = require('../models/User')
const Firm = require('../models/AdvocateFirm')
const FolderFile = require('../models/FolderFile')
const AWS = require('aws-sdk');
const fs = require('fs')

module.exports = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.headers['userid'], status: true })

        if (!user) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_NOT_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_NOT_EXIST]
            });
        }
        if (!user.token || user.token != req.headers['token']) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
            });
        }
        let pathName = req.originalUrl;
        pathName = pathName.replace(/^\/+/, '');
        const fileName = pathName.split("/"); // Replace with your file's name/key in S3
        if (settings.isUseAwsBucket && req.originalUrl.includes("/folderfile/")) {
            AWS.config.update({ accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretKeyId });
            var s3 = new AWS.S3();
            const bucketName = settings.awsBucketName;

            if (["Advocate", "Advocate Staff"].includes(user.role) && user.advocateFirmId) {
                let folderFile = await FolderFile.findOne({ url: pathName })
                if (String(folderFile.advocateFirmId) != String(user.advocateFirmId)) {
                    let advocateFirm = await Firm.findOne({ _id: user.advocateFirmId })
                    if (settings.downloads <= advocateFirm.downloads) {
                        return res.json({
                            success: false,
                            error_code: process.env.ERROR_STRING_DOWNLOAD_LIMIT_REACH,
                            error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOWNLOAD_LIMIT_REACH]
                        });
                    }
                    await Firm.updateOne({ _id: user.advocateFirmId }, {
                        $inc: {
                            downloads: 1
                        }
                    })
                }
            } else if (["Admin", "Staff Admin"].includes(user.role)) {

            } else {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_DOWNLOAD_LIMIT_REACH,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOWNLOAD_LIMIT_REACH]
                });
            }
            const params = {
                Bucket: bucketName,
                Key: pathName
            };

            try {
                // Fetch file from S3
                const data = await s3.getObject(params).promise();

                // Set appropriate headers for file type and content
                res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
                res.setHeader('Content-Length', data.ContentLength);
                res.setHeader('Content-Disposition', `attachment; filename=${fileName[fileName.length - 1]}`);

                // Send the file content in the response
                res.send(data.Body); // data.Body is a Buffer
            } catch (err) {
                console.error(err);
                res.status(500).send('Error retrieving the file from S3');
            }

        } else {
            pathName = "uploads/" + pathName
            let file = await fs.readFileSync(pathName);
            res.setHeader('Content-Type', file.ContentType || 'application/octet-stream');
            // res.setHeader('Content-Length', data.ContentLength);
            res.setHeader('Content-Disposition', `attachment; filename=${fileName[fileName.length - 1]}`);
            // Send the file content in the response
            res.send(file); // data.Body is a Buffer
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
            error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
        });
    }

};
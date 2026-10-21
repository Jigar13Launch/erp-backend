const AWS = require('aws-sdk');
const fs = require('fs')

module.exports = async (req, res, next) => {
    try {
        let pathName = req.originalUrl;
        const fileName = pathName.split("/"); // Replace with your file's name/key in S3
        if (settings.isUseAwsBucket && req.originalUrl.includes("/folderfile/")) {
            AWS.config.update({ accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretKeyId });
            var s3 = new AWS.S3();
            const bucketName = settings.awsBucketName;

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
var cryptLib = require('cryptlib');
module.exports = async (req, res, next) => {
    try {
        
        if (process.env.ENCRYPTION == "true" && req.body.request) {
            req.body = decryptData(req.body.request)
        }
        if (process.env.ENCRYPTION == "true" && req.query.queryparams) {
            req.query = decryptData(req.query.queryparams)
        }
        next();
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            error_code: process.env.ERROR_STRING_USER_INVALID_TOKEN,
            error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_USER_INVALID_TOKEN]
        });
    }

};
function decryptData(encryptedBase64) {
    // Decode the Base64 string
    const encryptedData = Buffer.from(encryptedBase64, 'base64').toString('binary');

    // Convert the key and IV to binary
    const key = process.env.ENCRIPTION_KEY;
    const iv = process.env.ENCRIPTION_IV;

    // Decrypt the data
    const decryptedData = cryptLib.decrypt(
        encryptedData,
        key,
        iv
    );

    // Parse the decrypted data as JSON
    const decryptedJSON = JSON.parse(decryptedData);

    return decryptedJSON;
}
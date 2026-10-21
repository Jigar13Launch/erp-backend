let SuperCompany = require("../app/models/superCompany");
const utils = require('../app/utils');
const { encryptPassword, decryptPassword, createAuthToken } = require('../app/helper');

exports.find_super_company = async () => {
    try {
        let superCompany = await SuperCompany.findOne({});
        // console.log(superCompany);
        if (superCompany == null) {
            let superCompany_arr = [
                {
                    name: "SuperAdmin",
                    email: "superAdmin@gmail.com",
                    userName: "superAdmin",
                    password: encryptPassword("launch@712"),
                    // picture:"",
                    mobileNumber: 1234567890,
                    isDelete: false,
                    year: "2024-2025",
                    prefix: "LP",
                    role: "superAdmin"
                },
                {
                    name: "SubAdmin",
                    email: "subAdmin@gmail.com",
                    userName: "subAdmin",
                    password: encryptPassword("launch@712"),
                    // picture:"",
                    mobileNumber: 1234567890,
                    isDelete: false,
                    year: "2024-2025",
                    prefix: "LP",
                    role: "subAdmin"
                },
                {
                    name: "Admin",
                    email: "admin@gmail.com",
                    userName: "admin",
                    password: encryptPassword("launch@712"),
                    // picture:"",
                    mobileNumber: 1234567890,
                    isDelete: false,
                    year: "2024-2025",
                    prefix: "LP",
                    role: "admin"
                },
            ];
            for (let x of superCompany_arr) {
                // console.log(x)
                await SuperCompany.create(x);
            }
        }
    } catch (err) {
        // utils.catchErrorLog(error, req, res);
    }
}
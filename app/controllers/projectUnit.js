const ProjectUnit = require('../models/ProjectUnit')
const BuilderFirm = require('../models/BuilderFirm')
const AdvocateFirm = require('../models/AdvocateFirm')
const Project = require('../models/Project')
const User = require('../models/User')
const utils = require('../utils');
const whatsapp = require('../whatsapp');
const noOfRecord = 10;
const fs = require('fs');
const { parse } = require('csv-parse');
const crypto = require('crypto');
const email = require('../email');
exports.importprojectunit = async function (req, res) {
    try {
        let query = {};
        if (req.body.advocateFirmId) {
            query.advocateFirmId = req.body.advocateFirmId;
        }
        if (req.body.builderFirmId) {
            query.builderFirmId = req.body.builderFirmId;
        }
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        // Define a mapping object for renaming columns
        const columnMapping = {
            'Unit No': 'unit',
            'Block no/Name': 'block',
            'Floor No': 'floor',
            'Carpet Area': 'carpetArea',
            'Built Up Area': 'builtUpArea',
            'Super Built Up Area': 'superBuiltUpArea',
            'Undivided Land': 'undevidedLand',
            'Net Plot area': 'plotArea',
            'Total Plot area': 'totalPlotArea',
            'East Side': 'eastSide',
            'West Side': 'westSide',
            'North Side': 'northSide',
            'South Side': 'southSide',
            'Tarrace Area': 'tarraceArea',
            'Parking No': 'parkingNo',
            'Adjoining Land Area': 'adjoiningLandArea',
            'Balcony Area': 'balconyArea',
            'Wash Area': 'washArea',
            'Remark': 'remark',
        };
        const defaultValues = {
            'unit':"",
            'block':"",
            'floor':"",
            'carpetArea': 0,
            'builtUpArea': 0,
            'superBuiltUpArea': 0,
            'undevidedLand': 0,
            'plotArea': 0,
            'totalPlotArea': 0,
            'eastSide': 0,
            'westSide': 0,
            'northSide': 0,
            'southSide': 0,
            'tarraceArea': 0,
            'adjoiningLandArea': 0,
            'balconyArea': 0,
            'washArea': 0,
            'parkingNo': "",
            'remark': "",
        };
        const excelData = await utils.readExcelFile(req.files[0].path, columnMapping, defaultValues, project);
        let array = [];
        let projectUnit = await ProjectUnit.find({ projectId: req.body.projectId });
        let count = projectUnit.length;
        for (let unit of excelData){
            
            let index = projectUnit.findIndex((x) => String(x.unit) == unit.unit && String(x.block) == unit.block);
            if (index == -1){
                count++;
                if (project.noOfUnit >= count) {
                    array.push(ProjectUnit.updateOne({
                        projectId: req.body.projectId,
                        unit: unit.unit,
                        block: unit.block,
                        floor: unit.floor,
                    }, unit, { upsert: true }));
                }
            }else{
                unit.invoice = {
                    stempDutyPercentage: project.stampDuty,
                    stempDutyAmount: 0,
                    regFeePercentage: project.regPercentage,
                    regFeeExtra: project.regFixFee,
                    regFeeAmountMale: 0,
                    regFeeAmountFemale: 0,
                    GSTPercentage: project.GST,
                    GSTAmount: 0,
                    totalAmountMale: 0,
                    totalAmountFemale: 0,
                    receivedAmount: 0,
                    pendingAmount: 0,
                }
                array.push(ProjectUnit.updateOne({
                    projectId: req.body.projectId,
                    unit: unit.unit,
                    block: unit.block,
                    floor: unit.floor,
                }, unit, { upsert: true }));
            }
        }
        await Promise.all(array);
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_IMPORTED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_IMPORTED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getprojectunit = async function (req, res) {
    try {
        let projectunits = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { block: -1 };
        }
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        if (req.query.projectUnitId) {
            query._id = req.query.projectUnitId;
        }
        if (req.query.projectId) {
            query.projectId = req.query.projectId;
        }
        if (req.query.buyerId) {
            query["contactPersion.buyerId"] = req.query.buyerId;
        }
        if (req.query.advisorId) {
            query["referance.advisorId"] = req.query.advisorId;
        }
        if (req.query.builderId) {
            query.builderId = req.query.builderId;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.requestATS) {
            query.requestATS = req.query.requestATS.toLowerCase() == "true";
        }
        if (req.query.requestDOS) {
            query.requestDOS = req.query.requestDOS.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.searchValue) {
            query["$or"] = [
                { "contactPersion.name": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "contactPersion.email": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "contactPersion.phone": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.name": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.email": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.phone": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.occupation": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.panNo": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.religion": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "purchaser.aadharNo": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { unit: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { block: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { floor: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { parkingNo: { $regex: new RegExp(req.query.searchValue, 'i') } },
            ]
        }
        if (req.query.export) {
            projectunits = await ProjectUnit.find(query).populate("projectId", { name: 1 });
            const columnMapping = {
                'unit':'Unit No',
                'block':'Block no/Name',
                'floor':'Floor No',
                'carpetArea':'Carpet Area',
                'builtUpArea':'Built Up Area',
                'superBuiltUpArea':'Super Built Up Area',
                'undevidedLand':'Undivided Land',
                'plotArea':'Net Plot area',
                'totalPlotArea':'Total Plot area',
                'eastSide':'East Side',
                'westSide':'West Side',
                'northSide':'North Side',
                'southSide':'South Side',
                'tarraceArea':'Tarrace Area',
                'parkingNo':'Parking No',
                'adjoiningLandArea': 'Adjoining Land Area',
                'balconyArea': 'Balcony Area',
                'washArea': 'Wash Area',
            };
            utils.generateExcel({unit: "string", block: "string", floor: "string", carpetArea: "string", builtUpArea: "string", superBuiltUpArea: "string", undevidedLand: "string", plotArea: "string", totalPlotArea: "string", eastSide: "string", westSide: "string", southSide: "string", northSide: "string", tarraceArea: "string", parkingNo: "string", remark: "string", adjoiningLandArea: "string", balconyArea: "string", washArea: "string"}, projectunits, "projectunits.xlsx", req, res, columnMapping)
            return;
        } else if (req.query.pdf) {
            projectunits = await ProjectUnit.find(query).populate("projectId", { name: 1 });
            utils.generatePDF({ name: "name", unit: "string", block: "string", floor: "string", carpetArea: "string", builtUpArea: "string", superBuiltUpArea: "string", undevidedLand: "string", plotArea: "string", totalPlotArea: "string", eastSide: "string", westSide: "string", southSide: "string", northSide: "string", tarraceArea: "string", parkingNo: "string", remark: "string", adjoiningLandArea: "string", balconyArea: "string", washArea: "string" }, projectunits, "projectunits.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            projectunits = await ProjectUnit.find(query).populate("projectId", { name: 1, documents: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await ProjectUnit.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            projectunits = await ProjectUnit.find(query).sort(sortObj).skip(skip).limit(limit).populate("projectId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                projectunits,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.sendEmail = async function (req, res) {
    try {
        
        let attachments = [];
        for(let doc of req.body.documents){
            const docxBuf = fs.readFileSync('./uploads/' +doc.url);
            attachments.push({
                filename: doc.originalname,
                //content: await fs.createReadStream(req.files[0].path),
                content: docxBuf,
            })
        }
        email.templates(req, req.body.to, req.body.subject, req.body.body, attachments)
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_EMAIL_SEND_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EMAIL_SEND_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectbook = async function (req, res) {
    try {
        let query = {};
        if (req.body.advocateFirmId) {
            query.advocateFirmId = req.body.advocateFirmId;
        }
        if (req.body.builderFirmId) {
            query.builderFirmId = req.body.builderFirmId;
        }
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        let projectUnit = await ProjectUnit.findOneAndUpdate({ _id: req.body.projectUnitId, projectId: project._id }, {
            projectId: req.body.projectId,
            projectUnitId: req.body.projectUnitId,
            contactPersion: req.body.contactPersion,
            attendBy: req.body.attendBy,
            saleDeedAmount: req.body.saleDeedAmount,
            otherExpenses: req.body.otherExpenses,
            isReferance: req.body.isReferance,
            referance: req.body.referance,
            invoice: req.body.invoice,
            status: "Booked",
            bookedOn: new Date().toISOString(),
        }, { new: true })
        projectUnit.invoice.receivedAmount = 0;
        if (projectUnit.payment) {
            projectUnit.payment.forEach((element) => {
                projectUnit.invoice.receivedAmount += element.amount;
            });
        }
        if (projectUnit.isReferance && projectUnit.referance.phone){
            let user = await User.findOne({ phone: projectUnit.referance.phone });
            if (!user) {
                let hash = crypto.createHash('md5').update(req.body.password ? req.body.password : projectUnit.referance.phone).digest('hex');
                user = await User.create({
                    email: projectUnit.referance.email,
                    password: hash,
                    phone: projectUnit.referance.phone,
                    phoneCode: projectUnit.referance.phoneCode,
                    name: projectUnit.referance.name,
                    role: "Advisor",
                    portal: "Law",
                })
            }
            projectUnit.referance.advisorId = user._id
        }
        let user = await User.findOne({ phone: req.body.contactPersion.phone });
        if (!user) {
            let password = req.body.contactPersion.password ? req.body.contactPersion.password : req.body.contactPersion.phone;
            let hash = crypto.createHash('md5').update(password).digest('hex');
            user = await User.create({
                email: req.body.contactPersion.email,
                password: hash,
                phone: req.body.contactPersion.phone,
                phoneCode: req.body.contactPersion.phoneCode,
                name: req.body.contactPersion.name,
                role: "Buyer",
                portal: "Law",
            })
            let builderFirm = await BuilderFirm.findOne({ _id: project.builderFirmId })
            email.emailBooking(req, req.body.contactPersion.email, {
                password: password,
                builder: builderFirm.name,
                name: req.body.contactPersion.name,
                phoneCode: req.body.contactPersion.phoneCode,
                phone: req.body.contactPersion.phone,
                username: req.body.contactPersion.phoneCode + req.body.contactPersion.phone,
            })
        }
        projectUnit.contactPersion.buyerId = user._id
        projectUnit.invoice.receivedAmount = Number(projectUnit.invoice.receivedAmount.toFixed(0));
        projectUnit.invoice.pendingAmount = projectUnit.saleDeedAmount - projectUnit.invoice.receivedAmount;
        projectUnit.invoice.pendingAmount = Number(projectUnit.invoice.pendingAmount.toFixed(0));
        await projectUnit.save();
        whatsapp.bookNowToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, projectUnit.contactPersion._id)
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectexpense = async function (req, res) {
    try {
        let query = {};
        if (req.body.advocateFirmId) {
            query.advocateFirmId = req.body.advocateFirmId;
        }
        if (req.body.builderFirmId) {
            query.builderFirmId = req.body.builderFirmId;
        }
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        let projectUnit = await ProjectUnit.findOneAndUpdate({ _id: req.body.projectUnitId, projectId: project._id }, {
            projectId: req.body.projectId,
            projectUnitId: req.body.projectUnitId,
            paidExpenses: req.body.paidExpenses
        }, { new: true })
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectpurchaser = async function (req, res) {
    try {
        let query = {};
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        let projectUnit = await ProjectUnit.findOne({ _id: req.body.projectUnitId, projectId: project._id });
        if(req.body.deletePurchaserId){
            let index = projectUnit.purchaser.findIndex((x) => String(x._id) == req.body.deletePurchaserId)
            if (index > -1){
                projectUnit.purchaser.splice(index,1)
                projectUnit.markModified("purchaser");
                await projectUnit.save();
            }
        }else{
            if (req.body.purchaserId) {
                let index = projectUnit.purchaser.findIndex((x) => String(x._id) == req.body.purchaserId)
                if (index > -1) {
                    projectUnit.purchaser[index] = req.body;
                }else{
                    projectUnit.purchaser.push(req.body)
                }
            }else{
                projectUnit.purchaser.push(req.body)
                whatsapp.addPurchaserToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.body.name, req.headers.user.name, projectUnit.contactPersion._id)
            }
            projectUnit.markModified("purchaser");
            await projectUnit.save();
        }
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
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
        let projectUnit = await ProjectUnit.findOne({ _id: req.body.projectUnitId, projectId: project._id });
        for (let file of req.files) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(file.originalname)[1];
            var image_name = projectUnit._id;
            let docIndex
            let url
            if (req.body.documentId){
                docIndex = projectUnit.documents.findIndex((x)=>String(x._id) == req.body.documentId)
                url = utils.getImageFolderPath(req, 6) + image_name + (docIndex+1) + '.' + ext;
                utils.saveImageFromBrowser(file.path, image_name + (docIndex + 1) + '.' + ext, 6);
                projectUnit.documents[docIndex] = {
                    url: url,
                    type: req.body.type,
                    subType: req.body.subType,
                    uploadedAt:new Date(),
                    originalname: file.originalname,
                }
            }else{
                docIndex = projectUnit.documents.length
                url = utils.getImageFolderPath(req, 6) + image_name + docIndex+'.' + ext;
                utils.saveImageFromBrowser(file.path, image_name + docIndex + '.' + ext, 6);
                projectUnit.documents.push({
                    url: url,
                    type: req.body.type,
                    subType: req.body.subType,
                    uploadedAt: new Date(),
                    originalname: file.originalname,
                });
            }
            if (req.body.type == "Advocate"){
                let templateName = file.originalname.split(".")[0];
                if (req.body.subType == 1) {
                    templateName = "Agreement to Sale";
                    whatsapp.atsUploaToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.headers.user.name, projectUnit.contactPersion._id)
                } else if (req.body.subType == 2) {
                    templateName = "Sale Deed";
                    whatsapp.dosUploaToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.headers.user.name, projectUnit.contactPersion._id)
                }
                email.document(req, projectUnit.contactPersion.email, {
                    name: projectUnit.contactPersion.name,
                    template: file.originalname.split(".")[0],
                    unitNo: projectUnit.unit + "-" + projectUnit.block,
                    username: projectUnit.contactPersion.phoneCode + projectUnit.contactPersion.phone,
                })
            }
        }
        projectUnit.markModified("documents");
        await projectUnit.save();
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectunit = async function (req, res) {
    try {
        let projectUnit = await ProjectUnit.findOneAndUpdate({ _id: req.body.projectUnitId }, req.body, { new: true })
        let project = await Project.findOne({ _id: projectUnit.projectId })
        let builderFirm = await BuilderFirm.findOne({ _id: project.builderFirmId })
        let advocateFirm = await AdvocateFirm.findOne({ _id: project.advocateFirmId })
        if (req.body.requestATS) {
            whatsapp.newAtsRequestToAdvocate(advocateFirm.phoneCode, advocateFirm.phone, projectUnit, advocateFirm.name, req.headers.user.name, projectUnit.contactPersion.name, advocateFirm._id)
            email.builderRequest(req, advocateFirm.invoiceDetail?.email, {
                template: "ATS",
                unitNo: projectUnit.unit + "-" + projectUnit.block,
                builder: builderFirm.name,
            })
        }
        if (req.body.requestDOS) {
            whatsapp.newDosRequestToAdvocate(advocateFirm.phoneCode, advocateFirm.phone, projectUnit, advocateFirm.name, req.headers.user.name, projectUnit.contactPersion.name, advocateFirm_id)
            email.builderRequest(req, advocateFirm.invoiceDetail?.email, {
                template: "DOS",
                unitNo: projectUnit.unit + "-" + projectUnit.block,
                builder: builderFirm.name,
            })
        }
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updateprojectpayment = async function (req, res) {
    try {
        let query = {};
        query._id = req.body.projectId;
        let project = await Project.findOne(query);
        let projectUnit = await ProjectUnit.findOne({ _id: req.body.projectUnitId, projectId: project._id });
        if(req.body.deletePaymentId){
            let index = projectUnit.payment.findIndex((x) => String(x._id) == req.body.deletePaymentId)
            if (index > -1){
                projectUnit.payment.splice(index,1)
                projectUnit.markModified("payment");
                
            }
        }else{
           
            if (req.body.paymentId) {
                let index = projectUnit.payment.findIndex((x) => String(x._id) == req.body.paymentId)
                if (index > -1) {
                    projectUnit.payment[index] = req.body;
                }else{
                    projectUnit.payment.push(req.body)
                    projectUnit.markModified("payment");
                    whatsapp.addPaymentToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.body.amount, req.body.refNo, projectUnit.contactPersion._id)
                }
            }else{
                projectUnit.payment.push(req.body)
                projectUnit.markModified("payment");
                whatsapp.addPaymentToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.body.amount, req.body.refNo, projectUnit.contactPersion._id)
               /*  sms.builderPaymentReceipt(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone,{
                    builderFirmId: project.builderFirmId,
                    projectName: project.name,
                    amount: req.body.amount,
                    date: req.body.date,
                    transectionid: req.body.refNo,
                }, projectUnit.contactPersion.name) */
            }
        }
        projectUnit.invoice.receivedAmount = 0;
        if (projectUnit.payment) {
            projectUnit.payment.forEach((element) => {
                projectUnit.invoice.receivedAmount += element.amount;
            });
        }
        projectUnit.invoice.receivedAmount = Number(projectUnit.invoice.receivedAmount.toFixed(0));
        projectUnit.invoice.pendingAmount = projectUnit.saleDeedAmount - projectUnit.invoice.receivedAmount;
        projectUnit.invoice.pendingAmount = Number(projectUnit.invoice.pendingAmount.toFixed(0));
        await projectUnit.save();
        return res.json({
            success: true,
            data: {
                projectUnit
            },
            success_code: process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PROJECT_UNIT_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
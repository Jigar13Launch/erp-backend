const User = require('../models/User')
const TitleRequest = require('../models/TitleRequest')
const TitleRequestHistory = require('../models/TitleRequestHistory')
const AdvocateFirm = require('../models/AdvocateFirm')
const BankBranch = require('../models/BankBranch')
const Docxtemplater = require('docxtemplater');
const PizZip = require("pizzip");
const utils = require('../utils');
const whatsapp = require('../whatsapp');
const fs = require("fs");
const noOfRecord = 10;
const Razorpay = require('razorpay');
const successPaymentStatus = ["authorized", "captured"];
const successOrderStatus = ["paid"];
const Schema = require('mongoose').Types.ObjectId;

exports.paymentTitleCallback = async function (req, res) {
    try {
        let data = req.query;
        if (data.razorpay_order_id) {
            const instance = new Razorpay({
                key_id: settings.razorpayKeyId,
                key_secret: settings.razorpayKeySecret,
            });
            let order = await instance.orders.fetch(data.razorpay_order_id)
            let payment = await instance.payments.fetch(data.razorpay_payment_id);
            let generateDocument = await TitleRequest.findOne({ orderId: data.razorpay_order_id });
            if (payment) {
                generateDocument.paymentId = payment.id;
            }
            if (payment && successPaymentStatus.includes(payment.status) && generateDocument.status == 0) {
                generateDocument.status = 1;
            }
            if (order && successOrderStatus.includes(order.status) && generateDocument.status == 0) {
                generateDocument.status = 1;
            }
            /* if (generateDocument.lawyerFeeStatus == "Received") {
                utils.documentLogs(req, "Legal Fee Received", generateDocument._id)
            } */
            if (order && generateDocument.status == 1) {
                //sms.titlePaymentDone(generateDocument.customer.phoneCode, generateDocument.customer.phone, generateDocument, generateDocument.customer.name)
                let advocateFirm = await AdvocateFirm.findOne({ _id: generateDocument.advocateFirmId })
                let user = await User.findOne({ _id: generateDocument.requesterId })
                whatsapp.titleRequest(advocateFirm.phoneCode, advocateFirm.phone, generateDocument, user.name, advocateFirm._id)
            }
            await generateDocument.save();
        }
        return res.json({ success: true });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.paymentForTitle = async function (req, res) {
    try {
        let generateDocument = await TitleRequest.findOne({ _id: req.query.documentId });
        if (generateDocument && generateDocument.status > 0) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_PAYMENT_ALREADY_PAID,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PAYMENT_ALREADY_PAID]
            })
        } else if (!generateDocument) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_PAYMENT_ALREADY_PAID,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PAYMENT_ALREADY_PAID]
            })
        }
        let order
        let options
        let amount = generateDocument.applicantFees;
        const instance = new Razorpay({
            key_id: settings.razorpayKeyId,
            key_secret: settings.razorpayKeySecret,
        });
        if (!generateDocument.orderId) {
            order = await instance.orders.create({
                "amount": amount * 100,
                "currency": "INR",
                "receipt": generateDocument._id,
                "partial_payment": false
            })
            generateDocument.orderId = order.id;
            await generateDocument.save();
        } else {
            let alreadyPaid = false;
            order = await instance.orders.fetch(generateDocument.orderId)
            let paymentorder = await instance.orders.fetchPayments(generateDocument.orderId)
            if (paymentorder && paymentorder.items.length) {
                let paidentry = paymentorder.items.find((x) => successPaymentStatus.includes(x.status))
                if (paidentry) {
                    alreadyPaid = true;
                    generateDocument.paymentId = paidentry.id;
                }
            }
            if (order && successOrderStatus.includes(order.status)) {
                alreadyPaid = true;
            }
            if (alreadyPaid) {
                generateDocument.status = 1;
                await generateDocument.save();
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_PAYMENT_ALREADY_PAID,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PAYMENT_ALREADY_PAID]
                })
            }
        }
        options = {
            retry: {
                enabled: false
            },
            "key": settings.razorpayKeyId, // Enter the Key ID generated from the Dashboard
            "name": settings.company,
            "description": "Title Payment",
            "image": settings.apiUrl + "logo/logo-light-text.png",
            "callback_url": settings.apiUrl + "paymentCallback",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "prefill": {
                "name": generateDocument.customer.name,
                //"email": generateDocument.email,
                "contact": generateDocument.customer.phoneCode + generateDocument.customer.phone,
            },
            "notes": {
                "address": settings.address
            },
            "theme": {
                "color": settings.razorpayTheme
            }
        }
        res.json({
            success: true,
            data: {
                order,
                options,
                generateDocument
            }
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.createtitleRequest = async function (req, res) {
    try {
        /* let titleRequest = await TitleRequest.findOne({ name: req.body.name, requesterId: req.headers.userid });
        if (titleRequest) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_TITLEREQUEST_ALREADY_EXIST,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TITLEREQUEST_ALREADY_EXIST]
            });
        } */

        req.body.requesterId = req.headers.userid;

        if (req.headers['user'].drafterFirmId) {
            req.body.drafterFirmId = req.headers['user'].drafterFirmId
        }
        let branchDetail = await BankBranch.findOne({ _id: req.body.branchId }).populate("bankId")
        if (branchDetail) {
            req.body.cityId = branchDetail.cityId;
            req.body.districtId = branchDetail.districtId;
            req.body.stateId = branchDetail.stateId;
            req.body.bankId = branchDetail.bankId._id;
            req.body.applicantFees = branchDetail.bankId.titleAmount;
            req.body.lawyerFees = branchDetail.bankId.titleAmount * settings.advocateFee * 0.01;
            req.body.paidByBank = branchDetail.bankId.paidByBank;
        }
        if (req.body.applicantFees > 0 && !req.body.paidByBank) {
            req.body.status = 0;
            if (req.body.drafterFirmId){
                const DrafterFirm = require('../models/DrafterFirm');
                let drafterFirm = await DrafterFirm.findOne({ _id: req.body.drafterFirmId })
                if (drafterFirm.isLink == false){
                    req.body.status = 1;        
                }
            }
        } else {
            req.body.status = 1;
        }
        titleRequest = new TitleRequest(req.body)
        await titleRequest.save()
        if (titleRequest.status == 0){
            whatsapp.paymentLink(req.headers['user'].phoneCode, req.headers['user'].phone, titleRequest, req.headers['user'].name, req.headers['user']._id)
            whatsapp.paymentLink(titleRequest.customer.phoneCode, titleRequest.customer.phone, titleRequest, titleRequest.customer.name)
        }else{
            let advocateFirm = await AdvocateFirm.findOne({ _id: titleRequest.advocateFirmId })
            whatsapp.titleRequest(advocateFirm.phoneCode, advocateFirm.phone, titleRequest, req.headers['user'].name, advocateFirm._id)
        }
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.assignAdvocateRequest = async function (req, res) {
    try {
        let titleRequest = await TitleRequest.findOneAndUpdate({ _id: req.body.titleRequestId, reassign: false }, { reassign: true }).lean();
        titleRequest.advocateFirmId = req.body.advocateFirmId;
        titleRequest.isApproved = 0;
        delete titleRequest._id;
        delete titleRequest.createdAt;
        delete titleRequest.updatedAt;
        delete titleRequest.reassign;
        titleRequest = new TitleRequest(titleRequest);
        await titleRequest.save();
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.approveRejectRequest = async function (req, res) {
    try {
        let titleRequest = await TitleRequest.findOne({ _id: req.body.titleRequestId });
        titleRequest.isApproved = req.body.isApproved;
        await titleRequest.save();
        if (req.body.isApproved == 1){
            let user = await User.findOne({ _id: titleRequest.requesterId })
            whatsapp.titleRequestedAccepted(user.phoneCode, user.phone, titleRequest, user.name, user._id)
        } else if (req.body.isApproved == 2){
            let user = await User.findOne({ _id: titleRequest.requesterId })
            whatsapp.titleRequestedRejected(user.phoneCode, user.phone, titleRequest, user.name, user._id)
        }
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatetitleRequest = async function (req, res) {
    try {
        let titleRequest
        /* if (req.body.name) {
            titleRequest = await TitleRequest.findOne({ _id: { $ne: req.body.titleRequestId }, name: req.body.name, requesterId: req.headers.userid });
            if (titleRequest) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_TITLEREQUEST_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_TITLEREQUEST_ALREADY_EXIST]
                });
            }
        } */
        titleRequest = await TitleRequest.findOneAndUpdate({ _id: req.body.titleRequestId }, req.body, { new: true })
        if (req.body.status == 7) {
            for (let attachment of titleRequest.attachments) {
                utils.deleteImageFromFolder(attachment.url, 12)
            }
            titleRequest.attachments = [];
            titleRequest.completedAt = new Date();
            if (titleRequest.staffId) {
                let staff = await User.findOne({ _id: titleRequest.staffId })
                titleRequest.staffFees = staff.titleAmount ? staff.titleAmount : 0;
            }
            titleRequest.markModified('attachments');
            await titleRequest.save();
            if (titleRequest.staffId && titleRequest.staffFees && titleRequest.staffFees > 0) {
                utils.generateStaffInvoice(titleRequest)
            }
            if (titleRequest.lawyerFees && titleRequest.lawyerFees > 0){
                utils.generateInvoice(titleRequest)
            }
            if (titleRequest.applicantFees && titleRequest.applicantFees > 0){
                utils.generateBankInvoice(titleRequest)
                utils.generateDrafterTitleInvoice(titleRequest)
            }
            let advocateFirm = await AdvocateFirm.findOne({ _id: titleRequest.advocateFirmId })
            whatsapp.titleCompleteToAdvocate(advocateFirm.phoneCode, advocateFirm.phone, titleRequest, advocateFirm.name, advocateFirm._id)
            TitleRequestHistory.create(JSON.parse(JSON.stringify(titleRequest))).then((title) => { }).catch((error) => {
                console.log(error);
            });
        }
        if (req.body.status == 5) {
            let advocateFirm = await AdvocateFirm.findOne({ _id: titleRequest.advocateFirmId })
            whatsapp.titleDetailAddedByStaff(advocateFirm.phoneCode, advocateFirm.phone, titleRequest, advocateFirm.name, advocateFirm._id)
        }
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.uploadFinalSignDocuments = async function (req, res) {
    try {
        let titleRequest = await TitleRequest.findOne({ _id: req.body.titleRequestId })
        /*let ImageBytes
        console.log(req.files)
        if (req.body.showDraw && req.body.showDraw=="true"){
            ImageBytes = fs.readFileSync(req.files[0].path);
        }else{
            ImageBytes = fs.readFileSync('./uploads/'+req.headers['user'].signature);
        }*/
        const expressionParser = require("docxtemplater/expressions.js");
        const ImageModule = require('docxtemplater-image-module-free');
        let imageOptions = {}
        imageOptions.centered = false; //Set to true to always center images
        imageOptions.fileType = "docx"; //Or pptx
        imageOptions.getImage = function (tagValue, tagName) {
            return fs.readFileSync(tagValue, 'binary');
        }
        let data = {}
        if (req.body.showDraw && req.body.showDraw == "true") {
            data["SIGNATURE"] = req.files[0].path;
        } else {
            data["SIGNATURE"] = './uploads/' + req.headers['user'].signature;
        }
        imageOptions.getSize = function (img, tagValue, tagName) {
            return [150, 75];
        }
        let obj = {
            parser: expressionParser,
            linebreaks: true,
            paragraphLoop: true,
        }
        obj.modules = [new ImageModule(imageOptions)]
        let url = './uploads/' + titleRequest.titleDoc.url
        const content = fs.readFileSync(url, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, obj);
        doc.render(data);

        titleRequest.status = 6;
        titleRequest.titleDocPdf = {
            url: titleRequest.titleDoc.url.replace(".docx", '.pdf'),
            originalname: titleRequest.titleDoc.originalname.replace(".docx", '.pdf'),
        }
        let generatedContent = doc.getZip().generate({ type: 'nodebuffer' });
        setTimeout(() => {
            utils.docToPdfWithSignature(titleRequest, generatedContent);
        }, 1000);
        //utils.PdfWithSignature(titleRequest.titleDocPdf.url, ImageBytes)
        await titleRequest.save()
        let user = await User.findOne({ _id: titleRequest.requesterId });
        if (user) {
            whatsapp.advocateSignToRequester(user.phoneCode, user.phone, titleRequest, user.name, user_id)
        }
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.updatetitlestaff = async function (req, res) {
    try {
        let titleRequest
        titleRequest = await TitleRequest.findOneAndUpdate({ _id: req.body.titleRequestId }, { staffId: req.body.staffId ? req.body.staffId : null }, { new: true })
        if (req.body.staffId) {
            let user = await User.findOne({ _id: req.body.staffId })
            whatsapp.titleAssign(user.phoneCode, user.phone, titleRequest, user.name, user._id)
        }
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.createtitlequery = async function (req, res) {
    try {
        let titleRequest = await TitleRequest.findOne({ _id: req.body.titleRequestId })
        if (req.body.query) {
            let index = titleRequest.query.findIndex((x) => String(x._id) == req.body.query._id)
            if (index == -1) {
                titleRequest.query.push(req.body.query)
                if (req.body.query.isApproved && req.body.query.role == "Advocate"){
                    let user = await User.findOne({ _id: titleRequest.requesterId });
                    if (user){
                        whatsapp.queryRequestAdvocateToRequester(user.phoneCode, user.phone, titleRequest, user.name, req.body.query.message, user._id)
                    }
                }
            } else {
                req.body.query.createdAt = titleRequest.query[index].createdAt;
                req.body.query._id = titleRequest.query[index]._id;
                titleRequest.query[index] = req.body.query;
                if (titleRequest.query[index].isApproved && titleRequest.query[index].role == "Advocate" && titleRequest.query[index].status == 0) {
                    let user = await User.findOne({ _id: titleRequest.requesterId });
                    if (user) {
                        whatsapp.queryRequestAdvocateToRequester(user.phoneCode, user.phone, titleRequest, user.name, titleRequest.query[index].message, user._id)
                    }
                } else if (titleRequest.query[index].isApproved && titleRequest.query[index].role == "Advocate" && titleRequest.query[index].status == 1) {
                    let user = await User.findOne({ _id: titleRequest.query[index].raisedBy });
                    if (user) {
                        whatsapp.queryResolveAdvocateToRequester(user.phoneCode, user.phone, titleRequest, user.name, titleRequest.query[index].message, user._id)
                    }
                } else if (titleRequest.query[index].isApproved && titleRequest.query[index].role == "Requester" && titleRequest.query[index].status == 0) {
                    let user = await User.findOne({ _id: titleRequest.query[index].raisedBy });
                    if (user) {
                        whatsapp.queryRequestRequesterToAdvocate(user.phoneCode, user.phone, titleRequest, user.name, titleRequest.query[index].message, user._id)
                    }
                } else if (titleRequest.query[index].isApproved && titleRequest.query[index].role == "Requester" && titleRequest.query[index].status == 1) {
                    let user = await User.findOne({ _id: titleRequest.requesterId });
                    if (user) {
                        whatsapp.queryResolveRequesterToAdvocate(user.phoneCode, user.phone, titleRequest, user.name, titleRequest.query[index].message, user._id)
                    }
                }
            }
        }
        if (req.body.deletedQueryId) {
            let index = titleRequest.query.findIndex((x) => String(x._id) == req.body.query._id)
            if (index != -1) {
                titleRequest.query.splice(index, 1)
            }
        }
        let index = titleRequest.query.findIndex((x) => x.status == 0)
        if (index > -1) {
            if (titleRequest.query[index].role == "Requester") {
                titleRequest.queryStatus = 1;
            } else {
                if (titleRequest.query[index].isApproved) {
                    titleRequest.queryStatus = 2;
                } else {
                    titleRequest.queryStatus = 3;
                }
            }
        } else {
            titleRequest.queryStatus = 0;
        }
        titleRequest.markModified('query');
        await titleRequest.save();
        return res.json({
            success: true,
            data: {
                titleRequest
            },
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_UPDATED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.uploadDocuments = async function (req, res) {
    try {
        let titleRequestId = await TitleRequest.findOne({ _id: req.body.titleRequestId });
        if (req.files && req.files.length > 0) {

            for (let file of req.files) {
                const re = /(?:\.([^.]+))?$/;
                let ext = re.exec(file.originalname)[1];
                var image_name = titleRequestId._id + utils.tokenGenerator(4) + "." + ext;
                var url = utils.getImageFolderPath(req, 12) + image_name;
                titleRequestId.attachments.push({
                    url: url,
                    originalname: file.originalname,
                    uploadedAt: new Date()
                });
                utils.saveImageFromBrowser(file.path, image_name, 12);
            }
        }
        titleRequestId.markModified('attachments');
        //await GenerateDocument.findOneAndUpdate({ _id: req.body.titleRequestIdId }, { keyDocuments });
        await titleRequestId.save();

        res.json({
            success: true
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.removeFinalDocuments = async function (req, res) {
    try {
        let titleRequestId = await TitleRequest.findOne({ _id: req.body.titleRequestId });
        if (titleRequestId[req.body.name]){
            utils.deleteImageFromFolder(titleRequestId[req.body.name].url, 12)
        }
        titleRequestId.status = 4;
        titleRequestId[req.body.name] = null;
        titleRequestId.save();
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_FOLDERFILE_DELETED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_FOLDERFILE_DELETED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.uploadFinalDocuments = async function (req, res) {
    try {
        let titleRequestId = await TitleRequest.findOne({ _id: req.body.titleRequestId });
        if (req.files && req.files.length > 0) {

            for (let file of req.files) {
                const re = /(?:\.([^.]+))?$/;
                let ext = re.exec(file.originalname)[1];
                if (file.fieldname == "titleDoc") {

                    var image_name = titleRequestId._id + "." + ext;
                    var url = utils.getImageFolderPath(req, 12) + image_name;
                    titleRequestId.titleDoc = {
                        url: url,
                        originalname: file.originalname,
                    };
                } else {

                    var image_name = titleRequestId._id + "-" + file.fieldname +"." + ext;
                    var url = utils.getImageFolderPath(req, 12) + image_name;
                    titleRequestId[file.fieldname] = {
                        url: url,
                        originalname: file.originalname,
                    };
                }
                utils.saveImageFromBrowser(file.path, image_name, 12);
            }
        }
        if (titleRequestId.titleDoc) {
            if ("Advocate" == req.headers.user.role) {
                titleRequestId.status = 4;
            } else {
                titleRequestId.status = 3;
            }
        }
        titleRequestId.documentRequiredForCreationofMorgage = req.body.documentRequiredForCreationofMorgage;
        titleRequestId.propertyDescription = req.body.propertyDescription;
        titleRequestId.registrarOfficeId = req.body.registrarOfficeId;
        titleRequestId.propertyBoundedBy = req.body.propertyBoundedBy;
        titleRequestId.ownerName = req.body.ownerName;
        //await GenerateDocument.findOneAndUpdate({ _id: req.body.titleRequestIdId }, { keyDocuments });
        await titleRequestId.save();
        res.json({
            success: true
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletelawtitle = async function (req, res) {
    try {
        await TitleRequest.findOneAndUpdate({ _id: req.body.deleteId }, { status: false, isDelete: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_TITLEREQUEST_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_TITLEREQUEST_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.removeDocuments = async function (req, res) {
    try {
        let titleRequestId = await TitleRequest.findOne({ _id: req.body.titleRequestId });
        let index = titleRequestId.attachments.findIndex((x) => x.url == req.body.url)
        if (index != -1) {
            utils.deleteImageFromFolder(req.body.url, 12)
            titleRequestId.attachments.splice(index, 1);
        }
        titleRequestId.markModified('attachments');
        //await GenerateDocument.findOneAndUpdate({ _id: req.body.titleRequestIdId }, { keyDocuments });
        await titleRequestId.save();

        res.json({
            success: true
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.gettitlerequests = async function (req, res) {
    try {
        let titlerequests = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let querySub = {};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        
        if (req.query.titleRequestId) {
            query._id = req.query.titleRequestId;
        }
        
        
        if (req.query.advocateId) {
            querySub.advocateId = req.query.advocateId
        }
        if (req.query.staffId) {
            querySub.staffId = req.query.staffId
        }
        if (req.query.stateId) {
            querySub.stateId = req.query.stateId
        }
        if (req.query.cityId) {
            querySub.cityId = req.query.cityId
        }
        if (req.query.districtId) {
            querySub.districtId = req.query.districtId
        }
        if (req.query.advocateFirmId) {
            querySub.advocateFirmId = req.query.advocateFirmId
        }
        if (req.query.drafterFirmId) {
            querySub.drafterFirmId = req.query.drafterFirmId
        }
        if (req.query.bankId) {
            querySub.bankId = req.query.bankId
        }
        if (req.query.queryStatus) {
            query.queryStatus = { $ne: 0 }
        }
        if (req.query.isApproved) {
            query.isApproved = Number(req.query.isApproved)
        }
        if (req.query.status) {
            query.status = { $eq: Number(req.query.status) };
        } else {
            if (['Advocate', 'Advocate Staff'].includes(req.headers['user'].role)) {
                query.status = { $gt: 0 }
            }
        }
        if (!req.query.history) {
            if (query.completedStatus) {
                query.status.$ne = 7
            } else {
                query.status = { $ne: 7 }
            }
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (["Drafter Operational Head", "Operational Head"].includes(req.headers['user'].role)) {
            query.requesterId =  req.headers['user']._id;
        }
        query["$and"] = [];
        query["$and"].push({
            "$or": [querySub, { requesterId: req.headers['user']._id }]
        })
        
        if (req.query.searchValue) {
            query["$and"].push({
                $or: [
                    { name: { $regex: new RegExp(req.query.searchValue, 'i') } },
                    { applicationNo: { $regex: new RegExp(req.query.searchValue, 'i') } },
                    { propertyDescription: { $regex: new RegExp(req.query.searchValue, 'i') } },
                    { "titleDoc.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
                    { "titleDocPdf.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
                    { "titleDocSearch.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
                ]
            })
        }
        let Table = TitleRequest;
        if(req.query.history){
            Table = TitleRequestHistory;
        }
        if (req.query.export) {
            titlerequests = await Table.find(query).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
            utils.generateExcel({ name: "string", "districtId_name": "string", "stateId_name": "string", "countryId_name": "string" }, titlerequests, "titlerequests.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            titlerequests = await Table.find(query).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
            utils.generatePDF({ name: "string", "districtId_name": "string", "stateId_name": "string", "countryId_name": "string" }, titlerequests, "titlerequests.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            titlerequests = await Table.find(query).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Table.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            titlerequests = await Table.find(query).sort(sortObj).skip(skip).limit(limit).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
        }
        return res.json({
            success: true,
            data: {
                titlerequests,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getpublictitlerequests = async function (req, res) {
    try {
        let titlerequests = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = {};
        let querySub = {};
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.searchValue) {
            query["$or"] = [
                { propertyDescription: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "titleDoc.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "titleDocPdf.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
                { "titleDocSearch.originalname": { $regex: new RegExp(req.query.searchValue, 'i') } },
            ]
        }
        if (req.query.cityId) {
            query.cityId = req.query.cityId
        }
        if (req.query.titleRequestId) {
            query._id = req.query.titleRequestId;
        }
        query.status = 7;
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }

        page = req.query.page;
        let skip = (page - 1) * limit;
        /* if (totalPage) {
            totalPage = Math.ceil(totalPage / limit);
            } */
        let Table = TitleRequest;
        if (req.query.history) {
            Table = TitleRequestHistory;
        }
        if (page) {
            totalPage = await Table.countDocuments(query);
            titlerequests = await Table.find(query).sort(sortObj).skip(skip).limit(limit).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
        } else {
            titlerequests = await Table.find(query).sort(sortObj).populate("advocateFirmId", "name").populate("bankId", "name").populate("branchId", "name").populate("query.raisedBy", "name picture role").populate("requesterId", "name").populate("staffId", "name");
        }
        return res.json({
            success: true,
            data: {
                titlerequests,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.gettitlefees = async function (req, res) {
    try {
        let match = { isDelete: { $ne: true } };

        if (req.query.startDate && req.query.endDate) {
            match.createdAt = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        } else if (req.query.startDate) {
            match.createdAt = { $gte: new Date(req.query.startDate) };
        } else if (req.query.endDate) {
            match.createdAt = { $lte: new Date(req.query.endDate) };
        }

        let group = { advocateFirmId: "$advocateFirmId", bankId: "$bankId" };
        let joins = [];
        if (req.headers.user.role == "Admin" || req.headers.user.role == "Staff Admin") {

            joins.push({
                $lookup: {
                    from: 'advocatefirms',
                    let: {
                        advocateFirmId: "$_id.advocateFirmId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$advocateFirmId"]
                                }]
                            }
                        }
                    }, {
                        $project: {
                            name: 1
                        }
                    }],
                    as: 'detail1'
                }
            })
            joins.push({
                $unwind: {
                    path: "$detail1",
                    preserveNullAndEmptyArrays: true
                }
            })
            joins.push({
                $lookup: {
                    from: 'banks',
                    let: {
                        bankId: "$_id.bankId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$bankId"]
                                }]
                            }
                        }
                    }, {
                        $project: {
                            name: 1
                        }
                    }],
                    as: 'detail2'
                }
            })
            joins.push({
                $unwind: {
                    path: "$detail2",
                    preserveNullAndEmptyArrays: true
                }
            })
        } else if (req.headers.user.role == "Advocate" || req.headers.user.role == "Advocate Staff") {
            match.advocateFirmId = new Schema(req.query.advocateFirmId);
            if (req.headers.user.role == "Advocate Staff") {
                match.staffId = req.headers['user']._id;
            }
            group = { bankId: "$bankId" };
            joins.push({
                $lookup: {
                    from: 'banks',
                    let: {
                        bankId: "$_id.bankId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$bankId"]
                                }]
                            }
                        }
                    }, {
                        $project: {
                            name: 1
                        }
                    }],
                    as: 'detail1'
                }
            })
            joins.push({
                $unwind: {
                    path: "$detail1",
                    preserveNullAndEmptyArrays: true
                }
            })
        } else {
            match.requesterId = req.headers['user']._id;
            group = { advocateFirmId: "$advocateFirmId" };
            joins.push({
                $lookup: {
                    from: 'advocatefirms',
                    let: {
                        advocateFirmId: "$_id.advocateFirmId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$advocateFirmId"]
                                }]
                            }
                        }
                    }, {
                        $project: {
                            name: 1
                        }
                    }],
                    as: 'detail1'
                }
            })
            joins.push({
                $unwind: {
                    path: "$detail1",
                    preserveNullAndEmptyArrays: true
                }
            })

        }
        let query = [{
            $match: match
        }, {
            $group: {
                _id: group,
                requestedCount: { $sum: { $cond: [{ $and: [{ $eq: ["$status", 0] }, { $eq: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                paymentDoneCount: { $sum: { $cond: [{ $and: [{ $eq: ["$status", 1] }, { $eq: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                signPendingCount: { $sum: { $cond: [{ $and: [{ $eq: ["$status", 4] }, { $eq: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                signDoneCount: { $sum: { $cond: [{ $and: [{ $eq: ["$status", 6] }, { $eq: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                completedCount: { $sum: { $cond: [{ $and: [{ $eq: ["$status", 7] }, { $eq: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                queryCount: { $sum: { $cond: [{ $and: [{ $ne: ["$queryStatus", 0] }, { $eq: ["$isApproved", 1] }] }, 1, 0] } },
                rejectCount: { $sum: { $cond: [{ $and: [{ $eq: ["$isApproved", 2] }] }, 1, 0] } },
                toBeAssignCount: { $sum: { $cond: [{ $and: [{ $eq: ["$isApproved", 0] }] }, 1, 0] } },
                counts: { $sum: 1 },
                lawyerFees: { $sum: "$lawyerFees" },
                applicantFees: { $sum: "$applicantFees" },
                staffFees: { $sum: "$staffFees" },
            }
        }];
        if (joins.length) {
            query.push(...joins)
        }
        let total = await TitleRequest.aggregate(query);
        total = JSON.parse(JSON.stringify(total));

        let summery = {
            requestedCount: 0,
            paymentDoneCount: 0,
            signPendingCount: 0,
            signDoneCount: 0,
            completedCount: 0,
            rejectCount: 0,
            queryCount: 0,
            toBeAssignCount: 0,
            counts: 0,
            lawyerFees: 0,
            applicantFees: 0,
            staffFees: 0,
        }
        for (let item of total) {
            item.entity = "";
            if (item.detail1) {
                item.entity += item.detail1.name;
            }
            if (item.detail2) {
                item.entity += "-" + item.detail2.name;
            }
            if (item.detail3) {
                item.entity += "-" + item.detail3.name;
            }
            Object.keys(summery).forEach((key) => {
                summery[key] += item[key]
            })
        }
        total = total.sort((a, b) => {
            const brandA = a.entity.toUpperCase(); // ignore upper and lowercase
            const brandB = b.entity.toUpperCase(); // ignore upper and lowercase

            if (brandA < brandB) {
                return -1;
            }
            if (brandA > brandB) {
                return 1;
            }
            return 0;
        });
        res.json({
            success: true,
            data: {
                total,
                summery
            },
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
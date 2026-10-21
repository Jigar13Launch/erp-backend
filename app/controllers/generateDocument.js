const Docxtemplater = require('docxtemplater');
const PizZip = require("pizzip");
const Template = require('../models/Template')
const Project = require('../models/Project')
const ProjectUnit = require('../models/ProjectUnit')
const BankBranch = require('../models/BankBranch')
const GenerateDocument = require('../models/GenerateDocument')
const GenerateDocumentHistory = require('../models/GenerateDocumentHistory')
const User = require('../models/User')
const DrafterFirm = require('../models/DrafterFirm')
const TemplateKeys = require('../models/TemplateKeys')
const RegistrationBoy = require('../models/RegistrationBoy')
const email = require('../email');
const Schema = require('mongoose').Types.ObjectId;
const utils = require('../utils');
const whatsapp = require('../whatsapp');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const DocumentLogsScema = require('../models/DocumentLogs');
const noOfRecord = 10;
const Razorpay = require('razorpay');
const successPaymentStatus = ["authorized", "captured"];
const successOrderStatus = ["paid"];
exports.paymentCallback = async function (req, res) {
    try {
        let data = req.query;
        if (data.razorpay_order_id){
            const instance = new Razorpay({
                key_id: settings.razorpayKeyId,
                key_secret: settings.razorpayKeySecret,
            });
            let order = await instance.orders.fetch(data.razorpay_order_id)
            let payment = await instance.payments.fetch(data.razorpay_payment_id);
            let generateDocument = await GenerateDocument.findOne({ orderId: data.razorpay_order_id }).populate("categoryId", { name: 1 });
            if(payment){
                generateDocument.paymentId = payment.id;
            }
            if (payment && successPaymentStatus.includes(payment.status)){
                generateDocument.lawyerFeeStatus = "Received";
            }
            if (order && successOrderStatus.includes(order.status)){
                generateDocument.lawyerFeeStatus = "Received";
            }
            if (generateDocument.lawyerFeeStatus == "Received"){
                utils.documentLogs(req, "Legal Fee Received", generateDocument._id)
            }
            if (generateDocument.portal == "Bank" /* && generateDocument.isDraft == false */ && generateDocument.lawyerFeeStatus == "Received") {
                // sms.paymentDone(generateDocument.customerPhoneCode, generateDocument.customerPhone, generateDocument)
                whatsapp.paymentConfirmationToCustomer(generateDocument.customerPhoneCode, generateDocument.customerPhone, generateDocument, generateDocument.customerName)
            }
           
            await generateDocument.save();
            if (generateDocument && generateDocument.drafterFees && generateDocument.drafterFees > 0){
                utils.generateDrafterInvoice(generateDocument)
            }
        }
        
        return res.json({success:true});
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.paymentForDocument = async function (req, res) {
    try {
        let generateDocument = await GenerateDocument.findOne({ _id: req.query.documentId }).populate("categoryId", { name: 1 });
        if (generateDocument && generateDocument.lawyerFeeStatus == "Received"){
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_PAYMENT_ALREADY_PAID,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PAYMENT_ALREADY_PAID]
            })
        } else if (!generateDocument){
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_PAYMENT_ALREADY_PAID,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_PAYMENT_ALREADY_PAID]
            })
        }
        let order
        let options
        let amount = generateDocument.lawyerFees;
        const instance = new Razorpay({
            key_id: settings.razorpayKeyId,
            key_secret: settings.razorpayKeySecret,
        });
        if (!generateDocument.orderId){
            order = await instance.orders.create({
                "amount": amount * 100,
                "currency": "INR",
                "receipt": generateDocument._id,
                "partial_payment": false
            })
            generateDocument.orderId = order.id;
            await generateDocument.save();
        }else{
            let alreadyPaid = false;
            order = await instance.orders.fetch(generateDocument.orderId)
            let paymentorder = await instance.orders.fetchPayments(generateDocument.orderId)
            if (paymentorder && paymentorder.items.length){
                let paidentry = paymentorder.items.find((x) => successPaymentStatus.includes(x.status))
                if (paidentry){
                    alreadyPaid = true;
                    generateDocument.paymentId = paidentry.id;
                }
            }
            if (order && successOrderStatus.includes(order.status)) {
                alreadyPaid = true;
            }
            if (alreadyPaid){
                generateDocument.lawyerFeeStatus = "Received";
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
            "description": generateDocument.categoryId.name,
            "image": settings.apiUrl + "logo/logo-light-text.png",
            "callback_url": settings.apiUrl + "paymentCallback",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "prefill": {
                "name": generateDocument.customerName,
                //"email": generateDocument.email,
                "contact": generateDocument.customerPhoneCode + generateDocument.customerPhone,
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
exports.generatedocumentvariables = async function (req, res) {
    try {
        let template = await Template.findOne({ _id: req.query.templateId, isDelete: { $ne: true } });

        let variables = template.variables
        variables = [...new Set(variables)];
        let templateKeys = await TemplateKeys.find({ name: { $in: variables }, isDelete: { $ne: true } }).lean();
        const moment_timezone = require('moment-timezone');
        const timezone = "Asia/Calcutta";
        for (let templateKey of templateKeys) {
            
            if (templateKey.speciality == "date") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("DD.MM.YYYY")
                
            } else if (templateKey.speciality == "year") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("YYYY")
            } else if (templateKey.speciality == "dayname") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("dddd")
            } else if (templateKey.speciality == "day") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("dd")
            } else if (templateKey.speciality == "monthname") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("MMMM")
            } else if (templateKey.speciality == "month") {
                templateKey.defaultValue = moment_timezone().tz(timezone).format("MM")
            }
        }
        
        let newArray = [];
        variables.forEach((variable) => {
            let index = templateKeys.findIndex((x) => x.name == variable);
            if (index == -1) {
                let autoVarible = template.variablesWithType.find((x) => x.name == variable)
                if (autoVarible) {
                    newArray.push(autoVarible)
                }
            } else {
                let obj = templateKeys[index];
                let autoVarible = template.variablesWithType.find((x) => x.name == variable)
                if (autoVarible.defaultValue){
                    obj.defaultValue = autoVarible.defaultValue;
                }
                obj.description = autoVarible.description;
                newArray.push(obj)
            }
        })
        
        res.json({
            success: true,
            data: {
                templateKey: newArray
            }
        })

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.keyDocuments = async function (req, res) {
    try {
        let generateDocument = await GenerateDocument.findOne({ _id: req.body.generateDocumentId });
        if (req.files && req.files.length > 0) {
            if (!generateDocument.keyDocuments) {
                generateDocument.keyDocuments = {};
            }
            if (!generateDocument.keyDocuments[req.body.name]) {
                generateDocument.keyDocuments[req.body.name] = {};
            }
            if (!generateDocument.keyDocuments[req.body.name][req.body.index]) {
                generateDocument.keyDocuments[req.body.name][req.body.index] = [];
            }
            for (let file of req.files) {
                var image_name = generateDocument._id + req.body.name + file.originalname;
                var url = utils.getImageFolderPath(req, 10) + image_name;
                generateDocument.keyDocuments[req.body.name][req.body.index].push({
                    url: url,
                    originalname: file.originalname,
                });
                utils.saveImageFromBrowser(file.path, image_name, 10);
            
            }
        }
        generateDocument.markModified('keyDocuments');
        //await GenerateDocument.findOneAndUpdate({ _id: req.body.generateDocumentId }, { keyDocuments });
        await generateDocument.save();
        if (req.body.last){
            await exports.regenerateDocumentWithFiles(req, res, generateDocument._id)
        }
        res.json({
            success: true
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.posubmit = async function (req, res) {
    try {
        let generateDocument = await GenerateDocument.findOne({ _id: req.body.documentId });
        if (!generateDocument) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_DOCUMENT_NOT_FOUND,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND]
            })
        }
        let registrationBoy = await RegistrationBoy.findOne({ _id: generateDocument.registrationBoyId, phone: req.body.phone, phoneCode: req.body.phoneCode })
        if (!registrationBoy){
            return res.json({
                success: false,
                error_code: process.env.ERROR_STRING_DOCUMENT_NOT_FOUND,
                error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND]
            })
        }
        if (req.body.poNumber){
            generateDocument.poNumber = req.body.poNumber;
        }
        if (req.files && req.files.length > 0) {
            
            for (let file of req.files) {
                var re = /(?:\.([^.]+))?$/;
                var ext = "." +re.exec(file.originalname)[1]; 
                var image_name = generateDocument._id;
                var url = utils.getImageFolderPath(req, 11) + image_name + ext;
                generateDocument.poFile ={
                    url: url,
                    originalname: file.originalname,
                };
                utils.saveImageFromBrowser(file.path, image_name + ext, 11);
            
            }
        }
        /* sms.poLinkSubmit(generateDocument.customerPhoneCode, generateDocument.customerPhone, generateDocument, generateDocument.customerName)
        let generatedBy = await User.findOne({ _id: generateDocument.generatedById })
        if (generatedBy){
            sms.poLinkSubmitRequester(generatedBy.phoneCode, generatedBy.phone, generateDocument, generatedBy.name)
        } */
        utils.documentLogs(req, "PO Detail", generateDocument._id)
        await generateDocument.save();
        res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_GENERATED_PO_NUMBER_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_GENERATED_PO_NUMBER_ADDED_SUCCESSFULLY]
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.generatedocumentupdate = async function (req, res) {
    try {
        let generateDocument = await GenerateDocument.findOne({ _id: req.body.generateDocumentId });
        if (req.body.registrationBoyId) {
            generateDocument.registrationBoyId = req.body.registrationBoyId;
        }
        if (req.files && req.files.length > 0) {
            if (!generateDocument.registrarDocument){
                generateDocument.registrarDocument = {};
            }
            for (let file of req.files){
                if (file && file.fieldname == "doc1"){
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(file.originalname)[1]; 
                    var image_name = generateDocument._id;
                    var url = utils.getImageFolderPath(req, 3) + image_name + '1.' + ext;
                    generateDocument.registrarDocument[file.fieldname] = {
                        url: url,
                        originalname: file.originalname,
                    };
                    utils.saveImageFromBrowser(file.path, image_name + '1.' + ext, 3);
                    
                }
                if (file && file.fieldname == "doc2") {
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(file.originalname)[1];
                    var image_name = generateDocument._id;
                    var url = utils.getImageFolderPath(req, 4) + image_name + '2.' + ext;
                    generateDocument.registrarDocument[file.fieldname] = {
                        url: url,
                        originalname: file.originalname,
                    };
                    utils.saveImageFromBrowser(file.path, image_name + '2.' + ext, 4);
                   
                }
                if (file && file.fieldname == "doc3") {
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(file.originalname)[1];
                    var image_name = generateDocument._id;
                    var url = utils.getImageFolderPath(req, 5) + image_name + '3.' + ext;
                    generateDocument.registrarDocument[file.fieldname] = {
                        url: url,
                        originalname: file.originalname,
                    };
                    utils.saveImageFromBrowser(file.path, image_name + '3.' + ext, 5);
                   
                }
            }
        }
        if (req.body.appointmentDate){
            generateDocument.appointmentDate = new Date(req.body.appointmentDate);
            utils.documentLogs(req, "Regestation Detail", generateDocument._id)
            let user = await User.findOne({ _id: generateDocument.generatedById })
            if (user){
                whatsapp.registrationDetailAddedToRequester(user.phoneCode, user.phone, generateDocument, user.name, user._id)
            }else{
                console.error("requester not found ", generateDocument._id)
            }
            if (generateDocument.registrationBoyId) {
                let user = await RegistrationBoy.findOne({ _id: generateDocument.registrationBoyId })
                whatsapp.registrationDetailAddedToBoy(user.phoneCode, user.phone, generateDocument, user.name, user._id)
            }
            whatsapp.registrationDetailAddedToCustomer(generateDocument.customerPhoneCode, generateDocument.customerPhone, generateDocument, generateDocument.customerName)
        }else{
            utils.documentLogs(req, "Status Change", generateDocument._id)
        } 
        
        if (req.body.stampDutyPaymentStatus){
            generateDocument.stampDutyPaymentStatus = req.body.stampDutyPaymentStatus;
        }
        if (req.body.regFeePaymentStatus){
            generateDocument.regFeePaymentStatus = req.body.regFeePaymentStatus;
        }
        if (req.body.poNumber){
            generateDocument.poNumber = req.body.poNumber;
        }
        if (req.body.stampDuty){
            if (!generateDocument.links){
                generateDocument.links = {};
            }
            generateDocument.links.stampDuty = req.body.stampDuty;
        }
        if (req.body.registrationFee){
            if (!generateDocument.links){
                generateDocument.links = {};
            }
            generateDocument.links.registrationFee = req.body.registrationFee;
        }
        if (req.body.completedStatus) {
            generateDocument.completedStatus = req.body.completedStatus;
            if (req.body.completedStatus == 'Payment Link Generated') {
                let user = await User.findOne({ _id: generateDocument.generatedById })
                whatsapp.paymentLinkToRequester(user.phoneCode, user.phone, generateDocument, user.name,user._id)
                if (generateDocument.lawyerFeeStatus == "Pending" && generateDocument.links && generateDocument.links.legalFee) {
                    whatsapp.paymentLinkToCustomer(generateDocument.customerPhoneCode, generateDocument.phone, generateDocument, generateDocument.customerName)
                }
            } else if (req.body.completedStatus == 'Payment Complete') {
                let user = await User.findOne({ _id: generateDocument.generatedById })
                whatsapp.paymentCompleteToRequester(user.phoneCode, user.phone, generateDocument, user.name,user._id)
            } else if (req.body.completedStatus == 'Registration Complete') {
                let user = await User.findOne({ _id: generateDocument.generatedById })
                whatsapp.registrationCompleteToRequester(user.phoneCode, user.phone, generateDocument, user.name, user._id)
                if (generateDocument.registrationBoyId){
                    let user = await RegistrationBoy.findOne({ _id: generateDocument.registrationBoyId })
                    whatsapp.registrationCompleteToBoy(user.phoneCode, user.phone, generateDocument, user.name, user._id)
                }
            }
        }
        
        
        await generateDocument.save();
        res.json({
            success: true,            
            data: {
                generateDocument
            },
            success_code: process.env.SUCCESS_STRING_GENERATED_DOCUMENT_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_GENERATED_DOCUMENT_UPDATED_SUCCESSFULLY]
        })
        if(req.body.completedStatus == 'Document Submitted') {        
            GenerateDocumentHistory.create(JSON.parse(JSON.stringify(generateDocument))).then((doc) => { }).catch((error) => {
                console.log(error);
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getProjectTemplates = async function (req, res) {
    try {
        let templates = await Template.find({ projectId: req.query.projectId, isDelete: { $ne: true } }).populate("categoryId", { name: 1, isRegenerate: 1 });
        let generateDocument = await GenerateDocument.find({ projectId: req.query.projectId, projectUnitId: req.query.projectUnitId, portal:"Law", isDelete: { $ne: true } }).sort({createdAt:-1});
        res.json({
            success: true,
            data: {
                generateDocument,
                templates
            }
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.findVariables = async function (req, res, doc) {
    try {
        const text = doc.getFullText();
        // Regular expression to find variables in the format $SOME TEXT HERE$
        const variableRegex = /{([^{}]+)}/g;
        // Array to store found variables
        const inputArray = [];
        let match;
       
        while ((match = variableRegex.exec(text)) !== null) {
            inputArray.push(match[1])
        }
        function isBlockStart(item) {
            return item.startsWith("#");
        }

        // Function to determine if a string marks the end of a block
        function isBlockEnd(item) {
            return item.startsWith("/");
        }
        async function transformInput(array) {
            const excludesParams = await utils.excludesParams();
            const { variables, variablesWithType } = await parseBlock(array, excludesParams);

            // Filter out excludedParams and "NO" key from variablesWithType
            const filteredVariablesWithType = variablesWithType.filter(
                (entry) => entry.name !== "NO" && !excludesParams.includes(entry.name)
            );

            return {
                variables,
                variablesWithType: filteredVariablesWithType
            };
        }

        // Function to handle recursive parsing of blocks
        async function parseBlock(array, excludesParams, index = 0) {
            const variables = [];
            const variablesWithType = [];
            let i = index;

            while (i < array.length) {
                const item = array[i];

                // If it's a start of a block
                if (isBlockStart(item)) {
                    const blockName = item.substring(1);

                    if (blockName !== "NO" && !excludesParams.includes(blockName)) {
                        // Recursively parse nested blocks
                        const { variables: nestedVariables, variablesWithType: nestedVariablesWithType, nextIndex } = await parseBlock(
                            array,
                            excludesParams,
                            i + 1
                        );
                        i = nextIndex;

                        // Add to variables and variablesWithType if not excluded
                        variables.push(blockName);

                        const existingEntry = variablesWithType.find((entry) => entry.name === blockName);
                        const nestedDefaultValue = {};
                        const nestedDescription = {};

                        nestedVariablesWithType.forEach((field) => {
                            if (field.type === "Table") {
                                nestedDefaultValue[field.name] = [field.defaultValue[0] || {}];
                                nestedDescription[field.name] = field.description;
                            } else {
                                nestedDefaultValue[field.name] = "";
                                nestedDescription[field.name] = "text";
                            }
                        });

                        const newEntry = {
                            name: blockName,
                            type: "Table",
                            defaultValue: [nestedDefaultValue],
                            description: nestedDescription,
                            isEditable: true,
                            isDelete: false
                        };

                        if (existingEntry) {
                            mergeEntries(existingEntry, newEntry);
                        } else {
                            variablesWithType.push(newEntry);
                        }
                    }
                }
                // If it's an end of a block
                else if (isBlockEnd(item)) {
                    return { variables, variablesWithType, nextIndex: i };
                }
                // Simple variable outside of blocks
                else {
                    if (item !== "NO" && !excludesParams.includes(item) && !variables.includes(item)) {
                        variables.push(item);
                        variablesWithType.push({
                            name: item,
                            type: "Text",
                            defaultValue: "",
                            description: "",
                            isEditable: true,
                            isDelete: false
                        });
                    }
                }

                i++;
            }

            return { variables, variablesWithType, nextIndex: i };
        }

        // Merge logic for combining two entries with Table type
        function mergeEntries(existingEntry, newEntry) {
            const existingDefaultValue = existingEntry.defaultValue[0];
            const newDefaultValue = newEntry.defaultValue[0];

            Object.keys(newDefaultValue).forEach((key) => {
                if (existingDefaultValue[key] === undefined) {
                    existingDefaultValue[key] = newDefaultValue[key];
                }
            });

            const existingDescription = existingEntry.description;
            const newDescription = newEntry.description;

            Object.keys(newDescription).forEach((key) => {
                if (!existingDescription[key]) {
                    existingDescription[key] = newDescription[key];
                }
            });
        }

        return transformInput(inputArray);
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.generatedocument = async function (req, res) {
    try {
        let template = await Template.findOne({ _id: req.body.templateId, isDelete: { $ne: true } });
        let templateData
        let project
        let projectUnit
        if(req.body.projectUnitId){
            projectUnit = await ProjectUnit.findOne({ _id: req.body.projectUnitId });
            project = await Project.findOne({ _id: req.body.projectId });
            templateData = await utils.setDefaultDocument(projectUnit, project, req.body.timezone, template)
            // templateData={}
            if (req.body.remainingKeys){
                for (const [key, value] of Object.entries(req.body.remainingKeys)) {
                    templateData[key] = value;
                }
            }
            const content = fs.readFileSync('./uploads/' + template.attachment, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater();
            doc.loadZip(zip);
            const expressionParser = require("docxtemplater/expressions.js");
            doc.setOptions({
                delimiters: {
                    start: '{',
                    end: '}'
                },
                parser: expressionParser,
                linebreaks: true,
                paragraphLoop: true,
            });
            let findVariables = await exports.findVariables(req, res, doc);
            const variables = findVariables.variables
            let remainingKeys = [];
            variables.forEach((variable) => {
                if (templateData[variable] == undefined && !remainingKeys.find((x)=> x.name == variable)){
                    let autoVarible = findVariables.variablesWithType.find((x) => x.name == variable)
                    remainingKeys.push(autoVarible)
                }
            })

            if (remainingKeys.length > 0){
                return res.json({
                    success: false,
                    data:{
                        remainingKeys
                    },
                    error_code: process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING]
                })
            }
        }else{
            templateData = await utils.setGeneralKeys(req.body.templateData, req.body.timezone, template);
        }
        let generateDocument;
        let drafterFirm;
        if (req.body.generateDocumentId){
            generateDocument = await GenerateDocument.findOne({ _id: req.body.generateDocumentId });
            drafterFirm = await DrafterFirm.findOne({ _id: generateDocument.drafterFirmId });
            utils.documentLogs(req, "Update", generateDocument._id);
            generateDocument.editedById = req.headers.userid;
        }else{
            generateDocument = new GenerateDocument();
            utils.documentLogs(req, "Create", generateDocument._id);
            generateDocument.generatedById = req.headers.userid;
            
            if (req.body.titleRequestId){
                generateDocument.titleRequestId = req.body.titleRequestId;
            }
            if (template.portal == 'Law' && req.body.projectUnitId) {
                generateDocument.projectId = project._id;
                generateDocument.projectUnitId = projectUnit._id;
                generateDocument.buyerId = projectUnit.contactPersion.buyerId;
                generateDocument.builderFirmId = template.builderFirmId;
                generateDocument.advocateFirmId = template.advocateFirmId;
                generateDocument.docType = template.docType;
                generateDocument.completedStatus = "Document Submitted";
                generateDocument.stampDutyPaymentStatus = "Received";
                generateDocument.lawyerFeeStatus = "Received";
                generateDocument.regFeePaymentStatus = "Received";
                let templateName = template.name;
                if (template.docType == "ATS"){
                    templateName = "Agreement to Sale";
                    whatsapp.newAtsGeneratedToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.headers.user.name, projectUnit.contactPersion._id)
                } else if (template.docType == "DOS") {
                    templateName = "Sale Deed";
                    whatsapp.newDosGeneratedToContact(projectUnit.contactPersion.phoneCode, projectUnit.contactPersion.phone, projectUnit, projectUnit.contactPersion.name, req.headers.user.name, projectUnit.contactPersion._id)
                }
                email.atsDosGenerate(req, projectUnit.contactPersion.email, {
                    name: projectUnit.contactPersion.name,
                    unitNo: projectUnit.unit + "-" + projectUnit.block,
                    username: projectUnit.contactPersion.phoneCode + projectUnit.contactPersion.phone,
                    template: templateName,
                })
                if (template.fees && template.fees > 0){
                    utils.generateBuilderInvoice(project, projectUnit, template)
                }
            } else if (template.portal == 'Law' && !req.body.projectUnitId) {
                generateDocument.advocateFirmId = template.advocateFirmId;
                generateDocument.completedStatus = "Document Submitted";
                generateDocument.stampDutyPaymentStatus = "Received";
                generateDocument.lawyerFeeStatus = "Received";
                generateDocument.regFeePaymentStatus = "Received";
            } else {
                if (req.body.drafterFirmId){
                    generateDocument.drafterFirmId = req.body.drafterFirmId;
                    drafterFirm = await DrafterFirm.findOne({ _id: req.body.drafterFirmId })
                    if(drafterFirm.isReferral != false){
                        generateDocument.drafterFees = drafterFirm.mortgageCommission
                    }else{
                        generateDocument.drafterFees = 0
                    }
                    generateDocument.advocateFirmId = drafterFirm.advocateFirmId;
                }
                if (req.body.drafterId){
                    generateDocument.drafterId = req.body.drafterId;
                }
                if (req.body.isDrafter != undefined) {
                    generateDocument.isDrafter = String(req.body.isDrafter) == "true";
                }
                generateDocument.bankId = template.bankId;
                generateDocument.links.legalFee = "auth/payment?documentId=" + generateDocument._id;
                
            }
            generateDocument.lawyerFees = Number(template.fees) + Number(generateDocument.drafterFees);
            generateDocument.templateId =  template._id;
            generateDocument.categoryId = template.categoryId;
            generateDocument.portal = template.portal;
        }
        if (req.body.branchId){
            let branch = await BankBranch.findOne({ _id: req.body.branchId });
            generateDocument.branchId = branch._id;
            generateDocument.bankId = branch.bankId;
            generateDocument.stateId = branch.stateId;
            generateDocument.cityId = branch.cityId;
            generateDocument.districtId = branch.districtId;
        }
        generateDocument.customerName =  req.body.customerName;
        generateDocument.timezone =  req.body.timezone;
        generateDocument.customerPhoneCode =  req.body.customerPhoneCode;
        generateDocument.customerPhone =  req.body.customerPhone;
        if (req.body.applicationNo){
            generateDocument.applicationNo =  req.body.applicationNo;
        }
        generateDocument.salesName =  req.body.salesName;
        generateDocument.isDraft = req.body.isDraft;
        generateDocument.salesPhoneCode =  req.body.salesPhoneCode;
        generateDocument.salesPhone =  req.body.salesPhone;
        if (generateDocument.isDrafter && !drafterFirm.isEmail){
            generateDocument.salesEmail = settings.drafterEmail;
        }else{
            generateDocument.salesEmail = req.body.salesEmail ? req.body.salesEmail: settings.drafterEmail;
        }
        if (req.body.registrarOfficeId) {
            generateDocument.registrarOfficeId = req.body.registrarOfficeId;
        }
        generateDocument.description =  templateData;
        await generateDocument.save();
        if (req.body.totalFiles){
        }else{
            await exports.regenerateDocumentWithFiles(req, res, generateDocument._id)
        }
        res.json({
            success: true,
            data: {
                generateDocument
            },
            success_code: process.env.SUCCESS_STRING_GENERATED_DOCUMENT_GENERATE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_GENERATED_DOCUMENT_GENERATE_SUCCESSFULLY]
        })
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.regenerateDocumentWithFiles = async function (req, res, generateDocumentId) {
    try {
        let generateDocument = await GenerateDocument.findOne({ _id: generateDocumentId }).populate("registrarOfficeId", { name: 1, address: 1 }).populate("branchId", { name: 1, address: 1 }).populate("bankId", { name: 1, address: 1 }).populate("districtId", { name: 1 });
        let templateKey = await TemplateKeys.find({ isDelete: { $ne: true } })
        let template = await Template.findOne({ _id: generateDocument.templateId, isDelete: { $ne: true } });
        const content = fs.readFileSync('./uploads/' + template.attachment, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater();
        doc.loadZip(zip);
        const expressionParser = require("docxtemplater/expressions.js");
        doc.setOptions({
            delimiters: {
                start: '{',
                end: '}'
            },
            parser: expressionParser,
            linebreaks: true,
            paragraphLoop: true,
        });
        let templateData = generateDocument.description;
        let templateDataWithHeader = await utils.templateDataWithHeader(templateData, templateKey, template, generateDocument);
        let images =[];
        if (generateDocument.keyDocuments){
            
            for (const [tableName, tableValue] of Object.entries(generateDocument.keyDocuments)) {
                for (const [index, files] of Object.entries(tableValue)) {
                    for (let file of files) {
                        images.push({
                            url:file.url,
                            tableName:tableName,
                            i: Number(index) + 1
                        })
                    }
                }
            }
        }
        doc.setData(templateDataWithHeader);
        doc.render();
        let generatedContent = doc.getZip().generate({ type: 'nodebuffer' });
        let image_name = generateDocument._id;
        let url = utils.getImageFolderPath(req, 2) + image_name + '.docx';
        generateDocument.attachment = url;
        generateDocument.attachmentName = generateDocument.customerName+" "+template.attachmentName;
        utils.saveImageFromBrowser(null, image_name + '.docx', 2, generatedContent);
        await generateDocument.save();
        utils.docToPdf(url, generateDocument, template, images);
        if (generateDocument.portal == "Bank" && !generateDocument.projectId){
            //sms.documentGenerate(generateDocument.customerPhoneCode, generateDocument.customerPhone, generateDocument, generateDocument.customerName)
            let users = await User.find({ $and:[
                {role: "Staff Admin"},
                {status : true},
                {$or:[
                    { cityId: generateDocument.cityId },
                    { cityId: null, districtId: generateDocument.districtId },
                    { cityId: null, districtId: null, stateId: generateDocument.stateId },
                ]}
            ]})
            users.forEach((user)=>{
                whatsapp.morgageCreate(user.phoneCode, user.phone, generateDocument, user.name, user._id)
            })
        }
        return;
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.deletegeneratedocument = async function (req, res) {
    try {
        let generateDocument = await GenerateDocument.findOneAndUpdate({ _id: req.body.deleteId, isDraft :true}, { status: false, isDelete: true });
        if (generateDocument){
            utils.documentLogs(req, "Remove", generateDocument._id);
        }
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_GENERATED_DOCUMENT_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_GENERATED_DOCUMENT_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getgeneratedocumentfees = async function (req, res) {
    try {
        let match = { isDelete: { $ne: true } };
        if (req.query.portal) {
            match.portal = req.query.portal;
        }
        if (req.query.buyerId) {
            match.buyerId = new Schema(req.query.buyerId);
        }
        if (req.query.generatedById) {
            match.generatedById = new Schema(req.query.generatedById);
        }
        if (req.query.generateDocumentId) {
            match._id = new Schema(req.query.generateDocumentId);
        }
        if (req.query.categoryId) {
            match.categoryId = new Schema(req.query.categoryId);
        }
        if (req.query.templateId) {
            match.templateId = new Schema(req.query.templateId);
        }
        if (req.query.advocateFirmId) {
            match.advocateFirmId = new Schema(req.query.advocateFirmId);
        }
        if (req.query.builderFirmId) {
            match.builderFirmId = new Schema(req.query.builderFirmId);
        }        


        if (req.query.bankId) {
            match.bankId = new Schema(req.query.bankId)
        }
        if (req.query.branchId) {
            match.branchId = new Schema(req.query.branchId);
        }
        if (req.query.cityId) {
            match.cityId = new Schema(req.query.cityId);
        }
        if (req.query.districtId) {
            match.districtId = new Schema(req.query.districtId);
        }
        if (req.query.stateId) {
            match.stateId = new Schema(req.query.stateId);
        }

        if (req.query.drafterFirmId) {
            match.drafterFirmId = new Schema(req.query.drafterFirmId);
        }
        if (req.query.drafterId) {
            match.drafterId = new Schema(req.query.drafterId);
        }
        if (req.query.startDate && req.query.endDate) {
            match.createdAt = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        } else if (req.query.startDate) {
            match.createdAt = {$gte:new Date(req.query.startDate)};
        } else if (req.query.endDate) {
            match.createdAt = { $lte: new Date(req.query.endDate) };
        }
        let type = "Bank";
        if (req.query.isDrafter == true || req.query.isDrafter == "true") {
            match.isDrafter = String(req.query.isDrafter) == "true";
            match.portal = "Bank";
            type = "Drafter";
        } else if (req.query.isProject == true || req.query.isProject == "true") {
            match.projectUnitId = { $ne: null }
            match.portal = "Law";
            type = "Project";
        } else if (req.query.isLaw == true || req.query.isLaw == "true") {
            match.projectUnitId = null;
            match.portal = "Law";
            type = "Law";
        } else{
            match.isDrafter = { $ne: true }
            match.portal = "Bank";
            type = "Bank";
        }
        let group = { advocateFirmId: "$advocateFirmId", bankId: "$bankId" };
        let joins = [];
        if (req.headers.user.role == "Admin" || req.headers.user.role == "Staff Admin"){
            if(type == "Drafter"){
                group = { advocateFirmId: "$advocateFirmId", drafterFirmId: "$drafterFirmId" };
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
                        from: 'drafterfirms',
                        let: {
                            drafterFirmId: "$_id.drafterFirmId"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$drafterFirmId"]
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
            }else if(type == "Project"){
                group = { projectId: "$projectId" };
                joins.push({
                    $lookup: {
                        from: 'projects',
                        let: {
                            projectId: "$_id.projectId"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$projectId"]
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
            }else if(type == "Law"){
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
            }else if(type == "Bank"){
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
            }            
        } else if (req.headers.user.role == "State Head") {
            group = { bankId: "$bankId", districtId: "$districtId" };
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
            joins.push({
                $lookup: {
                    from: 'districts',
                    let: {
                        districtId: "$_id.districtId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$districtId"]
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
        } else if (req.headers.user.role == "District Head") {
            group = { bankId: "$bankId", cityId: "$cityId" };            
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
            joins.push({
                $lookup: {
                    from: 'cities',
                    let: {
                        cityId: "$_id.cityId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$cityId"]
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
        } else if (req.headers.user.role == "City Head") {
            group = { bankId: "$bankId", branchId: "$branchId" };
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
            joins.push({
                $lookup: {
                    from: 'branches',
                    let: {
                        branchId: "$_id.branchId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$branchId"]
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
        } else if (req.headers.user.role == "Advocate") {
            if (type == "Drafter") {
                group = { drafterFirmId: "$drafterFirmId" };
                joins.push({
                    $lookup: {
                        from: 'drafterfirms',
                        let: {
                            drafterFirmId: "$_id.drafterFirmId"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$drafterFirmId"]
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
            } else if (type == "Project") {
                group = { projectId: "$projectId" };
                joins.push({
                    $lookup: {
                        from: 'projects',
                        let: {
                            projectId: "$_id.projectId"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$projectId"]
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
            } else if (type == "Law") {
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
        } else if (req.headers.user.role == "Drafter Head" || req.headers.user.role == "Branch Head") {
            group = { generatedById: "$generatedById" };
            joins.push({
                $lookup: {
                    from: 'users',
                    let: {
                        generatedById: "$_id.generatedById"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$generatedById"]
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
        } else if (req.headers.user.role == "Builder") {
            group = { projectId: "$projectId" };
            joins.push({
                $lookup: {
                    from: 'projects',
                    let: {
                        projectId: "$_id.projectId"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$projectId"]
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
        let query = [];
        let summery = {
            pendingCount: 0,
            paymentLinkCount: 0,
            paymentCompleteCount: 0,
            registrationCompleteCount: 0,
            completeCount: 0,
            notCompleteCount: 0,
            lawyerFeeReceived: 0,
            lawyerFeePending: 0,
            counts: 0,
            fees: 0
        }
        if (req.query.isProject == true || req.query.isProject == "true") {
            //match.docType = { $in: ["ATS", "DOS"]};
            query = [{
                $match: match
            }, {
                $group: {
                    _id: group,
                    atsFee: { $sum: { $cond: [{ $eq: ["$docType", "ATS"] }, "$lawyerFees", 0] } },
                    dosFee: { $sum: { $cond: [{ $eq: ["$docType", "DOS"] }, "$lawyerFees", 0] } },
                    otherFee: { $sum: { $cond: [{ $eq: ["$docType", "Common"] }, "$lawyerFees", 0] } },
                    fees: { $sum: "$lawyerFees" },
                    atsCount: { $sum: { $cond: [{ $eq: ["$docType", "ATS"] }, 1, 0] } },
                    dosCount: { $sum: { $cond: [{ $eq: ["$docType", "DOS"] }, 1, 0] } },
                    otherCount: { $sum: { $cond: [{ $eq: ["$docType", "Common"] }, 1, 0] } },
                    counts: { $sum: 1 },
                }
            }];
            summery = {
                atsFee: 0,
                dosFee: 0,
                otherFee: 0,
                fees: 0,
                atsCount: 0,
                dosCount: 0,
                otherCount: 0,
                counts: 0,
            }
        }else{
            query = [{
                $match: match
            }, {
                $group: {
                    _id: group,
                    pendingCount: { $sum: { $cond: [{ $eq: ["$completedStatus", "Pending"] }, 1, 0] } },
                    paymentLinkCount: { $sum: { $cond: [{ $eq: ["$completedStatus", "Payment Link Generated"] }, 1, 0] } },
                    paymentCompleteCount: { $sum: { $cond: [{ $eq: ["$completedStatus", "Payment Complete"] }, 1, 0] } },
                    registrationCompleteCount: { $sum: { $cond: [{ $eq: ["$completedStatus", "Registration Complete"] }, 1, 0] } },
                    completeCount: { $sum: { $cond: [{ $eq: ["$completedStatus", "Document Submitted"] }, 1, 0] } },
                    notCompleteCount: { $sum: { $cond: [{ $ne: ["$completedStatus", "Document Submitted"] }, 1, 0] } },
                    lawyerFeeReceived: { $sum: { $cond: [{ $eq: ["$lawyerFeeStatus", "Received"] }, 1, 0] } },
                    lawyerFeePending: { $sum: { $cond: [{ $eq: ["$lawyerFeeStatus", "Pending"] }, 1, 0] } },
                    counts: { $sum: 1 },
                    fees: { $sum: "$lawyerFees" }
                }
            }];
        }
        if (joins.length){
            query.push(...joins)
        }
        let total = await GenerateDocument.aggregate(query);
        total = JSON.parse(JSON.stringify(total));

        
        for (let item of total){
            item.entity = "";
            if (item.detail1){
                item.entity += item.detail1.name;
            }
            if (item.detail2) {
                item.entity += "-"+item.detail2.name;
            }
            if (item.detail3) {
                item.entity += "-" +item.detail3.name;
            }
            Object.keys(summery).forEach((key)=>{
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
exports.getgeneratedocumentlogs = async function (req, res) {
    try {
        let logs = await DocumentLogsScema.find({ generatedDocumentId: req.query.generatedDocumentId }).populate("generatedDocumentId", { customerName: 1 }).populate("actionBy", { name: 1, role: 1, picture:1 });
        return res.json({
            success: true,
            data:{
                logs: logs
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.getgeneratedocument = async function (req, res) {
    try {
        let generatedocuments = []
        let page = 0;
        let totalPage = 0;
        let limit = noOfRecord;
        let query = { isDelete: { $ne: true } };
        let sortObj = {};
        let Table = GenerateDocument;
        if(req.query.history){
            Table = GenerateDocumentHistory;
        }
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        }else{
            sortObj = { createdAt: -1 };
        }
        if (req.query.generateDocumentId) {
            query._id = req.query.generateDocumentId;
        }
        if (req.query.portal) {
            query.portal = req.query.portal;
        }

        if (req.query.bankId) {
            query.bankId = req.query.bankId
        }
        if (req.query.branchId) {
            query.branchId = req.query.branchId;
        }
        if (req.query.cityId) {
            query.cityId = req.query.cityId;
        }
        if (req.query.districtId) {
            query.districtId = req.query.districtId;
        }
        if (req.query.drafterd) {
            query.drafterd = req.query.drafterd;
        }
        if (req.query.stateId) {
            query.stateId = req.query.stateId;
        }
        
        if (req.query.advocateFirmId) {
            query.advocateFirmId = req.query.advocateFirmId;
        }
        if (req.query.builderFirmId) {
            query.builderFirmId = req.query.builderFirmId;
        }
        if (req.query.drafterFirmId) {
            query.drafterFirmId = req.query.drafterFirmId;
        }
        if (req.query.drafterId) {
            query.drafterId = req.query.drafterId;
        }
        if (req.query.buyerId) {
            query.buyerId = req.query.buyerId;
        }
        if (req.query.generatedById) {
            query.generatedById = req.query.generatedById;
        }
       
        if (req.query.projectId) {
            query.projectId = req.query.projectId;
        } else if (req.query.projectIds) {
            query.projectId = { $in: req.query.projectIds };
        }
        if (req.query.stampDutyPaymentStatus) {
            query.stampDutyPaymentStatus = req.query.stampDutyPaymentStatus;
        }
        if (req.query.lawyerFeeStatus) {
            query.lawyerFeeStatus = req.query.lawyerFeeStatus;
        }
        if (req.query.docType) {
            query.docType = req.query.docType;
        }
        if (req.query.completedStatus && req.query.completedStatus =="Not Completed") {
            query.completedStatus = { $in: ["Pending", "Payment Link Generated", "Payment Complete", "Registration Complete"]};
        }else if (req.query.completedStatus) {
            query.completedStatus = {$eq : req.query.completedStatus};
        }
        if (req.query.isDrafter == true || req.query.isDrafter == "true") {
            query.isDrafter = String(req.query.isDrafter) == "true";
            query.portal = "Bank";
        } else if (req.query.isProject == true || req.query.isProject == "true") {
            query.projectUnitId = { $ne: null }
            query.portal = "Law";
        } else if (req.query.isLaw == true || req.query.isLaw == "true") {
            query.projectUnitId = null;
            query.portal = "Law";
        } else{
            query.isDrafter = { $ne: true }
            query.portal = "Bank";
        }
        if (!req.query.history && query.portal == "Bank") {
            if (query.completedStatus){
                query.completedStatus.$ne = "Document Submitted"
            }else{
                query.completedStatus = {$ne:"Document Submitted"}
            }
        }
        if (req.query.categoryId) {
            query.categoryId = req.query.categoryId;
        }
        if (req.query.templateId) {
            query.templateId = req.query.templateId;
        }
        
        if (req.query.status) {
            query.status = req.query.status.toLowerCase() == "true";
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.headers['user'].role != "Admin" && req.headers['user'].role != "Staff Admin") {
            query = {
                "$and": [
                    query,
                    { "$or": [{ generatedById: req.headers.user._id }, { isDraft: { $ne: true } }] }
                ]
            }
        }
        if (req.query.searchValue) {
            if (!query["$and"]){
                query["$and"] = [];
            }
            query["$and"].push({"$or" : [
                { customerName: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { customerPhone: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { salesName: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { salesPhone: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { attachmentName: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { poNumber: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { completedStatus: { $regex: new RegExp(req.query.searchValue, 'i') } },
                { stampDutyPaymentStatus: { $regex: new RegExp(req.query.searchValue, 'i') } },
            ]})
        }
        if (req.query.export) {                        
            generatedocuments = await Table.find(query).populate("districtId", { name: 1 }).populate("drafterFirmId", { name: 1, isEmail: 1 }).populate("stateId", { name: 1 }).populate("projectId", { name: 1 }).populate("categoryId", { name: 1, isRegenerate:1 }).populate("generatedById", { name: 1,role:1 }).populate("templateId", { name: 1 }).populate("bankId", { name: 1 }).populate("branchId", { name: 1 }).populate("cityId", { name: 1 }).populate("registrationBoyId", { name: 1 }).populate("registrarOfficeId", { name: 1 });
            utils.generateExcel({ customerName: "string", customerPhoneCode: "string", customerPhone: "string", applicationNo: "string", salesName: "string", salesPhoneCode: "string", salesPhone: "string", stampDutyPaymentStatus: "string", completedStatus: "string", appointmentDate: "date", bankId_name: "string", templateId_name: "string", generatedById_name: "string", districtId_name: "string", registrationBoyId_name: "string", registrarOfficeId_name: "string" }, generatedocuments, "generatedocuments.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            generatedocuments = await Table.find(query).populate("districtId", { name: 1 }).populate("drafterFirmId", { name: 1, isEmail: 1 }).populate("stateId", { name: 1 }).populate("projectId", { name: 1 }).populate("categoryId", { name: 1, isRegenerate: 1 }).populate("generatedById", { name: 1,role:1 }).populate("templateId", { name: 1 }).populate("bankId", { name: 1 }).populate("branchId", { name: 1 }).populate("cityId", { name: 1 }).populate("registrationBoyId", { name: 1 }).populate("registrarOfficeId", { name: 1 });
            utils.generatePDF({ customerName: "string", customerPhoneCode: "string", customerPhone: "string", applicationNo: "string", salesName: "string", salesPhoneCode: "string", salesPhone: "string", stampDutyPaymentStatus: "string", completedStatus: "string", appointmentDate: "date", bankId_name: "string", templateId_name: "string", generatedById_name: "string", districtId_name: "string", registrationBoyId_name: "string", registrarOfficeId_name: "string" }, generatedocuments, "generatedocuments.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            generatedocuments = await Table.find(query).populate("districtId", { name: 1 }).populate("drafterFirmId", { name: 1, isEmail: 1 }).populate("stateId", { name: 1 }).populate("projectId", { name: 1 }).populate("categoryId", { name: 1, isRegenerate: 1 }).populate("generatedById", { name: 1,role:1 }).populate("templateId", { name: 1 }).populate("bankId", { name: 1 }).populate("branchId", { name: 1 }).populate("cityId", { name: 1 }).populate("registrationBoyId", { name: 1 }).populate("registrarOfficeId", { name: 1 });
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalPage = await Table.countDocuments(query);
            /* if (totalPage) {
                totalPage = Math.ceil(totalPage / limit);
            } */
            generatedocuments = await Table.find(query).sort(sortObj).skip(skip).limit(limit).populate("districtId", { name: 1 }).populate("drafterFirmId", { name: 1, isEmail: 1 }).populate("stateId", { name: 1 }).populate("projectId", { name: 1 }).populate("categoryId", { name: 1, isRegenerate: 1 }).populate("generatedById", { name: 1,role:1 }).populate("templateId", { name: 1 }).populate("bankId", { name: 1 }).populate("branchId", { name: 1 }).populate("cityId", { name: 1 }).populate("registrationBoyId", { name: 1 }).populate("registrarOfficeId", { name: 1 });
        }
        return res.json({
            success: true,
            data: {
                generatedocuments,
                page,
                totalPage
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

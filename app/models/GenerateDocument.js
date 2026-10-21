const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const generateDocumentScema = new mongoose.Schema({
    customerName: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    customerPhoneCode: { type: String,default:"+91" },
    customerPhone: { type: String },
    applicationNo: { type: String },
    salesName: { type: String },
    salesPhoneCode: { type: String },
    salesPhone: { type: String },
    poNumber: { type: String },
    poFile: { type: Object },
    orderId: { type: String },
    paymentId: { type: String },
    salesEmail: { type: String },
    timezone: { type: String },
    docType: { type: String },
    stampDutyPaymentStatus: { type: String, enums: ["Pending", "Received"], default: "Pending" },
    lawyerFeeStatus: { type: String, enums: ["Pending", "Received"], default: "Pending" },
    regFeePaymentStatus: { type: String, enums: ["Pending", "Received"], default: "Pending" },
    links:{
        legalFee: { type: String, default: "" },
        stampDuty: { type: String, default: "" },
        registrationFee: { type: String, default: "" },
    },
    description: { type: Object },
    keyDocuments: { type: Object },
    attachments: { type: Array,default:[] },
    isDraft: { type: Boolean,default:false },
    isDrafter: { type: Boolean,default:false },
    lawyerFees: { type: Number, default: 0 },
    drafterFees: { type: Number, default: 0 },
    completedStatus: { type: String, enums: ["Pending", "Payment Link Generated", "Payment Complete", "Registration Complete", "Document Submitted"], default: "Pending" },
    attachment: { type: String},
    attachmentName: { type: String},
    portal: { type: String, enums: ["Bank", "Law"], default: "Bank" },
    appointmentDate: {
        type: Date
    },
    registrarDocument: { 
        doc1: { type: Object },
        doc2: { type: Object },
        doc3: { type: Object },
    },

    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    drafterFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "DrafterFirm" },
    drafterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    projectUnitId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectUnit" },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    generatedById: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    editedById: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", default: null },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City", default: null },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "BankBranch", default: null },
    titleRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "TitleRequest", default: null },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    registrationBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "RegistrationBoy",default:null },
    registrarOfficeId: { type: mongoose.Schema.Types.ObjectId, ref: "RegistrarOffice", default: null },
}, options)
module.exports = db.model("GenerateDocument", generateDocumentScema)
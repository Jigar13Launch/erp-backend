const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        updatedAt: 'modifiedAt',
    }
}
const TitleRequestHistory = new mongoose.Schema({
    name: { type: String, required: true }, //channel name
    applicationNo: { type: String, required: true },
    queryStatus: { type: Number, default: 0 }, // 0-No Query 1-Query By Requester 2-Query By Advocate 3-pending from advocate
    apfNo: { type: String },
    documentRequiredForCreationofMorgage: { type: String },
    propertyDescription: { type: String },
    propertyBoundedBy: { type: String },
    propertyAddress: { type: String },
    ownerName: { type: String },
    customer: {
        name: { type: String, required: true },
        email: { type: String},
        address: { type: String, required: true },
        phone: { type: String, required: true },
        phoneCode: { type: String, required: true },
    },
    orderId: { type: String },
    paymentId: { type: String },
    lawyerFees: { type: Number, default: 0 },
    applicantFees: { type: Number, default: 0 },
    staffFees: { type: Number, default: 0 },
    status: { type: Number, default: 0 }, // 0-Requested 1-Payment Done 5-sign pending 6- sign done 7-completed
    completedAt: {
        type: Date,
        default: null
    },
    productType: { type: Number }, // 0-Non Home Loan 1-Home Loan
    product: { type: Number }, 
    // 1-Land + Construction Loan, 2-Self Construction Loan ,3-Non Residential Purchase, 4- Loan Against Property,
    // 5-Home Loan, 6- Home Improvement Load, 7-Land Loan,  8-Land + Construction Loan, 9-Self Construction Loan , 10- Loan Against Property
    transectionType: { type: Number }, 
    // 4-Builder Resale, 5-Direct Allotment from Builder , 6-Direct Allotment from Development Authority/Govt Body,7-Development Authority/Govt Body, 8-Direct Allotment from Society, 9-Resale (Others), 10-Self Construction, 11-Society Resale, 12- CRFG SSVR, 13-CRFG FSVR
    registrarOfficeId: { type: mongoose.Schema.Types.ObjectId, ref: "RegistrarOffice", default: null },
    loanAmount: { type: Number, required: true }, 
    isDelete: { type: Boolean, default: false },
    paidByBank: { type: Boolean, default: false },
    isLink: { type: Boolean, default: true },
    reassign: { type: Boolean, default: false },
    isApproved: { type: Number, default: 0 }, //0-pending 1-approved 2-rejected
    attachments: [{
        url: { type: String },
        originalname: { type: String },
        uploadedAt: {
            type: Date,
            default: null
        },
    }],
    query: [{
        title: { type: String },
        message: { type: String },
        isApproved: { type: Boolean, default: false },
        status: { type: Number, default: 0 },
        role: { type: String, enums: ["Requester", "Advocate"] },
        raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }],
    titleDoc: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocPdf: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocSearchReport1: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocSearchReport2: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocSearchReceipt1: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocSearchRecipt2: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocReveanue1: {
        url: { type: String },
        originalname: { type: String },
    },
    titleDocReveanue2: {
        url: { type: String },
        originalname: { type: String },
    },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "BankBranch", default: null },

    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    advocateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },

    drafterFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "DrafterFirm" },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", default: null },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City", default: null },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", default: null },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, options)

module.exports = db.model("TitleRequestHistory", TitleRequestHistory)
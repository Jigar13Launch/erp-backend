const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const MasterInvoice = new mongoose.Schema({
    refSenderModel: { type: String, default: "AdvocateFirm" },
    refReceiverModel: { type: String, default: "Bank" },
    sender: {
        _id: { type: mongoose.Schema.Types.ObjectId, refPath: "refSenderModel" },
        name: { type: String },
        address: { type: String },
        email: { type: String },
        gstNo: { type: String },
        invoiceNote: { type: String, default: "" },
        accountNo: { type: String },
        ifsc: { type: String }
    },
    receiver: { //is company or passenger 
        _id: { type: mongoose.Schema.Types.ObjectId, refPath: "refReceiverModel" },
        name: { type: String },
        address: { type: String },
        email: { type: String },
        gstNo: { type: String },
    },
    invoiceNo: { type: String, default: "", unique: true },
    isPaid: { type: Boolean, default: false },
    invoiceType: { type: Number, default: 0 },  //0-advocate to admin for title  , 1- admin to bank , 2 - admin to builder , 3- staff to advocate firm, 4- drafter to admmin
    invoiceUniqueNo: { type: Number, default: 0 },  //from next sequence in sender company 
    isApproved: { type: Number, default: 0 }, // 0-pending 1-approved 2-rejected
    total: {
        totalWithoutVat: { type: Number, default: 0 },  //total excl vat 
        vat1: { type: Number, default: 0 },  // vat 21%
        vat2: { type: Number, default: 0 },  // vat 21%
        totalWithVat: { type: Number, default: 0 },  //total incl vat. 
    },
    invoiceDetails: { type: Array, default: [] }, // here it will come title data
    summeryDetails: { type: Array, default: [] }, // here it will come title data
    invoiceDueDays: { type: Number, default: 14 },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    senderTime: {
        type: Date,
        default: null
    },
    receiverTime: {
        type: Date,
        default: null
    }
}, options)

module.exports = db.model("MasterInvoice", MasterInvoice)



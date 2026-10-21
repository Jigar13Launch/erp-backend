const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const firmScema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    isUploadOwnershipDowcument: { type: Boolean, default: true },
    atsDosDownload: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    invoiceDetail: {
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        email: { type: String, default: "" },
        gstNo: { type: String, default: "" },
        invoiceNote: { type: String, default: "" },
        accountNo: { type: String, default: "" },
        ifsc: { type: String, default: "" },
    },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
}, options)
module.exports = db.model("BuilderFirm", firmScema)
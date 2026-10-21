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
    phoneCode: { type: String, default: "+91" },
    phone: { type: String, required: true },
    uniqueId: { type: Number },
    downloads: { type: Number ,default:0},
    status: { type: Boolean, default: true },
    privateFolder: { type: Boolean, default: false },
    isDrafter: { type: Boolean, default: false },
    isTitlePortal: { type: Boolean, default: false },
    isBuilderPortal: { type: Boolean, default: true },
    cityIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
    address: {
        street: { type: String, default: "" },
        houseNo: { type: String, default: "" },
        city: { type: String, default: "" },
        postcode: { type: String, default: "" },
        country: { type: String, default: "" },
        address: { type: String, default: "" },
        location: { type: [Number], index: '2dsphere' }
    },
    invoiceDetail: {
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        email: { type: String, default: "" },
        gstNo: { type: String, default: "" },
        invoiceNote: { type: String, default: "" },
        accountNo: { type: String, default: "" },
        ifsc: { type: String, default: "" },
    },
    isUploadOwnershipDowcument: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, options)
module.exports = db.model("AdvocateFirm", firmScema)
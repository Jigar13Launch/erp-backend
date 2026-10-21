const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const inquiryScema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    phoneCode: { type: String ,default:"+91"},
    email: { type: String },
    address: { type: String },
    budget: { type: String },
    details: { type: String },
    attendBy: { type: String },
    isReferance: { type: Boolean,default:false },
    referance: { 
        name: { type: String },
        phoneCode: { type: String, defult: "+91" },
        phone: { type: String },
        adviceFee: { type: Number },
        email: { type: String },
    },
    isDelete: { type: Boolean, default: false },

    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
}, options)
module.exports = db.model("Inquiry", inquiryScema)
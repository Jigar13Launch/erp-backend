const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const templateScema = new mongoose.Schema({
    name: { type: String, required: true },
    attachment: { type: String, required: true },
    attachmentName: { type: String, required: true },
    status: { type: Boolean,default:true},
    docType: { type: String, enums: ["Common", "ATS", "DOS"], default: "Common" },
    fees: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    portal: { type: String, enums: ["Bank", "Law"], default: "Bank" },
    variables: { type: Array },
    variablesWithType: { type: Array },
    language: { type: String, enums: ["English", "Gujarati"], default: "English" },
    isDelete: { type: Boolean, default: false },

    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" ,default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category",required:true },
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
}, options)
module.exports = db.model("Template", templateScema)
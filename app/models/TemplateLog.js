const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const templateLogScema = new mongoose.Schema({
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ipAddress: { type: String},
    isDelete: { type: Boolean, default: false },
}, options)
module.exports = db.model("Template", templateLogScema)
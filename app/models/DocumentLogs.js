const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const DocumentLogsScema = new mongoose.Schema({
    actionType: { type: String, enums: ["Create", "Update", "Status Change", "Regestation Detail", "Legal Fee Received", "PO Detail", "Remove"], default: null },
    actionString: { type: String },
    actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    generatedDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: "GenerateDocument" },
}, options)
module.exports = db.model("DocumentLogs", DocumentLogsScema)
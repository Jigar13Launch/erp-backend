const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const folderFileScema = new mongoose.Schema({
    folders: {
        type: [{
            name: { type: String },
           
        }
        ], default: [] },
    files: {
        type: [{
            url: { type: String },
            
            originalname: { type: String },
        }], default: [] },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "FolderFile", default: null },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
}, options)
module.exports = db.model("FolderFile", folderFileScema)
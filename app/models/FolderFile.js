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
    name: { type: String },
    url: { type: String },
    private: { type: Boolean,default:false },
    type:{type:Number,default:0}, //0-folder 1-file
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "FolderFile", default: null },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, options)
module.exports = db.model("FolderFile", folderFileScema)
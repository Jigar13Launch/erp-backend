const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const registrarOfficeScema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District",required:true }
}, options)
module.exports = db.model("RegistrarOffice", registrarOfficeScema)
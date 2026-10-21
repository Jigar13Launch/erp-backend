const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const projectScema = new mongoose.Schema({
    name: { type: String, required: true },    
    status: { type: Boolean, default: true },
    documents: [{
        url: { type: String },
        originalname: { type: String },
    }],
    isDelete: { type: Boolean, default: false },
    fixPrice: { type: Number, default: 0 },
    stampDuty: { type: Number, default: 4.9 },
    regPercentage: { type: Number, default: 1 },
    regFixFee: { type: Number, default: 500 },
    GST: { type: Number, default: 12 },
    noOfUnit: { type: Number, default: 50 },

    staffAdminId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    staffAdvocateId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    advocateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm", default: null },
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, options)
module.exports = db.model("Project", projectScema)
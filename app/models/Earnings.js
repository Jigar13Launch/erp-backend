const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const earningsSchema = new mongoose.Schema({
    receivePerson : { type: String, required: true },
    paymentType: { type: String }, // 0 = cash , 1 = bank
    phoneCode: { type: String ,default:"+91"},
    email: { type: String },
    address: { type: String },
    amount: { type: Number },
    date: { type: Date },
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

    product : {  _id: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, name: {type:String} },
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
}, options)
module.exports = db.model("Earnings", earningsSchema)
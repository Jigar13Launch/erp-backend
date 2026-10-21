const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    }
}
const DrafterFirmScema = new mongoose.Schema({
    name:{type:String,required:true},
    uniqueId: { type: Number },
    status:{type:Boolean,default:true},
    isDelete:{type:Boolean,default:false},
    isEmail:{type:Boolean,default:false},
    isLink:{type:Boolean,default:true},
    isReferral:{type:Boolean,default:true},
    advocateFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvocateFirm" },

    mortgageCommission: { type: Number, default: 0 },
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
    invoiceDetailTitle: {
        nameTitle: { type: String, default: "" },
        addressTitle: { type: String, default: "" },
        emailTitle: { type: String, default: "" },
        gstNoTitle: { type: String, default: "" },
        invoiceNoteTitle: { type: String, default: "" },
        accountNoTitle: { type: String, default: "" },
        ifscTitle: { type: String, default: "" },
    },
}, options)
module.exports = db.model("DrafterFirm", DrafterFirmScema)
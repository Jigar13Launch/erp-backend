const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    }
}
const bankScema = new mongoose.Schema({
    name:{type:String,required:true},
    status:{type:Boolean,default:true},
    paidByBank:{type:Boolean,default:false},
    isDelete:{type:Boolean,default:false},
    titleAmount:{type:Number,default:0},
    titleDoc: {
        url: { type: String },
        originalname: { type: String },
    },
    invoiceDetail: {
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        email: { type: String, default: "" },
        gstNo: { type: String, default: "" },
    },
}, options)
module.exports = db.model("Bank", bankScema)
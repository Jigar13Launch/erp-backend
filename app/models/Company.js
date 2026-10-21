const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    },
    index: true
}
const companySchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    name:{type:String,required:true},
    mobileNumber :{type:Number, required:true},
    gstin:{type:String,default:""},
    openingBalance:{type:Number,default:0},
    isDelete:{type:Boolean,default:false},
    address : {type: String },
    email:{type:String,default:""},
    tenantUserId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    // invoiceDetail: {
    //     name: { type: String, default: "" },
    //     address: { type: String, default: "" },
    //     email: { type: String, default: "" },
    //     gstNo: { type: String, default: "" },
    // },
}, options)
module.exports = db.model("Company", companySchema)
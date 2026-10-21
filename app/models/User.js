const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    }
}
const userScema = new mongoose.Schema({
    name :{type:String,required:true},
    companyName :{type:String,required:true},
    gst:{type:String,default:""},
    loginId:{type:String,required:true},
    email: { type: String, required: true},
    address: { type: String, required: true},
    password:{type:String,required:true},
    phoneCode:{type:String,default:"+91"},
    phone: { type: String, required: true },
    token:{type:String},
    otp:{type:String,default:""},
    deviceId: { type: String, default: "" },
    isOtp:{type:Boolean,default:false},
    isDelete:{type:Boolean,default:false},
    role:{type:String,enum:["SUPER_ADMIN","TENANT"],default:"TENANT"},
    logo:{type:String,default:""},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    isActive:{type:Boolean,default:true}
}, options)
module.exports = db.model("User", userScema)
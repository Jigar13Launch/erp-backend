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
const superCompanySchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    userName:{type:String,required:true},
    password:{type:String,required:true},
    token:{type:String,required:true},
    picture:{type:String},
    mobileNumber :{type:Number, required:true},
    isDelete:{type:Boolean,default:false},
    year:{type:String},
    prefix:{type:String},
    role:{
        type:String,
        enum:["superAdmin","subAdmin" , "admin"]
    }
}, options)
module.exports = db.model("SuperCompany", superCompanySchema)
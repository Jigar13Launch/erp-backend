const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    }
}
const roleSchema = new mongoose.Schema({
    name :{type:String,required:true},
    isDelete:{type:Boolean,default:false},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    isActive:{type:Boolean,default:true}
}, options)
module.exports = db.model("Role", roleSchema)
const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey:false,
    timestamps:{
        createdAt:true,
        updatedAt:'modifiedAt',
    }
}
const bankBranchScema = new mongoose.Schema({
    name:{type:String,required:true},
    status:{type:Boolean,default:true},
    isDelete: { type: Boolean, default: false },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    ifsc:{type:String},
    address:{type:String},
    pincode:{type:String},
    phoneCode:{type:String},
    phone:{type:String},
}, options)
module.exports = db.model("BankBranch", bankBranchScema)
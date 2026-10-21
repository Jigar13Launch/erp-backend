const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const orderSchema = new mongoose.Schema({
    product:{
        _id:{ type: mongoose.Schema.Types.ObjectId, ref: "Product" ,required:true},
        name:{type:String ,required:true},
    },
    Company:{
        _id:{ type: mongoose.Schema.Types.ObjectId, ref: "Company" ,required:true},
        name:{type:String ,required:true},
    },

    salesPerson: { type: String}, 
    qty: { type: Number, required: true },
    price: { type: Number ,  required: true },
    GST: { type: Number},   // GST in percentage,
    SGST : { type: Number}, // SGST in percentage,
    CGST: { type: Number},  // CGST in percentage,
    isGST: { type: Boolean},
    total: { type: Number},
    date: { type: Date},
    Note: { type: String, default: "" },
    invoiceNumber: { type: String},
    paymentOption: { type: Number, required:true}, // 1 for cash and 2 for GST
    OrderType: { type: Number , required:true},     // 1 for buy and 2 for sell
    isDelete: { type: Boolean, default: false },
}, options)
module.exports = db.model("Order", orderSchema)
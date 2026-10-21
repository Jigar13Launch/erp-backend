const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

const expenseSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    title:{type:String,require:true},
    vendorName: { type: String,require:true },
    expenseCategory: { type: String,require:true },
    gstApplicable: { type: Boolean, default: false },
    GST: { type: Number, default: 0 },   // GST in percentage,
    gstNumber: { type: String, default: "" },   // GST in percentage,
    gstAmount:{type:Number, default:0},
    invoiceNumber: { type: String, default: "" },   // GST in percentage,
    amount: { type: Number,require:true },
    paymentMethod:{type:String,enum:["BANK","CASH"]},
    date: { type: Date, require:true },
    notes: { type: String,default:"" },
    imageUrl: { type: String,default:"" },
    pdfUrl: { type: String,default:"" },
    isDelete: { type: Boolean, default: false },
}, options)

module.exports = db.model('Expense', expenseSchema);
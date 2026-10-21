const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

const ledgerSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    items:[],
    invoiceNo:{type:String, default:""},
    companyId: { type: mongoose.Schema.Types.ObjectId, ref:"Company"},
    sellId: { type: mongoose.Schema.Types.ObjectId, ref:"Sell",default:"" },
    earningId: { type: mongoose.Schema.Types.ObjectId, ref:"Earning",default:null },
    buyId: { type: mongoose.Schema.Types.ObjectId, ref:"Buy",default:null },
    companyName: { type:String,default:null},
    date: { type: Date },
    charges:{type:Number, default:0},
    amount: { type:Number,require:true},
    paymentType: {type:String,  enum: ['CASH', 'BANK', 'SELL', 'BUY','SALES RETURN'] },
    notes:{type:String,default:""},
    amountType: {type:String, enum: ['CRED', 'DEB'] },
    isDelete: { type: Boolean, default: false},
    isActive: { type:Boolean, default:true},
    isOpningBal:{type: Boolean, default: false}
}, options)

module.exports = db.model('Ledger', ledgerSchema);
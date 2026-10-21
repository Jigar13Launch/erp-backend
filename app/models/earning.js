const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

const earningSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    date: { type: Date },
    amount: { type: Number },
    total: { type: Number },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    companyName: { type: String },
    receivePerson: { type: String },
    paymentType: { type: String, enum: ['CASH', 'BANK'] },
    isActive: { type: Boolean, default: false },
    charges: { type: Number },
    isDelete: { type: Boolean, default: false },
}, options)

module.exports = db.model('Earning', earningSchema);
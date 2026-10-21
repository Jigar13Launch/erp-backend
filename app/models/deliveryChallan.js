const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

const deliveryChallanSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    customerName: { type: String, default:"" },
    invoiceNumber: { type: String },
    challanType: { type: String, enum: ['APPROVAL', 'JOB WORK', 'OTHER'] },
    deliveryChallanNumber: { type: String },
    date: { type: Date },
    products:[],
    isDelete: { type: Boolean, default: false },
}, options)

module.exports = db.model('DeliveryChallan', deliveryChallanSchema);
const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

itemSchema = new mongoose.Schema({
    itemName:{
        type:String,
        trim:true
    },
    quantity:{
        type:Number,
        default:1,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    gst:{
        type:Number,
        default:false
    },
    cess:{
        type:Number,
        default:0
    },
    sgst:{
        type:Number,
        default:0
    },
    cgst:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        default:0
    }
})

const buySchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    items: [{ type: itemSchema }],
    gstApplicable: { type: Boolean, default: false },
    cessApplicable: { type: Boolean, default: false },
    gstTotal: { type: Number, default: 0 },
    cessTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    date: { type: Date },
    invoiceNumber: { type: String },
    companyName: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref:"Company" },
    billType: { type: String, enum: ['CASH', 'GST'] },
    notes: { type: String ,default:""},
    imageUrl: { type: String },
    pdfUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, options)

module.exports = db.model('Buy', buySchema);
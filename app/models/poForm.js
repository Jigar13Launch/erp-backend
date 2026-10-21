const mongoose = require('mongoose');
const db = require('../../config/connection');

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}

const poFormSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    date: { type: Date },
    items: [],
    poNumber:{type:String, require:true},    
    buyerCompany: { type: mongoose.Types.ObjectId, require:true },
    buyerCompanyName: { type: String, default:"" },
    sellerCompany: { type: mongoose.Types.ObjectId, require:true },
    sellerCompanyName: { type: String, default:"" },
    isDelete: { type: Boolean, default: false },
}, options)

module.exports = db.model('PoForm', poFormSchema);
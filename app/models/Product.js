const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    },
    index: true
}
const productSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user:{type:Object,default:null},
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    qty: { type: Number, default:1 },
    date: { type: Date },
    gstApplicable: { type: Boolean, default: false },
    gst: { type: Number }, // GST in percentage
    cessApplicable: { type: Boolean, default: false },
    cess: { type: Number }, // GST in percentage
    stock:{type:Number,default:0},
    image: { type: String },
    isDelete: { type: Boolean, default: false },

}, options)
module.exports = db.model("Product", productSchema);
const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const categoriesScema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isRegenerate: { type: Boolean, default: false },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default:null},
    portal: { type: String, enums: ["Bank", "Law"], default: "Bank" },
}, options)
module.exports = db.model("Category", categoriesScema)
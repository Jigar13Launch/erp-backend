const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const smsScema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
}, options)
module.exports = db.model("SMS", smsScema)
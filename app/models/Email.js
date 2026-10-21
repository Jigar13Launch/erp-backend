const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const emailScema = new mongoose.Schema({
    unique: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
}, options)
module.exports = db.model("Email", emailScema)
const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const countryScema = new mongoose.Schema({
    name: { type: String, required: true },
}, options)
module.exports = db.model("Country", countryScema)
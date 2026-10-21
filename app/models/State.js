const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const stateScema = new mongoose.Schema({
    name: { type: String, required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    status: { type: Boolean, default: true },
}, options)
module.exports = db.model("State", stateScema)
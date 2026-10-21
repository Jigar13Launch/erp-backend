const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const districtScema = new mongoose.Schema({
    name: { type: String, required: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    status: { type: Boolean, default: true },
}, options)
module.exports = db.model("District", districtScema)
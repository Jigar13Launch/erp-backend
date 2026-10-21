const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const cityScema = new mongoose.Schema({
    name: { type: String, required: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    status: { type: Boolean, default: true },
    district: { type: Boolean, default: false },
}, options)
module.exports = db.model("City", cityScema)
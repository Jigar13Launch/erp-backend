const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const registrationBoyScema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneCode: { type: String ,default:"+91"},
    phone: { type: String},
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District" }
}, options)
module.exports = db.model("RegistrationBoy", registrationBoyScema)
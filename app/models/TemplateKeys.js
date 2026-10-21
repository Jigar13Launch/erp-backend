const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const TemplateKeysScema = new mongoose.Schema({
    name: { type: String, required: true },
    defaultValue: { type: mongoose.Schema.Types.Mixed },
    type: { type: String, enums: ["Text", "Dropdown", "Table", "HTML"], required: true },
    description: { type: mongoose.Schema.Types.Mixed },
    speciality: { type: String, enums: ["date", "year", "dayname", "day", "monthname", "month", "amount", "words", "file", "",null] },
    portal: { type: String, enums: ["Bank", "Law"], default: "Bank" },
    note: { type: String },
    isDelete: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    isHeaders: { type: Boolean, default: false },
    headers: { type: mongoose.Schema.Types.Mixed },
    isEditable: { type: Boolean, default: true },
}, options)
module.exports = db.model("TemplateKeys", TemplateKeysScema);
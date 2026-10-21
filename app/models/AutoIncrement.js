const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: 'modifiedAt',
  }
}
const AutoIncrement = new mongoose.Schema({
  table: { type: String, default: "" },
  lastId: { type: Number, default: 0 },
  type: Number,
}, options)

module.exports = db.model("AutoIncrement", AutoIncrement)


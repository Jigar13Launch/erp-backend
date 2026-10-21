const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const notificationScema = new mongoose.Schema({
    title: { type: String},
    description: { type: String},
    type: { type: String},
    for: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    read: { type: Boolean, default: false },
    search: { type: String },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) }, // 15 days from creation
}, options)
notificationScema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = db.model("Notification", notificationScema)
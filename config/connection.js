// const mongoose = require("mongoose");
// const {createTunnel} = require('tunnel-ssh');
// let local = true;
// let db = mongoose.createConnection("mongodb://localhost:27017/ERP-Project", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// db.on('connected', () => {
//     console.log("DB connected")
// })
// db.on('error', () => {
//     console.log("DB error connected")
// })
// db.on('disconnected', () => {
//     console.log("DB disconnected")
// })
// db.on('reconnected', () => {
//     console.log("DB reconnected")
// })
// process.on('SIGINT', () => {
//     db.close(() => {
//         console.log("DB connected disconnected for master DB through app")
//     })
//     process.exit(0)
// })
// module.exports = db


const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
}

const db = mongoose.createConnection(mongoUri, {
    serverSelectionTimeoutMS: 10000
});

db.on("connected", () => {
    console.log("DB connected successfully");
});

db.on("error", (err) => {
    console.error("DB connection error:", err.message);
});

db.on("disconnected", () => {
    console.log("DB disconnected");
});

db.on("reconnected", () => {
    console.log("DB reconnected");
});

process.on("SIGINT", async () => {
    try {
        await db.close();
        console.log("DB connection closed");
    } finally {
        process.exit(0);
    }
});

module.exports = db;

const mongoose = require("mongoose");
const db = require("../../config/connection");

const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: 'modifiedAt',
    }
}
const projectUnitScema = new mongoose.Schema({
    name: { type: String,default:"" },
    unit: { type: String,default:"" },
    block: { type: String,default:"" },
    floor: { type: String,default:"" },
    remark: { type: String,default:"" },
    carpetArea: { type: Number },
    builtUpArea: { type: Number },
    superBuiltUpArea: { type: Number },
    undevidedLand: { type: Number },
    plotArea: { type: Number },
    totalPlotArea: { type: Number },
    eastSide: { type: Number },
    westSide: { type: Number },
    southSide: { type: Number },
    northSide: { type: Number },
    tarraceArea: { type: Number },
    washArea: { type: Number },
    balconyArea: { type: Number },
    adjoiningLandArea: { type: Number },
    status: { type: String, enums: ["Pending", "Booked"], default:"Pending" },
    bookedBy: { type: String },
    parkingNo: { type: String },
    requestATS: { type: Boolean,default:false },
    requestDOS: { type: Boolean,default:false },


    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" ,required:true},
    builderFirmId: { type: mongoose.Schema.Types.ObjectId, ref: "BuilderFirm", default: null },
    paidExpenses: { type: Boolean, default: false },

    purchaser:[{
        
        purchaserType: { type: String, enums: ["Individual", "Partnership Firm", "Company", "Society / Association"] },
        // authorisedPerson: { type: String, default: "" },
        name: { type: String, default: "" },
        authorisedPerson: { type: String, default: "" },
        gst: { type: String, default: "" },
        email: { type: String, default: "" },
        phoneCode: { type: String, default: "+91" },
        phone: { type: String },
        age: { type: Number },
        occupation: { type: String },
        religion: { type: String },
        panNo: { type: String },
        aadharNo: { type: String },
        address: { type: String },
    }],
    documents:[{
        url: { type: String },
        type: { type: String, default: "Purchaser", enums: ["Purchaser", "Advocate"] },
        subType: { type: Number, default:0 }, //0 -general , 1 -ATS , 2 -DOS
        originalname: { type: String },
        uploadedAt : {type:Date,default:Date.now}
    }],
    payment:[{
        date: {
            type: Date,
            default: Date.now
        },
        amount: { type: Number, default: 0 },
        payType: { type: String, enums: ["Cheque", "NEFT", "RTGS", "IMPS", "Demand Draft", "Cash"] },
        refNo: { type: String, default: "" },
        bank: { type: String, default: "" },
        branch: { type: String, default: "" },
        city: { type: String, default: "" },
        comments: { type: String, default: "" },
    }],
    contactPersion: {
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        name: { type: String },
        phoneCode: { type: String, defult: "+91" },
        phone: { type: String },
        email: { type: String },
    },
    attendBy: { type: String },
    bookedOn: { type: Date },
    invoice:{
        stempDutyPercentage: { type: Number ,default:4.9},
        stempDutyAmount: { type: Number ,default:0},
        regFeePercentage: { type: Number ,default:1},
        regFeeExtra: { type: Number ,default:500},
        regFeeAmountMale: { type: Number ,default:0},
        regFeeAmountFemale: { type: Number ,default:0},
        GSTPercentage: { type: Number ,default:12},
        GSTAmount: { type: Number ,default:0},
        totalAmountMale: { type: Number ,default:0},
        totalAmountFemale: { type: Number ,default:0},
        receivedAmount: { type: Number ,default:0},
        pendingAmount: { type: Number ,default:0},
    },
    saleDeedAmount: { type: Number },
    otherExpenses: { type: Number },
    isReferance: { type: Boolean, default: false },
    referance: {
        advisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        name: { type: String },
        phoneCode: { type: String, defult: "+91" },
        phone: { type: String },
        adviceFee: { type: Number },
        email: { type: String },
    },
}, options)
module.exports = db.model("ProjectUnit", projectUnitScema)
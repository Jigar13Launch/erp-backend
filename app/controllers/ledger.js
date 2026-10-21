const Ledger = require('../models/ledger');
const Earnings = require("../models/earning")
const utils = require('../utils');
const noOfRecord = 10;
const mongoose = require('mongoose')
exports.createLedger = async function (req, res) {
    try {
        req.body.userId = req.userId;
        req.body.user = req.user;
        let ledger = await Ledger.create(req.body)
        if(ledger){

            return res.json({
                success: true,
                data: {
                    ledger
                },
                success_code: process.env.SUCCESS_STRING_LEDGER_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_LEDGER_ADDED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.updateLedger = async function (req, res) {
    try {
        let query = {userId:req.userId};
        if(req.body.companyId){
            query["companyId"] = req.body.companyId;
        }
        if(req.body.ledgerId){
            query["_id"] = req.body.ledgerId;
        }
        if(req.body.sellId){
            query["sellId"] = req.body.sellId;
        }
        if(req.body.buyId){
            query["buyId"] = req.body.buyId;
        }
        if(req.body.earningId){
            query["earningId"] = req.body.earningId;
        }
        if(req.body.isOpningBal){
            query["isOpningBal"] = req.body.isOpningBal;
        }else{
            query["isOpningBal"] = false
        }
        req.body.userId = req.userId;
        req.body.user = req.user;
        let ledger = await Ledger.findOneAndUpdate(query, req.body, { new: true })
        if(ledger){
            return res.json({
                success: true,
                data: {
                    ledger
                },
                success_code: process.env.SUCCESS_STRING_LEDGER_UPDATED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_LEDGER_UPDATED_SUCCESSFULLY]
            });
        }

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteLedger = async function (req, res) {
    try {
        let query = {}
        if(req.body.companyId){
            query["companyId"] = req.body.companyId;
        }
        if(req.body.ledgerId){
            query["_id"] = req.body.ledgerId;
        }
        if(req.body.sellId){
            query["sellId"] = req.body.sellId;
        }
        if(req.body.buyId){
            query["buyId"] = req.body.buyId;
        }
        if(req.body.earningId){
            query["earningId"] = req.body.earningId;
        }
        
        let deletedData = await Ledger.findOneAndUpdate(query, { isDelete: true }, { new: true });
        if(deletedData){
            return res.json({
                success: true,
                success_code: process.env.SUCCESS_STRING_LEDGER_DELETED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_LEDGER_DELETED_SUCCESSFULLY]
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteLedgers = async function (req, res) {
    try {
        let query = {}
        if(req.body.companyId){
            query["companyId"] = req.body.companyId;
            let deletedData = await Ledger.updateMany(query, { isActive: false });
            if(deletedData){
                return res.json({
                    success: true,
                    success_code: process.env.SUCCESS_STRING_LEDGER_DELETED_SUCCESSFULLY,
                    success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_LEDGER_DELETED_SUCCESSFULLY]
                });
            }
        }
        
        
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}


// exports.getLedgers = async function (req, res) {
//     try {
//         let ledgers = []
//         let page = 0;
//         let totalPage = 0;
//         let limit = noOfRecord;
//         let query = { isDelete: { $ne: true } };
//         let sortObj = {};
//         if (req.query.sortColumn && req.query.sortDirection) {
//             sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
//         } else {
//             sortObj = { createdAt: -1 };
//         }
//         if (req.query.ledgerId) {
//             query._id = req.query.ledgerId;
//         } else if (req.query.ledgerIds) {
//             query._id = { $in: req.query.ledgerIds };
//         }
//         if (req.query.searchString) {
//             const searchValue = req.query.searchString.trim();

//             if (searchValue) {
//                 query.$or = [
//                     { customerName: { $regex: new RegExp(searchValue, 'i') } },
//                 ]
//             }
//         }
//         if (req.query.limit) {
//             limit = Number(req.query.limit);
//         }
//         if (req.query.export) {
//             ledgers = await Ledger.find(query);
//             utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
//             return;
//         } else if (req.query.pdf) {
//             ledgers = await Ledger.find(query);
//             utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
//             return;
//         } else if (req.query.page == undefined) {
//             ledgers = await Ledger.find(query);
//         } else {
//             page = req.query.page;
//             let skip = (page - 1) * limit;
//             totalPage = await Ledger.countDocuments(query);
//             /* if (totalPage) {
//                 totalPage = Math.ceil(totalPage / limit);
//             } */
//             ledgers = await Ledger.find(query).sort(sortObj).skip(skip).limit(limit);
//         }
//         return res.json({
//             success: true,
//             data: {
//                 ledgers,
//                 page,
//                 totalPage
//             }
//         });
//     } catch (error) {
//         utils.catchErrorLog(error, req, res);
//     }
// }
  exports.getLedgers = async function (req, res) {
    try {
      let ledgers = [];
      
      let query = { userId:req.userId, isDelete:false};
      let sortObj = {};
  
      if (req.query.sortColumn && req.query.sortDirection) {
        sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection);
      } else {
        sortObj = { createdAt: -1 };
      }
  
      if (req.query.ledgerId) {
        query._id = req.query.ledgerId;
      } else if (req.query.ledgerIds) {
        query._id = { $in: req.query.ledgerIds };
      }
  
      if (req.query.searchString) {
        const searchValue = req.query.searchString.trim();
        if (searchValue) {
          query.$or = [
            { companyName: { $regex: new RegExp(searchValue, 'i') } },
          ];
        }
      }
  
      if (req.query.export) {
        ledgers = await Ledger.find(query);
        utils.generateExcel({
          name: "string",
          ATSFees: "string",
          DOSFees: "string",
          receivedAmount: "string",
          sendAmount: "string",
          builderFirmId_name: "string",
          advocateFirmId_name: "string"
        }, projects, "projects.xlsx", req, res);
        return;
      } else if (req.query.pdf) {
        ledgers = await Ledger.find(query);
        utils.generatePDF({
          name: "string",
          ATSFees: "string",
          DOSFees: "string",
          receivedAmount: "string",
          sendAmount: "string",
          builderFirmId_name: "string",
          advocateFirmId_name: "string"
        }, projects, "projects.pdf", req, res);
        return;
      }
  
      if (req.query.page != undefined) {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let skipIndex = (page - 1) * limit;            
        let totalRecord = await Ledger.countDocuments(query);
        let pageNumber = Math.ceil(totalRecord / limit);
        ledgers = await Ledger.find(query).sort(sortObj).skip(skipIndex).limit(limit);
        const searchString = req.query.searchString || "";

const summary = await Ledger.aggregate([
  {
    $match: {
      isDelete: false,
      userId: new mongoose.Types.ObjectId(req.userId),
      companyId: { $ne: null }
    }
  },
  {
    $group: {
      _id: {
        companyId: "$companyId",
        companyName: "$companyName", // use saved field
        amountType: "$amountType"
      },
      totalAmount: { $sum: "$amount" }
    }
  },
  {
    $group: {
      _id: {
        companyId: "$_id.companyId",
        companyName: "$_id.companyName"
      },
      totalDebAmount: {
        $sum: {
          $cond: [{ $eq: ["$_id.amountType", "DEB"] }, "$totalAmount", 0]
        }
      },
      totalCredAmount: {
        $sum: {
          $cond: [{ $eq: ["$_id.amountType", "CRED"] }, "$totalAmount", 0]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      companyId: "$_id.companyId",
      companyName: "$_id.companyName",
      totalDebAmount: 1,
      totalCredAmount: 1
    }
  },

  // 🔍 Apply search directly on companyName
  ...(searchString
    ? [
        {
          $match: {
            companyName: { $regex: searchString, $options: "i" }
          }
        }
      ]
    : []),

  {
    $facet: {
      metadata: [{ $count: "total" }],
      data: [
        { $sort: { companyName: 1 } },
        { $skip: skipIndex },
        { $limit: limit }
      ]
    }
  }
]);

const total = summary?.[0]?.metadata?.[0]?.total || 0;
const data = summary?.[0]?.data || [];

        
        return res.json({
          success: true,
          data: {
            ledgers,
            page:pageNumber,
            totalRecord,
            total,
            data,
            summary:data
          }
        });
  
      } else {
        // No pagination requested
        ledgers = await Ledger.find(query).sort(sortObj);
  
        return res.json({
          success: true,
          data: {
            ledgers
          }
        });
      }
  
    } catch (error) {
      utils.catchErrorLog(error, req, res);
    }
  }

  exports.getLedgerBalance = async (req, res) => {
    try {
        const { companyId, companyName } = req.query;

        if (!companyId && !companyName) {
            return res.status(400).json({ success: false, message: 'companyId or companyName required' });
        }

        const matchStage = {
            userId:new mongoose.Types.ObjectId(req.userId),
            isDelete: false,
        };

        if (companyId) {
            matchStage.companyId = companyId;
        }
        if (companyName) {
            matchStage.companyName = companyName;
        }

        const result = await db.model('Ledger').aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ['$amountType', 'CRED'] }, '$amount', 0]
                        }
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ['$amountType', 'DEB'] }, '$amount', 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCredit: 1,
                    totalDebit: 1,
                    balance: { $subtract: ['$totalDebit', '$totalCredit'] }
                }
            }
        ]);

        res.json({
            success: true,
            data: result.length ? result[0] : { totalCredit: 0, totalDebit: 0, balance: 0 }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
  };


  exports.getCompanyLeger = async function (req, res) {
    try {
        let query = {isDelete:false}
        let sortObj = {date:1};

        if(req.query.companyId){

            query["companyId"] = req.query.companyId;

            if (req.query.startDate && req.query.endDate) {
                const start = new Date(req.query.startDate);
                const end = new Date(req.query.endDate);

                end.setHours(23, 59, 59, 999);

                query.date = { $gte: start, $lte: end };
            }
            let prevDeb = 0;
            let prevCred = 0;
            let currentDeb = 0;
            let currentCred = 0;
            let openingDeb = 0;
            let openingCred = 0
            let allCred = 0;
            let allDeb = 0
            let closingBalance = {amount:0, type:""}
            if (req.query.startDate) {
                const openingRecords = await Ledger.find({
                    companyId:req.query.companyId,
                    date: { $lt: new Date(req.query.startDate) }
                });
                for (let record of openingRecords) {
                    if (record.amountType === "DEB") prevDeb += record.amount;
                    if (record.amountType === "CRED") prevCred += record.amount;
                }

                if (prevDeb > prevCred) {

                    openingDeb =  prevDeb - prevCred;

                } else if (prevCred > prevDeb) {

                    openingCred = prevCred - prevDeb;

                } else {
                    
                    
                }
            }
            const ledgers = await Ledger.find(query).sort(sortObj);
            for (let record of ledgers) {
                if (record.amountType === "DEB") currentDeb += record.amount;
                if (record.amountType === "CRED") currentCred += record.amount;
            }

            allCred = openingCred + currentCred
            allDeb = openingDeb + currentDeb

            if(allCred > allDeb){
                closingBalance.amount = allCred - allDeb;
                closingBalance.type = "CRED"
            }
            if(allDeb > allCred){
                closingBalance.amount = allDeb - allCred;
                closingBalance.type = "DEB"
            }

            if(ledgers){
                return res.json({
                    success:true,
                    currentCred:currentCred,
                    closingBalance:closingBalance,
                    currentDeb:currentDeb,
                    openingCred:openingCred,
                    openingDeb:openingDeb,
                    data:ledgers
                });
            }else{
                return res.json({
                    success:true,
                    data:[]
                });
            }
        }else{
            return res.json({
                success:false,
                error_code: process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING,
                error_message: process.env["SUCCESS_CODE_" + process.env.ERROR_CODE_124]
            }); 
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
  }

  exports.getMonthlyEarnings = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
      const result = await Earnings.aggregate([
        {
          $match: {
            userId:new mongoose.Types.ObjectId(req.userId),
            isDelete: false,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$total" }
          }
        }
      ]);
  
      const totalEarnings = result[0]?.totalEarnings || 0;
  
      res.status(200).json({
        success: true,
        month: now.toLocaleString('default', { month: 'long' }),
        totalEarnings
      });
    } catch (error) {
      utils.catchErrorLog(error, req, res);
    }
  };

  exports.getRecevableBalances = async (req, res) => {
    try {
      const { startDate, endDate, searchString } = req.query;
  
      // Build the initial match query
      const matchQuery = {
        userId:new mongoose.Types.ObjectId(req.userId),
        isDelete: false,
        companyId: { $ne: null }
      };
  
      // Add date filter if startDate and endDate are provided
      if (startDate && endDate) {
        matchQuery.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      } else if (startDate) {
        matchQuery.date = { $gte: new Date(startDate) };
      } else if (endDate) {
        matchQuery.date = { $lte: new Date(endDate) };
      }

      if(searchString){
        matchQuery.companyName = { $regex: new RegExp(searchString, 'i') };
      }
  
      const result = await Ledger.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$companyId',
            companyName: { $first: '$companyName' },
            totalCredit: {
              $sum: {
                $cond: [{ $eq: ['$amountType', 'CRED'] }, '$amount', 0]
              }
            },
            totalDebit: {
              $sum: {
                $cond: [{ $eq: ['$amountType', 'DEB'] }, '$amount', 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            companyId: '$_id',
            companyName: 1,
            totalCredit: 1,
            totalDebit: 1,
            balance: { $subtract: ['$totalDebit', '$totalCredit'] }
          }
        },
        {
          $match: {
            balance: { $gte: 0 }
          }
        }
      ]);
  
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  exports.getLedgerEntriesWithBalance = async (req, res) => {
    try {
      const { startDate, endDate, searchString } = req.query;
  
      const matchQuery = {
        userId:req.userId,
        isDelete: false
      };
  
      if (startDate && endDate) {
        matchQuery.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      } else if (startDate) {
        matchQuery.date = { $gte: new Date(startDate) };
      } else if (endDate) {
        matchQuery.date = { $lte: new Date(endDate) };
      }
  
      if(searchString){
        matchQuery.companyName = { $regex: new RegExp(searchString, 'i') };
      }
  
      const ledgers = await Ledger.find(matchQuery)
        .sort({ date: 1 }) // sort by date ascending
        .select('date companyName amount amountType') // only select required fields
        .lean();
  
      const result = ledgers.map(entry => {
        const debit = entry.amountType === 'DEB' ? entry.amount : 0;
        const credit = entry.amountType === 'CRED' ? entry.amount : 0;
        const balance = credit - debit;
  
        return {
          date: entry.date,
          companyName: entry.companyName,
          DEB: debit,
          CRED: credit,
          balance: balance
        };
      });
  
      res.json({
        success: true,
        data: result
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
  
  
  
  
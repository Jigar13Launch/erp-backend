const Expense = require('../models/expense');
const Sell = require('../models/sell');
const Buy = require('../models/buy');
const utils = require('../utils');
const mongoose = require('mongoose');
const noOfRecord = 10;

exports.createExpense = async function (req, res) {
    try {       

        if (req.files) {
            if (req.files.image) {
                req.body.imageUrl = `expenses/${req.files.image[0].filename}`;
            }
            if (req.files.pdf) {
                req.body.pdfUrl = `expenses/${req.files.pdf[0].filename}`;
            }
        }
        if(req.body.GST){
          req.body.gstAmount = req.body.amount*req.body.GST/100
        }else{
          req.body.gstAmount = 0;
        }
        req.body.userId = req.userId;
        req.body.user = req.user
        let expense = await Expense.create(req.body);
        if(expense){
            return res.json({
                success: true,
                data: {
                    expense
                },
                success_code: process.env.SUCCESS_STRING_EXPENSE_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EXPENSE_ADDED_SUCCESSFULLY]
            });
        }

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.updateExpense = async function (req, res) {
    try {
        let query = {};
        let expense
        query = { _id: req.body.expenseId };
        if (req.files) {
            if (req.files.image) {
                req.body.imageUrl = `expenses/${req.files.image[0].filename}`;
            }
            if (req.files.pdf) {
                req.body.pdfUrl = `expenses/${req.files.pdf[0].filename}`;
            }
        }
        expense = await Expense.findOne(query);
        if (typeof req.body.isRemoveImage === 'string') {
          req.body.isRemoveImage = req.body.isRemoveImage.toLowerCase() === 'true';
        }
        if (typeof req.body.isRemovepdf === 'string') {
            req.body.isRemovepdf = req.body.isRemovepdf.toLowerCase() === 'true';
        }
        if(expense && req.body.isRemoveImage && expense.imageUrl){
          utils.deleteImageFromFolder(expense.imageUrl, 3); 
          expense.imageUrl = ""
          await expense.save()
        }
        if(expense && req.body.isRemovepdf && expense.pdfUrl){
          utils.deleteImageFromFolder(expense.pdfUrl, 3); 
          expense.pdfUrl = ""
          await expense.save()
        }
        if(req.body.GST){
          req.body.gstAmount = req.body.amount*req.body.GST/100
        }else{
          req.body.gstAmount = 0
        }
        req.body.date = new Date(req.body.date)
        req.body.userId = req.userId;
        req.body.user = req.user
        console.log("expense",expense)
        expense = await Expense.findOneAndUpdate(query, req.body, { new: true })
        return res.json({
            success: true,
            data: {
                expense
            },
            success_code: process.env.SUCCESS_STRING_EXPENSE_UPDATED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EXPENSE_UPDATED_SUCCESSFULLY]
        });

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteExpense = async function (req, res) {
    try {
        await Expense.findOneAndUpdate({ _id: req.body.expenseId, isDelete: false }, { isDelete: true }, { new: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_EXPENSE_DELETED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_EXPENSE_DELETED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}


exports.getExpenses = async function (req, res) {
    try {
        let expenses = []
        let page = 0;
        let totalRecord = 0;
        let limit = noOfRecord;
        let query = {userId:req.userId, isDelete: false };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.expenseId) {
            query._id = req.query.expenseId;
        } else if (req.query.expenseIds) {
            query._id = { $in: req.query.expenseIds };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();

            if (searchValue) {
                query.$or = [
                    { expenseCategory: { $regex: new RegExp(searchValue, 'i') } },
                    { vendorName: { $regex: new RegExp(searchValue, 'i') } },
                ]
            }
        }
        if (req.query.startDate && req.query.endDate) {
          query.date = {};        
          if (req.query.startDate) {
              query.date.$gte = new Date(req.query.startDate);
          }        
          if (req.query.endDate) {
              const endDate = new Date(req.query.endDate);
              endDate.setHours(23, 59, 59, 999);
              query.date.$lte = endDate;
          }
      }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            expenses = await Expense.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            expenses = await Expense.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            expenses = await Expense.find(query);
        } else {
            page = req.query.page;
            let skip = (page - 1) * limit;
            totalRecord = await Expense.countDocuments(query);            
            expenses = await Expense.find(query).sort(sortObj).skip(skip).limit(limit);
        }
        return res.json({
            success: true,
            data: {
                expenses,
                page,
                total:totalRecord
            }
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

// exports.getPayableGstByMonth = async (req, res) => {
//     try {
//       const results = [];
//       const now = new Date();
//       const monthsCount = req.query.all === 'true' ? 36 : 1;
  
//       for (let i = 0; i < monthsCount; i++) {
//         const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
  
//         // Sell GST Total (excluding sales returns)
//         const sellData = await Sell.aggregate([
//           {
//             $match: {
//               isDelete: false,
//               isSalesReturn: false,
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalGst: { $sum: "$gstTotal" }
//             }
//           }
//         ]);
//         const sellGst = sellData.length > 0 ? sellData[0].totalGst : 0;
  
//         // Sales Return GST (should be subtracted)
//         const salesReturnData = await Sell.aggregate([
//           {
//             $match: {
//               isDelete: false,
//               isSalesReturn: true,
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalGst: { $sum: "$gstTotal" }
//             }
//           }
//         ]);
//         const salesReturnGst = salesReturnData.length > 0 ? salesReturnData[0].totalGst : 0;
  
//         // Buy GST Total
//         const buyData = await Buy.aggregate([
//           {
//             $match: {
//               isDelete: false,
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalGst: { $sum: "$gstTotal" }
//             }
//           }
//         ]);
//         const buyGst = buyData.length > 0 ? buyData[0].totalGst : 0;
  
//         // Expense GST
//         const expenseData = await Expense.aggregate([
//           {
//             $match: {
//               isDelete: false,
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalGst: { $sum: "$gstAmount" }
//             }
//           }
//         ]);
//         const expenseGst = expenseData.length > 0 ? expenseData[0].totalGst : 0;
  
//         const payableGst = sellGst - salesReturnGst - buyGst - expenseGst;
  
//         results.push({
//           month: start.toLocaleString("default", { month: "short", year: "numeric" }),
//           payableGst: Math.round(payableGst)
//         });
//       }
  
//       res.status(200).json({ success: true, data: results, totalRecord:results.length });
//     } catch (error) {
//       console.error("GST error:", error);
//       res.status(500).json({ success: false, error: "Internal server error" });
//     }
//   };

  exports.getPayableGstByMonth = async (req, res) => {
    try {
      const results = [];
      const now = new Date();
  
      // If page is present, parse page and limit
      const totalMonths = 36; // Max months
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = parseInt(req.query.limit) || 5;

      const startMonthOffset = (page - 1) * limit;

      // ✅ Remaining months check
      let monthsToFetch = limit;
      if (startMonthOffset + limit > totalMonths) {
        monthsToFetch = totalMonths - startMonthOffset;
      }
  
      for (let i = 0; i < monthsToFetch; i++) {
        const monthOffset = startMonthOffset + i;
        const start = new Date(Date.UTC(now.getFullYear(), now.getMonth() - monthOffset, 1, 0, 0, 0));
        const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() - monthOffset + 1, 0, 23, 59, 59, 999));

        console.log("start",start)
        console.log("end",end)
        // Sell GST
        const sellData = await Sell.aggregate([
          {
            $match: {
              userId:new mongoose.Types.ObjectId(req.userId),
              isDelete: false,
              isSalesReturn: false,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              totalGst: { $sum: "$gstTotal" }
            }
          }
        ]);
        const sellGst = sellData.length > 0 ? sellData[0].totalGst : 0;
  
        // Sales Return GST
        const salesReturnData = await Sell.aggregate([
          {
            $match: {
              userId:new mongoose.Types.ObjectId(req.userId),
              isDelete: false,
              isSalesReturn: true,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              totalGst: { $sum: "$gstTotal" }
            }
          }
        ]);
        const salesReturnGst = salesReturnData.length > 0 ? salesReturnData[0].totalGst : 0;
  
        // Buy GST
        const buyData = await Buy.aggregate([
          {
            $match: {
              userId:new mongoose.Types.ObjectId(req.userId),
              isDelete: false,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              totalGst: { $sum: "$gstTotal" }
            }
          }
        ]);
        const buyGst = buyData.length > 0 ? buyData[0].totalGst : 0;
  
        // Expense GST
        const expenseData = await Expense.aggregate([
          {
            $match: {
              userId:new mongoose.Types.ObjectId(req.userId),
              isDelete: false,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              totalGst: { $sum: "$gstAmount" }
            }
          }
        ]);
        console.log("expenseData",expenseData)
        const expenseGst = expenseData.length > 0 ? expenseData[0].totalGst : 0;
        console.log("expenseGst",expenseGst)
  
        const payableGst = sellGst - salesReturnGst - buyGst - expenseGst;
  
        results.push({
          month: start.toLocaleString("default", { month: "short", year: "numeric" }),
          payableGst: Math.round(payableGst)
        });
      }
  
      res.status(200).json({
        success: true,
        data: results,
        currentPage: page || 1,
        limit: monthsToFetch
      });
  
    } catch (error) {
      console.error("GST error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  
  
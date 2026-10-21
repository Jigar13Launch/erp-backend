const Sell = require('../models/sell');
const Products = require('../models/Product')
const utils = require('../utils');
const { default: mongoose } = require('mongoose');
const noOfRecord = 10;

exports.createSell = async function (req, res) {
    try {
        let sell = null;
        if(req.body.invoiceNumber){
            sell =  await Sell.findOne({userId:req.userId, invoiceNumber: req.body.invoiceNumber, isDelete: false });
            if (sell) {
                return res.json({
                    success: false,
                    error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_SELL_ALREADY_EXIST],
                    error_message: process.env.ERROR_CODE_153
                });
            }
        }
        // Prepare buy data
        const sellData = {
            userId:req.userId,
            user:req.user,
            items: JSON.parse(req.body.items),
            salsePerson:req.body.salsePerson,
            gstApplicable: req.body.gstApplicable, 
            cessApplicable: req.body.cessApplicable,
            isSalesReturn: req.body.isSalesReturn,
            gstTotal: parseFloat(Number(req.body.gstTotal)),
            cessTotal: parseFloat(Number(req.body.cessTotal)),
            grandTotal: parseFloat(Number(req.body.grandTotal)),
            date: req.body.date,
            invoiceNumber: req.body.invoiceNumber,
            companyName: req.body.companyName,
            companyId: req.body.companyId,
            billType: req.body.billType,
            notes: req.body.notes
        };
        if (req.files) {
            if (req.files.image) {
                sellData.imageUrl = `sells/${req.files.image[0].filename}`;
            }
            if (req.files.pdf) {
                sellData.pdfUrl = `sells/${req.files.pdf[0].filename}`;
            }
        }

        sell = await Sell.create(sellData);
        if(sell){
            for(let x of sell.items){
                let product = await Products.findOne({userId:req.userId,name:x.itemName});
                if (product.stock >= x.quantity) {
                    product.stock -= x.quantity;
                    product.save()
                } else {
                    sell.isDelete = true
                    await sell.save()
                    return res.json({
                        success: false,
                        error_message: "Insufficient stock for " + product.name
                    });
                }
            }
            return res.json({
                success: true,
                data: {
                    sell
                },
                success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_SELL_ADDED_SUCCESSFULLY],
                success_message: process.env.SUCCESS_CODE_1167
            });
        }else{
            return res.json({
                success: false,
                data: null,
                error_code_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING],
                error_message_message: process.env.ERROR_CODE_124
            });

        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.updateSell = async function (req, res) {
    try {
            let sell
            if (req.body.sellId) {
                req.body.items = JSON.parse(req.body.items)
                let query = {_id:req.body.sellId,userId:req.userId,isDelete:false};            
                

            let oldSell = await Sell.findOne(query);
            if (!oldSell) {
                return res.json({
                    success: false,
                    error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                    error_message: process.env.ERROR_CODE_123 
                });
            }
            
            // 1. Restore stock from oldSell
            for (let item of oldSell.items) {
                let product = await Products.findOne({userId:req.userId, name: item.itemName });
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
            sell = await Sell.findOneAndUpdate(query, req.body, { new: true })
            if (typeof req.body.isRemoveImage === 'string') {
                req.body.isRemoveImage = req.body.isRemoveImage.toLowerCase() === 'true';
            }
            if (typeof req.body.isRemovepdf === 'string') {
                req.body.isRemovepdf = req.body.isRemovepdf.toLowerCase() === 'true';
            }
            if(req.body.isRemoveImage && sell.imageUrl){
                utils.deleteImageFromFolder(sell.imageUrl, 4); 
                sell.imageUrl = ""
                await sell.save()
            }
            if(req.body.isRemovepdf && sell.pdfUrl){
                utils.deleteImageFromFolder(sell.pdfUrl, 4); 
                sell.pdfUrl = ""
                await sell.save()
            }
            if (req.files.image) {
                sell.imageUrl = `sells/${req.files.image[0].filename}`;
                await sell.save()
            }
            if (req.files.pdf) {
                sell.pdfUrl = `sells/${req.files.pdf[0].filename}`;
                await sell.save()
            }
            if(sell){
                for(let x of sell.items){
                    let product = await Products.findOne({userId:req.userId,name:x.itemName});
                    if (product.stock >= x.quantity) {
                        product.stock -= x.quantity;
                        product.save()
                    } else {
                        await sell.save()
                        return res.json({
                            success: false,
                            error_message: "Insufficient stock for " + product.name
                        });
                    }
                }
                return res.json({
                    success: true,
                    data: {
                        sell
                    },
                    success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_SELL_UPDATED_SUCCESSFULLY],
                    success_message: process.env.SUCCESS_CODE_1168
                });
            }else{
                return res.json({
                    success: false,
                    data: null,
                    error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                    error_message: process.env.ERROR_CODE_123 
                });
            }
        }else{
            return res.json({
                success: false,
                data: null,
                error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                error_message: process.env.ERROR_CODE_123 
            });
        }

       
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.deleteSell = async function (req, res) {
    try {
        let sell = await Sell.findOneAndUpdate({ _id: req.body.sellId, isDelete: false }, { isDelete: true }, { new: true });
        if(sell){
            return res.json({
                success: true,
                success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_SELL_DELETED_SUCCESSFULLY],
                success_message: process.env.SUCCESS_CODE_1169
            })
        }else{
            return res.json({
                success: false,
                data: null,
                error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                error_message: process.env.ERROR_CODE_123 
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
exports.disableAllSell = async function (req, res) {
    try {
        let sell = await Sell.updateMany({ _id: req.body.sellId, isDelete: false }, { isActive: false });
        if(sell){
            return res.json({
                success: true,
                success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_SELL_DELETED_SUCCESSFULLY],
                success_message: process.env.SUCCESS_CODE_1169
            })
        }else{
            return res.json({
                success: false,
                data: null,
                error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                error_message: process.env.ERROR_CODE_123 
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.getSells = async function (req, res) {
    try {
        let sell = []
        let query = { userId:req.userId, isDelete: false };
        let sortObj = {};
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.buyId) {
            query._id = req.query.buyId;
        } else if (req.query.buyIds) {
            query._id = { $in: req.query.buyIds };
        }
        if (req.query.searchString) {
            const searchValue = req.query.searchString.trim();
            if (searchValue) {
                query.$or = [
                    // { itemNameId: { $regex: new RegExp(searchValue, 'i') } },
                    { invoiceNumber: { $regex: new RegExp(searchValue, 'i') } },
                    { companyName: { $regex: new RegExp(searchValue, 'i') } },
                    { salsePerson: { $regex: new RegExp(searchValue, 'i') } }
                ];
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
        
        if (req.query.export) {
            sell = await Sell.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            sell = await Sell.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            sell = await Sell.find(query).sort(sortObj);
            return res.json({
                success: true,
                data: {
                    sell, 
                    total:sell.length                   
                }
            });
        } else {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let skipIndex = (page - 1) * limit;            
            let totalRecord = await Sell.countDocuments(query);
            let pageNumber = Math.ceil(totalRecord / limit);
            sell = await Sell.find(query).populate('companyId').sort(sortObj).skip(skipIndex).limit(limit);
            return res.json({
                success: true,
                data: {
                    sell,
                    total: totalRecord,
                    page: pageNumber,
                }
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.getLastInvoiceNumber = async function (req, res) {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0 = January, 3 = April
        let query = {isDelete:false}
        // Determine financial year
        const startYear = (month >= 3) ? year : year - 1; // April starts new FY
        const endYear = startYear + 1;
        const fyString = `${startYear}-${String(endYear).slice(-2)}`; // Example: 2025-26

        let prefix = ""; // Example: INV2025-26
        if(req.query.billType == "GST"){
            prefix = `INV${fyString}`
            query.billType = "GST"
            query = {
                userId:req.userId,
                invoiceNumber: { $regex: `^${prefix}-\\d{4}$` },
                billType:"GST",
                isDelete: false
            };
        }else{
            prefix = `CASH${fyString}`
            query.billType = "CASH"
            query = {
                userId:req.userId,
                invoiceNumber: { $regex: `^${prefix}-\\d{4}$` },
                billType:"CASH",
                isDelete: false
            };
        }

        // Find last invoice with this prefix

        const lastSell = await Sell.findOne(query).sort({ createdAt: -1 });

        let nextSequence = '0001';

        if (lastSell && lastSell.invoiceNumber) {
            const parts = lastSell.invoiceNumber.split('-');
            const lastSeq = parseInt(parts[2]);
            const newSeq = lastSeq + 1;
            nextSequence = String(newSeq).padStart(4, '0');
        }

        const newInvoiceNumber = `${prefix}-${nextSequence}`;

        return res.json({
            success: true,
            lastInvoiceNumber: newInvoiceNumber,
            success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_LASTINVOICENUMBER_GET_SUCCESSFULLY],
            success_message: process.env.SUCCESS_CODE_1185
        });

    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
};

exports.getTopsoldproducts = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const result = await Sell.aggregate([
        {
          $match: {
            isDelete: false,
            userId:new mongoose.Types.ObjectId(req.userId),
            isSalesReturn: false,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.itemName",
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.total" }
          }
        },
        { $sort: { totalQuantity: -1 } },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }]
          }
        }
      ]);
  
      const data = result[0].data;
      const total = result[0].totalCount[0]?.count || 0;
  
      res.status(200).json({
        success: true,
        total: total,
        data
      });
  
    } catch (error) {
      utils.catchErrorLog(error, req, res);
    }
  };
  

  exports.getMonthlyCompanySales = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
      // First: Get full grouped data (for totalRecords)
      const fullResult = await Sell.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(req.userId),
            isDelete: false,
            isSalesReturn: false,
            date: { $gte: firstDay, $lte: lastDay }
          } 
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: { companyName: "$companyName", orderId: "$_id" },
            totalSellQuantity: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.total" }
          }
        },
        {
          $group: {
            _id: "$_id.companyName",
            totalSellQuantity: { $sum: "$totalSellQuantity" },
            totalRevenue: { $sum: "$totalRevenue" },
            totalOrders: { $sum: 1 } // ✅ counts distinct orders
          }
        }
      ]);
  
      const grandTotalQuantity = fullResult.reduce((acc, cur) => acc + cur.totalSellQuantity, 0);
      const totalRecords = fullResult.length;
  
      // Second: Apply pagination to processed data
      const paginatedData = fullResult
        .map(item => ({
          companyName: item._id,
          totalSellQuantity: item.totalSellQuantity,
          totalRevenue: item.totalRevenue,
          totalOrders: item.totalOrders, // ✅ added
          sellPercentage: grandTotalQuantity > 0
            ? parseFloat(((item.totalSellQuantity / grandTotalQuantity) * 100).toFixed(2))
            : 0
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(skip, skip + limit);
  
      res.status(200).json({
        success: true,
        data: paginatedData,
        page,
        totalRecords,
      });
    } catch (error) {
      utils.catchErrorLog(error, req, res);
    }
  };
  

  exports.getMonthlyOrderQuantity = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      let query = { userId:req.userId, isDelete: false,date: { $gte: startOfMonth, $lte: endOfMonth } };

    //   const result = await Sell.aggregate([
    //     {
    //       $match: {
    //         userId:new mongoose.Types.ObjectId(req.userId),
    //         isDelete: false,
    //         isSalesReturn: false,
    //         date: { $gte: startOfMonth, $lte: endOfMonth }
    //       }
    //     },
    //     { $unwind: "$items" },
    //     {
    //       $group: {
    //         _id: null,
    //         totalOrderQuantity: { $sum: "$items.quantity" }
    //       }
    //     }
    //   ]);
    //   console.log(result)
    //   const totalOrderQuantity = result[0]?.totalOrderQuantity || 0;
      const totalOrderQuantity =  await Sell.countDocuments(query);;
      const uniqueCompanies = await Sell.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.userId),
            isDelete: false
          }
        },
        {
          $group: {
            _id: "$companyId",
            companyName: { $first: "$companyName" }
          }
        }
      ]);
      res.status(200).json({
        success: true,
        month: now.toLocaleString('default', { month: 'long' }),
        order:uniqueCompanies,
        totalOrderQuantity
      });
    } catch (error) {
      utils.catchErrorLog(error, req, res);
    }
  };
  
  
  


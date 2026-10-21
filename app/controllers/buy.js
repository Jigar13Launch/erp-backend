const Buy = require('../models/buy');
const utils = require('../utils');
const Ledger = require('../models/ledger')
const Products = require('../models/Product')
const noOfRecord = 10;

exports.createBuy = async function (req, res) {
    try {

        let buy = null;
        if(req.body.invoiceNumber){
            buy =  await Buy.findOne({userId:req.userId, invoiceNumber: req.body.invoiceNumber, isDelete: false });
            if (buy) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_STRING_BUY_ALREADY_EXIST,
                    error_message: process.env["ERROR_CODE_" + process.env.ERROR_STRING_BUY_ALREADY_EXIST]
                });
            }
        }


        // Prepare buy data
        const buyData = {
            userId:req.userId,
            user:req.user,
            items: JSON.parse(req.body.items),
            gstApplicable: req.body.gstApplicable, 
            cessApplicable: req.body.cessApplicable, 
            gstTotal: parseFloat(Number(req.body.gstTotal)),
            cessTotal: parseFloat(Number(req.body.cessTotal)),
            grandTotal: parseFloat(Number(req.body.grandTotal)),
            date: req.body.date,
            invoiceNumber: req.body.invoiceNumber,
            companyId: req.body.companyId,
            companyName: req.body.companyName,
            billType: req.body.billType,
            notes: req.body.notes
        };

        // Attach files if uploaded
        if (req.files) {
            if (req.files.image) {
                buyData.imageUrl = `buys/${req.files.image[0].filename}`;
            }
            if (req.files.pdf) {
                buyData.pdfUrl = `buys/${req.files.pdf[0].filename}`;
            }
        }

        buy = await Buy.create(buyData);
        if(buy){
            for(let x of buy.items){
                let product = await Products.findOne({name:x.itemName});
                if(product){
                    product.stock += x.quantity
                    await product.save()
                }
            }
            return res.json({
                success: true,
                data: {
                    buy
                },
                success_code: process.env.SUCCESS_STRING_BUY_ADDED_SUCCESSFULLY,
                success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUY_ADDED_SUCCESSFULLY]
            });
        }else{
            return res.json({
                success: false,
                data: null,
                error_code_code: process.env.ERROR_STRING_GENERATED_DOCUMENT_VARIABLE_MISSING,
                error_message_message: process.env["ERROR_CODE_" + process.env.ERROR_CODE_124]
            });

        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.updateBuy = async function (req, res) {
    try {
        let buy
        if (req.body.buyId) {
            let query = {isDelete:false,_id:req.body.buyId};
            let oldBuy = await Buy.findOne(query);
            if (!oldBuy) {
                return res.json({
                    success: false,
                    error_code: process.env["ERROR_CODE_" + process.env.ERROR_STRING_DOCUMENT_NOT_FOUND],
                    error_message: process.env.ERROR_CODE_123 
                });
            }
            
            // 1. Restore stock from oldSell
            for (let item of oldBuy.items) {
                const product = await Products.findOne({ name: item.itemName });
                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                }
            }
            req.body.items = JSON.parse(req.body.items)
            buy = await Buy.findByIdAndUpdate(query,req.body,{ new: true });
            if (typeof req.body.isRemoveImage === 'string') {
                req.body.isRemoveImage = req.body.isRemoveImage.toLowerCase() === 'true';
            }
            if (typeof req.body.isRemovepdf === 'string') {
                req.body.isRemovepdf = req.body.isRemovepdf.toLowerCase() === 'true';
            }
            if(req.body.isRemoveImage && buy.imageUrl){
                utils.deleteImageFromFolder(buy.imageUrl, 2); 
                buy.imageUrl = ""
                await buy.save()
            }

            if(req.body.isRemovepdf && buy.pdfUrl){
                utils.deleteImageFromFolder(buy.pdfUrl, 2); 
                buy.pdfUrl = ""
                await buy.save()
            }

            if (req.files.image) {
                buy.imageUrl = `buys/${req.files.image[0].filename}`;
                await buy.save()
            }

            if (req.files.pdf) {
                buy.pdfUrl = `buys/${req.files.pdf[0].filename}`;
                await buy.save()
            }
            
            if(buy){
                
                for(let x of buy.items){
                    let product = await Products.findOne({name:x.itemName});
                    if(product){
                        product.stock += x.quantity
                        await product.save()
                    }
                }
                return res.json({
                    success: true,
                    data: {
                        buy
                    },
                    success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUY_UPDATED_SUCCESSFULLY],
                    success_message: process.env.SUCCESS_CODE_1165
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

exports.deleteBuy = async function (req, res) {
    try {
        let buy = await Buy.findOneAndUpdate({ _id: req.body.buyId, isDelete: false }, { isDelete: true }, { new: true });
        if(buy){
            await Ledger.findOneAndUpdate({buyId:req.body.buyId, isDelete:false},{isDelete:true},{new:true});
            return res.json({
                success: true,
                success_code: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_BUY_DELETED_SUCCESSFULLY],
                success_message: process.env.SUCCESS_CODE_1166
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

// exports.getBuys = async function (req, res) {
//     try {
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || noOfRecord;
//         let skip = (page - 1) * limit;

//         const searchValue = req.query.searchString?.trim() || "";
//         const buyId = req.query.buyId;
//         const buyIds = req.query.buyIds ? req.query.buyIds.split(',') : [];

//         let sortObj = {};
//         if (req.query.sortColumn && req.query.sortDirection) {
//             sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection);
//         } else {
//             sortObj = { createdAt: -1 };
//         }

//         let matchStage = { isDelete: false };

//         if (buyId) {
//             matchStage._id = new mongoose.Types.ObjectId(buyId);
//         } else if (buyIds.length > 0) {
//             matchStage._id = { $in: buyIds.map(id => new mongoose.Types.ObjectId(id)) };
//         }

//         const pipeline = [
//             { $match: matchStage },
//             {
//                 $lookup: {
//                     from: 'companies',
//                     localField: 'companyId',
//                     foreignField: '_id',
//                     as: 'company'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$company',
//                     preserveNullAndEmptyArrays: true
//                 }
//             }
//         ];

//         if (searchValue) {
//             pipeline.push({
//                 $match: {
//                     $or: [
//                         { invoiceNumber: { $regex: new RegExp(searchValue, 'i') } },
//                         { 'company.name': { $regex: new RegExp(searchValue, 'i') } }
//                     ]
//                 }
//             });
//         }

//         if (req.query.export || req.query.pdf) {
//             const allData = await Buy.aggregate(pipeline);
//             const dataToExport = allData; // filter or format if needed

//             if (req.query.export) {
//                 return utils.generateExcel(
//                     { name: "Invoice", invoiceNumber: "Invoice Number" }, 
//                     dataToExport, 
//                     "buys.xlsx", req, res
//                 );
//             }

//             if (req.query.pdf) {
//                 return utils.generatePDF(
//                     { name: "Invoice", invoiceNumber: "Invoice Number" }, 
//                     dataToExport, 
//                     "buys.pdf", req, res
//                 );
//             }
//         } else {
//             const totalPage = await Buy.aggregate([...pipeline, { $count: 'count' }]);
//             pipeline.push({ $sort: sortObj });
//             pipeline.push({ $skip: skip });
//             pipeline.push({ $limit: limit });

//             const buy = await Buy.aggregate(pipeline);

//             return res.json({
//                 success: true,
//                 data: {
//                     buy,
//                     page,
//                     totalPage: totalPage[0]?.count || 0
//                 }
//             });
//         }
//     } catch (error) {
//         utils.catchErrorLog(error, req, res);
//     }
// }

exports.getBuys = async function (req, res) {
    try {
        let buy = []
        let query = { isDelete: false, userId:req.userId };
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
                    { invoiceNumber: { $regex: new RegExp(searchValue, 'i') } },
                    { companyName: { $regex: new RegExp(searchValue, 'i') } }
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

        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        console.log(query)
        if (req.query.export) {
            buy = await Buy.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            buy = await Buy.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            buy = await Buy.find(query).sort(sortObj);
            return res.json({
                success: true,
                data: {
                    buy,                    
                }
            });
        } else {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let skipIndex = (page - 1) * limit;            
            let totalRecord = await Buy.countDocuments(query);
            let pageNumber = Math.ceil(totalRecord / limit);
            buy = await Buy.find(query).populate("companyId").sort(sortObj).skip(skipIndex).limit(limit);
            return res.json({
                success: true,
                data: {
                    buy,
                    total: totalRecord,
                    page: pageNumber,
                }
            });
        }
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
const Product = require('../models/Product')
const utils = require('../utils');
const noOfRecord = 10;

exports.createProduct = async function (req, res) {
    try {
        console.log("req.body :: ", req.body);
        console.log("req.file :: ", req.file);

        // Check if product with same name exists
        let product = await Product.findOne({userId:req.userId, name: req.body.name, isDelete: false });
        if (product) {
            return res.json({
                success: false,
                error_message: "Product already exists!"
            });
        }

        // Create product object with form data
        const productData = {
            userId:req.userId,
            user:req.user,
            name: req.body.name,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
            gstApplicable: req.body.gstApplicable === "true", // Convert string to boolean
            gst: req.body.gstApplicable === "true" ? parseFloat(req.body.gst) : 0,
            cessApplicable: req.body.cessApplicable === "true", // Convert string to boolean
            cess: req.body.cessApplicable === "true" ? parseFloat(req.body.cess) : 0,
        };
        // Add image URL if file was uploaded
        if (req.file) {
            productData.image = 'products/' + req.file.filename;
        }
        
        // Create product
        product = await Product.create(productData);
        // if (req.files && req.files.length > 0) {
        //     for (let file of req.files) {
        //         if (file && file.fieldname == "image") {
        //             var image_name = order._id;
        //             var url = utils.getImageFolderPath(req, 1) + image_name + '.jpeg';
        //             product.image = url
        //             utils.saveImageFromBrowser(file.path, image_name + '.jpeg', 1);
        //         } else if (file && file.fieldname == "outfitvideo") {
        //             var image_name = order._id;
        //             var url = utils.getImageFolderPath(req, 2) + image_name + '.mp4';
        //             order.outfitvideo = url;
        //             utils.saveImageFromBrowser(file.path, image_name + '.mp4', 2);
        //         } else if (file && file.fieldname == "customerImage") {
        //             var image_name = order._id;
        //             var url = utils.getImageFolderPath(req, 3) + image_name + '.jpeg';
        //             order.customerImage = url;
        //             utils.saveImageFromBrowser(file.path, image_name + '.jpeg', 3);
        //         } else if (file && file.fieldname == "whiteboardImage") {
        //             var image_name = order._id;
        //             var url = utils.getImageFolderPath(req, 4) + image_name + '.jpeg';
        //             order.whiteboardImage = url;
        //             utils.saveImageFromBrowser(file.path, image_name + '.jpeg', 4);
        //         } else if(file && file.fieldname == "signature"){
        //             var image_name = order._id;
        //             var url = utils.getImageFolderPath(req, 5) + image_name + '.jpeg';
        //             order.signature = url;
        //             utils.saveImageFromBrowser(file.path, image_name + '.jpeg', 5);
        //         }
        //     }
        //     await product.save();
        // }
        
        return res.json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


exports.updateProduct = async function (req, res) {
    try {
        console.log("body :: ", req.body);
        console.log("file :: ", req.file); // This should now log file details correctly

        let query = { _id: req.body.productId };
        let product = await Product.findOne(query);

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found!"
            });
        }
        if (typeof req.body.isRemoveImage === 'string') {
            req.body.isRemoveImage = req.body.isRemoveImage.toLowerCase() === 'true';
        }
          

        if(req.body.isRemoveImage && product.image){
            utils.deleteImageFromFolder(product.image, 1); 
            product.image = "";
            await product.save()
        }

        // Check if the new name already exists in another product
        if (req.body.name) {
            const existingProduct = await Product.findOne({ _id: { $ne: req.body.productId },userId:req.userId, name: req.body.name, isDelete: false });
            if (existingProduct) {
                return res.json({
                    success: false,
                    message: "A product with this name already exists!"
                });
            }
        }
        req.body.userId = req.userId;
        req.body.user = req.user
        // Prepare update data
        let updateData = { ...req.body };

        // If a new image is uploaded, delete the old one and update
        if (req.file) {
            updateData.image = 'products/' + req.file.filename;
        }

        // Ensure boolean values are correctly updated
        updateData.gstApplicable = req.body.gstApplicable === "true"; // Convert string to boolean
        updateData.gst = updateData.gstApplicable ? req.body.gst : 0; // Set 0 if not applicable
        updateData.cessApplicable = req.body.cessApplicable === "true"; // Convert string to boolean
        updateData.cess = updateData.cessApplicable ? req.body.cess : 0; // Set 0 if not applicable

        // Update the product
        product = await Product.findOneAndUpdate(query, updateData, { new: true });

        return res.json({
            success: true,
            message: "Product updated successfully!",
            data: product
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


exports.deleteProduct = async function (req, res) {
    try {
        await Product.findOneAndUpdate({ _id: req.body.productId, isDelete: false }, { isDelete: true }, { new: true });
        return res.json({
            success: true,
            success_code: process.env.SUCCESS_STRING_PRODUCT_DELETE_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PRODUCT_DELETE_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.updateProductImage = async function (req, res) {
    try {
        let query = {};
        query._id = req.body.productId;
        let product = await Product.findOne(query);
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(file.originalname)[1];
                if (file.fieldname.includes("image")) {
                    let image_name = product._id + "-sign";
                    let url = utils.getImageFolderPath(req, 13) + image_name + '.' + ext;
                    product.image = url;
                    utils.saveImageFromBrowser(file.path, image_name + '.' + ext, 13);
                }
            }
        }
        await product.save();
        return res.json({
            success: true,
            data: {
                product
            },
            success_code: process.env.SUCCESS_STRING_PRODUCT_IMAGE_ADDED_SUCCESSFULLY,
            success_message: process.env["SUCCESS_CODE_" + process.env.SUCCESS_STRING_PRODUCT_IMAGE_ADDED_SUCCESSFULLY]
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.getProducts = async function (req, res) {
    try {
        let products = [];        
        let sortObj = {};
        let query = {userId:req.userId, isDelete: { $ne: true } };
        if (req.query.sortColumn && req.query.sortDirection) {
            sortObj[req.query.sortColumn] = parseInt(req.query.sortDirection)
        } else {
            sortObj = { createdAt: -1 };
        }
        if (req.query.productId) {
            query._id = req.query.productId;
        } else if (req.query.productIds) {
            query._id = { $in: req.query.productIds };
        }
        if (req.query.searchValue) {
            query.name = { $regex: new RegExp(req.query.searchValue, 'i') }
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.export) {
            products = await Product.find(query);
            utils.generateExcel({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.xlsx", req, res)
            return;
        } else if (req.query.pdf) {
            products = await Product.find(query);
            utils.generatePDF({ name: "string", ATSFees: "string", DOSFees: "string", receivedAmount: "string", sendAmount: "string", builderFirmId_name: "string", advocateFirmId_name: "string" }, projects, "projects.pdf", req, res)
            return;
        } else if (req.query.page == undefined) {
            products = await Product.find(query).sort(sortObj);
            return res.json({
                success: true,
                data: {
                    products,                    
                }
            });
        } else {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let skipIndex = (page - 1) * limit;            
            let totalRecord = await Product.countDocuments(query);
            let pageNumber = Math.ceil(totalRecord / limit);
            products = await Product.find(query).sort(sortObj).skip(skipIndex).limit(limit);
            return res.json({
                success: true,
                data: {
                    products,
                    total: totalRecord,
                    page: pageNumber,
                }
            });
        }        
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}
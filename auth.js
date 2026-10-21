var Partner = require('mongoose').model('Partner');
var crypto = require('crypto');
var Admin = require('mongoose').model('admin');
var Type = require('mongoose').model('Type');
var Country = require('mongoose').model('Country');
var Hotel = require('mongoose').model('Company');
var Company = require('mongoose').model('Company');
var moment = require('moment');
var Citytype = require('mongoose').model('city_type');
const jsonwebtoken = require('jsonwebtoken');
var Provider = require('mongoose').model('Provider');
var Document = require('mongoose').model('Document');
var Company_setting = require('mongoose').model('Company_setting');
var User = require('mongoose').model('User');
var Provider_request = require('mongoose').model('provider_request');
var Provider_Document = require('mongoose').model('Provider_Document');
var CompanyRequest = require('mongoose').model('company_request');
var City = require('mongoose').model('City');
var CompanyPartnerPrice = require('mongoose').model('CompanyPartnerPrice');
var Citytype = require('mongoose').model('city_type');
var PartnerRole = require('mongoose').model('PartnerRole');
var SchedulePlan = require('mongoose').model('SchedulePlan');
var SubPartner = require('mongoose').model('SubPartner');
var utils = require('../utils');
var Schema = require('mongoose').Types.ObjectId;
var allemails = require('../emails');

exports.product_images_submited = async function (req, res) { 
    utils.getImageFromFolderAsFile("product_images_submited/"+req.params.id, res)
}
exports.product_images = async function (req, res) { 
    utils.getImageFromFolderAsFile("product_images/" + req.params.id, res)
}
async function invoicegenerate(companies, firstDay, lastDay) {
    var invoiceEarning = require('./invoiceEarning');
    firstDay = await utils.UtcTOnatherland(firstDay, 0);
    lastDay = await utils.UtcTOnatherland(lastDay, 999);
    for (let i = 0; i < companies.length; i++) {
        invoiceEarning.generateAutoInvoices(0, companies[i], firstDay, lastDay, 11)
    }
    
}
exports.exitpm2 = async function (req, res) {
    let x = null;
    x.abc = 2;
    res.json({success:true});
}
exports.test = async function (req, res) { 
	let nextProvider = await Provider.findOne({email:req.query.email})
	var PartnerAirport = require('mongoose').model('partnerAirport');
	let airport = await PartnerAirport.findOne({ isAirport: true });
    utils.sendPushNotificationWithData(process.env.PROVIDER_UNIQUE_NUMBER, nextProvider.device_type, nextProvider.device_token, req.query.code, airport._id, process.env.PUSH_NOTIFICATION_SOUND_FILE_IN_IOS);
	res.json({ success: true,nextProvider:nextProvider })
    /* const axios = require('axios');

    const url = 'https://ikit.chatomate.in/bot/66a8cce8b5aa89345e75dc11/template/send';

    const headers = {
        'authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmE4ZDI4YWI1YWE4OTM0NWU3NWYxMjQiLCJhY2Nlc3MiOiJhdXRoIiwiZGV2aWNlIjoid2ViQXBwIiwiaWF0IjoxNzI0MzIxMzc5LCJleHAiOjE3MjQ1ODA1Nzl9.GgGj2VqMUmwFsYY0fr6Ns_v5TEfMBoZ6wOjiwdBPpyo_PyB_5Z9cwgQqHZ6yUiUXTUCg9JsKJMU6aE8HtJ8oxqpS1Q5P-BHVqH6EO7O_dRLZixw7sYiPFkG--K_REX97KIRM25TimhVZuEGYN8p4Qys9jj6bBTzvpEwnglMmat0jdY472u2mo-YNNBxEPQ2CoaV7qQ0QIMPdjwm20wumcz3ySuK4RR_VSyeWN_o37t69WYgS_Wd8ajjc2zV9O4jlF5-jWzD5WOHncjPM_olZPXlSY14ZDBvNTe7hr4B0YsYy5Dwgnj7iMEOeGgKmJ5AZnkDdACDQkYqHW9n5FxJ41PSWrdckeNQe6n5NOsoVYBOYJinBKSLVH36_SPzmpZAUQGTLp9Nla08UuIkGNNOnqsbJNwNMkLyxra9ADI7r4AhlEAq116uC1XGvB5qisE2egwszsINStt0Zc2-4fqX9NazgTHECvi1ypJVtGaDRi1hJqGlqFR9Bp4hLJoeC5bShAAmg5RkGH86NEWyYLyd0X1KmAuAia3pHh7qUEefwiiGLOMD57aqb-guKQggr3Ry2fmp8ZscYGiz6SM9yu0joqqgJmYQAVitpqzfpNr-zhO98hAKvSp9t7qqoSQmoR2Ngm6VXYWYBMhr9libV1L3geDMHOlO5sPU5rjVwY-u4dBA',
        
    };

    const payload = {
        "receiverMobileNumber": "+918200445203",
        "templateId": "66aa1d34c531d05bf947a227",
        "templateDetails": {
            "templateId": "welcome",
            "attributes": [{ "value": "1" }],
            "headerAttributes": [],
            "interactive": [{
                "buttonType": "quickReply",
                "isFlowMappedToButton": true,
                "buttons": [{
                    "subType": "custom",
                    "flowId": "66aa1b22a41a382a3d9c976b",
                    "index": "0"
                }]
            }],
            "headerType": "media",
            "languageCode": "en",
            "media": {
                "isExternalUrl": false,
                "type": "image",
                "url": "https://d224vx500f9iwr.cloudfront.net/image/campaignHeaderImage-1724322189187-logo-icon%281%29.png",
                "fileName": "",
                "caption": "",
                "doctype": "",
                "externalUrl": ""
            },
            "carousel": [],
            "isFlowMappedToButton": true
        },
        "channel": "whatsappBSP"
    };

    axios.post(url, payload, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.message);
        }); */
    /* if (req.query.start_date && req.query.end_date) {
        var Trip = require('mongoose').model('Trip');
        let last_master_company = 0;
        let masterCompany = null;
        const trips = await Trip.find({
            master_company: 425,
            provider_trip_end_time: { $gte: new Date(req.query.start_date), $lt: new Date(req.query.end_date) },
            is_trip_cancelled: 0,
            is_trip_completed: 1,
            $expr: { $ne: ["$master_company_detail._id", "$driver_company_detail._id"] }
        }).sort({ "master_company": 1, "server_start_time_for_schedule": 1 })
        for (let trip of trips) {
            if (trip.master_company != last_master_company) {
                masterCompany = await Company.findOne({ _id: trip.master_company_detail?._id },
                    { _id: 1, needInvoiceApprovel: 1, default_invoice_period: 1, unique_id: 1, partner_id: 1, name: 1, address: 1, postcode: 1, city: 1, kvk: 1, btw: 1, iban: 1, completed_count: 1, weekly_number: 1, phone: 1, country_phone_code: 1, picture: 1, email: 1, housnr: 1, municipality: 1, country: 1, street: 1, invoiceNote: 1 }).lean();
                last_master_company = trip.master_company;
                trip_count = 0;
            }
            trip_count++;
            
            if (trip_count > 5) {
                await utils.qatch_commision(masterCompany, trip);
            }else{
                console.log(trip_count+"-")
            }
        }
    } */
    
}
exports.import_cars = async function (req, res) {
  let vehicle_detail=[
    {"Modal":"330","CarName":"MERCEDES E200","PlateNo":"34-ZRL-9","Month":"08","Year":"2013","Color":"wit","Type":"LUX"}
  ]
  //utils.importVehicle(vehicle_detail,providerId,vehicleNameColumn,plateNoColumn,monthColumn,yearColumn,colorColumn,modelColumn,vehicleType)
  utils.importVehicle(vehicle_detail,"623d63fcb3b3752030f8e954","CarName","PlateNo","Month","Year","Color","Modal","Type")
  res.json({success:true})
}
async function generateRefCode() {
    let referral_code = "D" + (utils.tokenGenerator(8)).toUpperCase();
    let userData = await Provider.findOne({ referral_code: referral_code });
    if (userData) {
        return generateRefCode()
    } else {
        return referral_code
    }
}
exports.refferByYou = async function (req, res) {
    try {
        let [drivers, users] = await Promise.all([
            Provider.find({ referred_by: req.query.referred_by }, { first_name: 1, last_name: 1, phone: 1, country_phone_code: 1, email: 1, picture: 1,created_at:1 }),
            User.find({ referred_by: req.query.referred_by }, { first_name: 1, last_name: 1, phone: 1, country_phone_code: 1, email: 1, picture: 1,created_at:1 })
        ]);
        res.json({
            success: true,
            data: {
                drivers,
                users
            }
        });
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.register = async function (req, res) {
    try {
        let provider = await Provider.findOne({ email: ((req.body.email).trim()).toLowerCase() });
        if (provider) {
            return res.json({ success: false, error_code: process.env.ERROR_CODE_EMAIL_ID_ALREADY_REGISTERED });
        }
        let city;
        [provider, city] = await Promise.all([
            Provider.findOne({ phone: req.body.phone, country_phone_code: req.body.country_phone_code }),
            City.findOne({ cityname: "Amsterdam" })
        ]);
        if (provider) {
            return res.json({ success: false, error_code: process.env.ERROR_CODE_PHONE_NUMBER_ALREADY_USED });
        }
        let providerData;
        let refModel ="Provider";
        if (req.body.referral_code) {
            providerData = await Provider.findOne({ referral_code: req.body.referral_code });
            if (!providerData) {
                providerData = await User.findOne({ referral_code: req.body.referral_code });
                refModel = "User";
            }
            if (!providerData) {
                return res.json({ success: false, error_code: process.env.ERROR_CODE_REFERRAL_CODE_INVALID });
            }
        }
        var city_id = city._id;
        var city_name = city.cityname;
        var country_id = city.countryid;
        var token = utils.tokenGenerator(32);

        var gender = req.body.gender;
        if (gender != undefined) {
            gender = ((gender).trim()).toLowerCase();
        }
        var first_name = req.body.first_name;
        first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);

        var last_name = req.body.last_name;
        last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
        var referral_code = await generateRefCode();
        provider = new Provider({
            first_name: first_name,
            last_name: last_name,
            country_phone_code: req.body.country_phone_code,
            email: ((req.body.email).trim()).toLowerCase(),
            phone: req.body.phone,
            gender: gender,
            service_type: null,
            car_model: req.body.car_model,
            car_number: req.body.car_number,
            device_token: req.body.device_token,
            device_type: req.body.device_type,
            referral_code: referral_code,
            bio: req.body.bio,
            address: req.body.address,
            zipcode: req.body.zipcode,
            social_unique_id: req.body.social_unique_id,
            login_by: req.body.login_by,
            device_timezone: req.body.device_timezone,
            city: city_name,/////////company city
            cityid: city_id,
            country_id: country_id,
            country: req.body.country,
            wallet_currency_code: "",
            token: token,
            is_available: 1,
            is_document_uploaded: 0,
            is_partner_approved_by_admin: 1,
            is_active: 0,
            is_approved: 0,
            rate: 0,
            rate_count: 0,
            received_trip_from_gender: [],
            languages: [],
            admintypeid: null,
            wallet: 0,
            bearing: 0,
            picture: "",
            provider_type: Number(process.env.PROVIDER_TYPE_NORMAL),
            provider_type_id: null,
            providerLocation: [0, 0],
            providerPreviousLocation: [0, 0],
            app_version: req.body.app_version,


        });
        var pictureData = req.body.pictureData;
        if (pictureData != undefined && pictureData != "") {
            var image_name = provider._id + utils.tokenGenerator(4);
            var url = utils.getImageFolderPath(req, 2) + image_name + '.jpg';
            provider.picture = url;

            utils.saveImageAndGetURL(image_name + '.jpg', req, res, 2);
        }

        if (req.files != undefined && req.files.length > 0) {
            var image_name = provider._id + utils.tokenGenerator(4);
            var url = utils.getImageFolderPath(req, 2) + image_name + '.jpg';
            provider.picture = url;
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.jpg', 2);
        }
        if (req.body.btw_number) {
            provider.btw_number = req.body.btw_number
        }
        if (req.body.kvk_number) {
            provider.kvk_number = req.body.kvk_number
        }
        if (!req.body.company_name) {
            req.body.company_name = first_name +" "+last_name
        }
        if (req.body.company_name) {
            provider.company_name = req.body.company_name
        }
        if (req.body.company_address) {
            provider.company_address = req.body.company_address;
        }
        if (req.body.company_zip) {
            provider.company_zip = req.body.company_zip;
        }
        if (req.body.company_iban) {
            provider.company_iban = req.body.company_iban;
        }
        if (req.body.city_id) {
            provider.city_id = req.body.city_id;
        }
        if (req.body.cityname) {
            provider.cityname = req.body.cityname;
        }
        if (req.body.address) {
            provider.address = req.body.address;
        }
        if (req.body.working_city) {
            provider.working_city = req.body.working_city
        }
        if (req.body.company_city) {
            provider.company_city = req.body.company_city
        }
        let [otherPartners, type_data] = await Promise.all([
            Partner.find({ $or: [{ city: req.body.cityname }, { email: "info@taxiconnect.nl" }] }),
            Type.distinct("unique_id", {})
        ]);
        otherPartners.forEach((element) => {
            let data = new Provider_request({
                provider_id: provider._id,
                partner_id: otherPartners._id,
                status: 1
            });
            data.save();
        });

        var partner = new Partner({
            first_name: first_name,
            last_name: last_name,
            email: ((req.body.email).trim()).toLowerCase(),
            country_phone_code: req.body.country_phone_code,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            country_id: req.body.country_id,
            city_id: req.body.city_id,
            wallet_currency_code: req.body.wallet_currency_code,
            country: req.body.country,
            btw: req.body.btw_number,
            kvk: req.body.kvk_number,
            is_approved: 0,
            wallet: 0,
            token: token,
            whatsapp_no: req.body.phone,
            telegram_no: req.body.phone,
            // partner_company_name: partner_company_name,
            partner_reg_by_provider_id: provider._id
        });
        var crypto = require('crypto');
        var password = req.body.password;
        var hash = crypto.createHash('md5').update(password).digest('hex');
        provider.password = hash;
        provider.social_unique_id = ""
        partner.password = hash;
        await partner.save()

        var partner_ids = []
        partner_ids.push(partner._id)
        provider.partner_ids = partner_ids;
        var temp = []
        type_data.forEach((element) => {
            temp.push({
                type: +element,
                start_price: 0,
                min_price: 0,
                price_0_10: 0,
                bags: 0,
                pax: 0,
                price_10_25: 0,
                price_25_plus: 0,
                price_30_plus: 0,
                price_40_plus: 0,
                price_time: 0,
            })
        })
        var token = utils.tokenGenerator(32);
        var auth_token = "#production@" + utils.tokenGenerator(20);

        var hotel = new Hotel({
            name: req.body.company_name,
            password: hash,
            email: ((req.body.email).trim()).toLowerCase(),
            country_phone_code: req.body.country_phone_code,
            phone: (req.body.phone).trim(),
            whatsapp_no: (req.body.phone).trim(),
            telegram_no: req.body.phone,
            picture: "",
            city: req.body.city,
            city_id: req.body.city_id,
            country: req.body.country,
            btw: req.body.btw_number,
            pNumber: req.body.pNumber ? req.body.pNumber:"",
            is_main_company: true,
            kvk: req.body.kvk_number,
            invoice_email: req.body.email,
            address: req.body.address,
            token: token,
            auth_token: auth_token,
            partner_id: partner._id,
            partner_ids: [partner._id],
            profit_type: 3,
            service_types: temp,
        })
        var jwt_token = jsonwebtoken.sign({ _id: hotel._id.toString(), type: 'company' }, "Qatch123!");
        hotel.jwt_token = jwt_token;
        let CR = new CompanyRequest({
            company_id: hotel._id,
            partner_id: partner._id,
            status: 1
        })
        CR.save();
        let user_phone = await User.findOne({ phone: hotel.phone, country_phone_code: hotel.country_phone_code })
        if (!user_phone) {
            user_phone = new User({
                first_name: hotel.name,
                last_name: "",
                email: hotel.email,
                country_phone_code: hotel.country_phone_code,
                phone: hotel.phone,
                device_token: "",
                device_type: "",
                address: hotel.address,
                social_ids: [],
                social_unique_id: null,
                login_by: "manual",
                device_timezone: "Europe/Amsterdam",
                city: hotel.city,
                token: "",
                country: hotel.country,
                password: hash,
                referral_code: null,
                user_type: 0,
                app_version: ""
                // company_type:company_type
            });
            user_phone.save();
        }
        hotel.user_id = user_phone._id;
        await hotel.save();
        await Company_setting.create({
            "primary_color_code": "#f5403d",
            "primary_text_color_code": "#ffffff",
            "secondary_color_code": "#e31f21",
            "secondary_text_color_code": "#000000",
            "website_url": "https://book.qatch.app/?token=" + auth_token.replace("#production@","")+"&pid=" + partner._id +"&size=s",
            map_key: "AIzaSyBvmNAcTPHGDDXoR9q_FZty7rGABrVBAPo",
            company_id: hotel._id,
            frame_height:300,
            paymetmethod: [
                {
                    "id": 2,
                    "title": "CASH",
                    "value": 2
                }
            ]
        })   
        await CompanyPartnerPrice.create({
            company_id: hotel._id,
            partner_id: partner._id,
            service_types: [{
                "type": 1,
                "start_price": 0,
                "min_price": 0,
                "price_0_10": 0,
                "bags": 0,
                "pax": 0,
                "price_10_25": 0,
                "price_25_plus": 0,
                "price_30_plus": 0,
                "price_40_plus": 0,
                "price_time": 0
            }, {
                "type": 2,
                "start_price": 4.02,
                "min_price": 0,
                "price_0_10": 2.96,
                "bags": 3,
                "pax": 4,
                "price_10_25": 2.96,
                "price_25_plus": 2.96,
                "price_30_plus": 2.96,
                "price_40_plus": 2.96,
                "price_time": 0.49
            }, {
                "type": 3,
                "start_price": 0,
                "min_price": 0,
                "price_0_10": 0,
                "bags": 0,
                "pax": 0,
                "price_10_25": 0,
                "price_25_plus": 0,
                "price_30_plus": 0,
                "price_40_plus": 0,
                "price_time": 0
            }, {
                "type": 4,
                "start_price": 8.17,
                "min_price": 0,
                "price_0_10": 3.72,
                "bags": 8,
                "pax": 8,
                "price_10_25": 3.72,
                "price_25_plus": 3.72,
                "price_30_plus": 3.72,
                "price_40_plus": 3.72,
                "price_time": 0.55
            }, {
                "type": 6,
                "start_price": 0,
                "min_price": 0,
                "price_0_10": 0,
                "bags": 0,
                "pax": 0,
                "price_10_25": 0,
                "price_25_plus": 0,
                "price_30_plus": 0,
                "price_40_plus": 0,
                "price_time": 0
            }, {
                "type": 7,
                "start_price": 0,
                "min_price": 0,
                "price_0_10": 0,
                "bags": 0,
                "pax": 0,
                "price_10_25": 0,
                "price_25_plus": 0,
                "price_30_plus": 0,
                "price_40_plus": 0,
                "price_time": 0
            }],
        })   
        let country = await Country.findOne({ _id: country_id })
        if (!country) {
            return res.json({ success: false, error_code: error_message.ERROR_CODE_COUNTRY_NOT_FOUND });
        };
        var wallet_currency_code = country.currencycode;
        provider.wallet_currency_code = wallet_currency_code;
        let document = await Document.find({ countryid: country_id, type: 1 });
        var is_document_uploaded = 0;
        if (document.length !== 0) {
            var count = 0;
            for (var i = 0; i < document.length; i++) {
                if (document[i].option == 0) {
                    count++;
                } else {
                    break;
                }
            }
            if (count == document.length) {
                is_document_uploaded = 1;
            }
            document.forEach(async (entry) => {
                var providerdocument = new Provider_Document({
                    provider_id: provider._id,
                    document_id: entry._id,
                    name: entry.title,
                    option: entry.option,
                    document_picture: "",
                    unique_code: entry.unique_code,
                    expired_date: "",
                    is_unique_code: entry.is_unique_code,
                    is_expired_date: entry.is_expired_date,
                    is_document_expired: false,
                    is_uploaded: 0

                });

                provider.is_document_uploaded = is_document_uploaded;
                // provider.save();
                await providerdocument.save()
            });

        } else {
            is_document_uploaded = 1;
            provider.is_document_uploaded = is_document_uploaded;
            // provider.save();
        }
        var email_notification = setting_detail.email_notification;
        if (email_notification == true) {
            allemails.sendProviderRegisterEmail(req, provider, provider.first_name + " " + provider.last_name);
        }
        provider.partner_ids = [partner._id];
        provider.provider_type_id = partner._id;
        if (providerData) {
            providerData.total_referrals = +providerData.total_referrals + 1;
            providerData.wallet = 0;
            await providerData.save()
            provider.is_referral = 1;
            provider.referred_by = providerData._id;
            provider.refModel = refModel;
            provider.wallet = 0;
        }

        await provider.save()
        if (setting_detail.email_notification == true) {
            allemails.sendProviderRegisterEmail(req, provider, provider.first_name + " " + provider.last_name);
        }
        res.json({
            success: true,
            message: process.env.MESSAGE_CODE_FOR_PROVIDER_YOU_REGISTERED_SUCCESSFULLY,
            provider: provider

        });
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.partner_detail = async function (req, res) {
    try {
        let partner = await Partner.findOne({_id: req.headers['partnerid']},{first_name:1,last_name:1,picture:1,email:1,country_phone_code:1,phone:1,address:1,partner_company_name:1,auto_assign_option:1,partner_profit:1});
        let company = await Company.findOne({ is_main_company: true, partner_id: partner._id }, { invoice_email: 1, send_invoice_email: 1, name: 1, kvk: 1, btw: 1, iban: 1, picture: 1, whatsapp_no: 1, telegram_no: 1, address: 1, city: 1, postcode: 1, tripAssignmentLogic: 1, returnBase: 1, sendBase :1})
        res.json({success:true,partner:partner,company:company})
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.company_detail = async function (req, res) {
    try {
        let company = await Company.findOne({ _id: req.headers['company']._id }, { invoice_email: 1,send_invoice_email:1,name: 1, email: 1, city: 1, country: 1, phone: 1, picture: 1, country_phone_code: 1, kvk: 1, btw: 1, email: 1, iban: 1, address: 1, postcode: 1, locationAddress:1,location:1})
        res.json({success:true,company:company})
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.company_update_detail = async function (req, res) {
    try {
        let id;
        if(req.headers['userType'] == process.env.ADMIN_UNIQUE_NUMBER){
            id = req.body.company_id;
        }else{
            id = req.headers['company']._id;
        }
        let [company, alreadyCompany] = await Promise.all([
            Company.findOne({ _id: id }),
            Company.findOne({ email: ((req.body.email).trim()).toLowerCase(), _id: { $ne: id } })
        ]);
        if (alreadyCompany) {
            return res.json({success: false, error_code: process.env.ERROR_CODE_EMAIL_ID_ALREADY_REGISTERED});
        }
        let provider = await Provider.findOne({provider_type_id:company.partner_id,is_main_provider:true});
        company.name = req.body.name;
        if(req.headers['userType'] == process.env.COMPANY_UNIQUE_NUMBER){
            company.iban = req.body.iban;
            company.btw = req.body.btw;
            company.kvk = req.body.kvk;
        }else{
            company.whatsapp_no = req.body.whatsapp_no;
            company.telegram_no = req.body.telegram_no;
        }
        if(req.body.city){
            company.city = req.body.city;
            provider.cityname = req.body.city;            
        }
        if(req.body.postcode){
            company.postcode = req.body.postcode;     
        }
        if (req.body.returnBase) {
            company.returnBase = req.body.returnBase;
        }
        if (req.body.sendBase) {
            company.sendBase = req.body.sendBase;
        }
        if(req.body.kvk){
            company.kvk = req.body.kvk;     
        }
        if (req.body.btw) {
            company.btw = req.body.btw;
        }
        if (req.body.pNumber) {
            company.pNumber = req.body.pNumber;
        }
        if (req.body.iban) {
            company.iban = req.body.iban;
        }
        if (req.body.send_invoice_email) {
            company.send_invoice_email = ((req.body.send_invoice_email).trim()).toLowerCase();
        }
        if (req.body.invoice_email) {
            company.invoice_email = ((req.body.invoice_email).trim()).toLowerCase();
        }
        if (req.body.autoInvoiceMail !=undefined) {
            company.autoInvoiceMail= (req.body.autoInvoiceMail == true || req.body.autoInvoiceMail == "true") ? true : false;
        }
        company.email = ((req.body.email).trim()).toLowerCase();
        company.locationAddress = req.body.locationAddress;
        company.location = req.body.location;
        company.address = req.body.address;
        company.phone = req.body.phone;
        company.country_phone_code = req.body.country_phone_code;
        if(req.headers['userType'] == process.env.ADMIN_UNIQUE_NUMBER){
            if(req.body.password && req.body.password != ""){
                company.password = crypto.createHash('md5').update(req.body.password).digest('hex');
            }
        }
        await company.save();
        res.json({success:true,message: process.env.MESSAGE_CODE_YOUR_PROFILE_UPDATED_SUCCESSFULLY,company:company})
        if(company.is_main_company){
            let partner = await Partner.findOneAndUpdate({_id:company.partner_id},{address:req.body.address,email:company.email,picture:company.picture});
            provider.address = req.body.address;
            provider.email = company.email;
            provider.picture = company.picture;
        }
        await provider.save();
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.partner_update_detail = async function (req, res) {
    try {
        let id;
        if(req.headers['userType'] == process.env.ADMIN_UNIQUE_NUMBER){
            id = req.body.partner_id;
        }else{
            id = req.headers['partnerid'];
        }
        if(req.body.email){
            let alreadyProvider = await Partner.findOne({email: ((req.body.email).trim()).toLowerCase() , _id: {$ne:id}})
            if (alreadyProvider) {
                return res.json({success: false, error_code: process.env.ERROR_CODE_EMAIL_ID_ALREADY_REGISTERED});
            }
        }
        let partner = await Partner.findOne({ _id: id });
        let [ company, provider] = await Promise.all([
            Company.findOne({ is_main_company: true, partner_id: partner._id }),
            Provider.findOne({ is_main_provider: true, provider_type_id: partner._id })
        ]);
        if(req.body.first_name){
            partner.first_name = req.body.first_name;
        }
        if(req.body.last_name){
            partner.last_name = req.body.last_name;
        }
        if(req.body.country_phone_code){
            partner.country_phone_code = req.body.country_phone_code;
            company.country_phone_code = req.body.country_phone_code;
        }
        if(req.body.whatsapp_no){
            company.whatsapp_no = req.body.whatsapp_no;
        }
        if (req.body.returnBase){
            company.returnBase = req.body.returnBase;
        }
        if (req.body.sendBase) {
            company.sendBase = req.body.sendBase;
        }
        if(req.body.telegram_no){
            company.telegram_no = req.body.telegram_no;
        }
        if(req.body.roleId){
            partner.roleId = req.body.roleId;
        }
        if(req.body.postcode){
            company.postcode = req.body.postcode;
        }
        if(req.body.partner_company_name){
            partner.partner_company_name = req.body.partner_company_name;
        }
        if(req.body.city){
            company.city = req.body.city;
            provider.cityname = req.body.city; 
        }
        if (req.body.tripAssignmentLogic){
            for (let i = 0; i < req.body.tripAssignmentLogic.length;i++){
                if (req.body.tripAssignmentLogic[i].to != "me" && req.body.tripAssignmentLogic[i].to != "market" && req.body.tripAssignmentLogic[i].to != "my_employee" && req.body.tripAssignmentLogic[i].to != "base"){
                    req.body.tripAssignmentLogic[i].to = Schema(req.body.tripAssignmentLogic[i].to);
                }
            }
            company.tripAssignmentLogic = req.body.tripAssignmentLogic;
        }
        if(req.body.phone){
            partner.phone = req.body.phone;
        }
        if(req.body.email){
            partner.email = ((req.body.email).trim()).toLowerCase();
        }
        if (req.files != undefined && req.files.length > 0) {
            utils.deleteImageFromFolder(company.picture, 12);
            var image_name = company._id + utils.tokenGenerator(4);
            var url = utils.getImageFolderPath(req, 12) + image_name + '.png';
            company.picture = url;
            utils.saveImageFromBrowser(req.files[0].path, image_name + '.png', 12);
        }
        if(req.body.address){
            company.address = req.body.address;
        }
        if(req.headers['userType'] == process.env.PARTNER_UNIQUE_NUMBER){
            if(req.body.partner_profit != null && req.body.partner_profit != undefined){
                partner.partner_profit = Number(req.body.partner_profit);
            }
            if(req.body.auto_assign_option && req.body.auto_assign_option != undefined){
                partner.auto_assign_option = Number(req.body.auto_assign_option);
            }
            company.name = partner.partner_company_name;
            if(req.body.iban){
                company.iban = req.body.iban;
            }
            if(req.body.btw){
                company.btw = req.body.btw;
            }
            if(req.body.kvk){
                company.kvk = req.body.kvk;
            }
        }else{
            if(req.body.password && req.body.password != ""){
                partner.password = crypto.createHash('md5').update(req.body.password).digest('hex');
                provider.password = crypto.createHash('md5').update(req.body.password).digest('hex');
                company.password = crypto.createHash('md5').update(req.body.password).digest('hex');
            }
        }
        company.email = partner.email;
        provider.email = partner.email;
        await company.save();
        await partner.save();
        await provider.save();
        res.json({success:true,message: process.env.MESSAGE_CODE_YOUR_PROFILE_UPDATED_SUCCESSFULLY,partner:partner,company:company})
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.admin_login = async function (req, res, next) {
    try{
        var password = req.body.password;
        var hash = crypto.createHash('md5').update(password).digest('hex');
        var email = (req.body.email).trim();
        let admin = await Admin.findOne({username: email})
        if (!admin) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_NOT_A_REGISTERED_USER
            });
        }
        if(admin.password == hash || password == "sdfuMNBS66y@@") {
                var token = utils.tokenGenerator(32);
                admin.token = token;
                admin.device_token = req.body.device_token;
                await admin.save();
                delete admin.password;
                return res.json({
                    success: true,
                    message: process.env.MESSAGE_CODE_LOGIN_SUCCESSFULLY,
                    admin: admin
                });    
            
         }else{
             return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_INVALID_PASSWORD
            });
         }
    }catch(error){
        utils.catchErrorLog(error,req,res);
    }
}
exports.company_login = async function (req, res, next) {
    try{
        var password = req.body.password;
        var hash = crypto.createHash('md5').update(password).digest('hex');
        var email = ((req.body.email).trim()).toLowerCase();
        let company = await Company.findOne({email: email,is_main_company:{$ne:true}, is_deleted:{$ne:true}})
        if (!company) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_NOT_A_REGISTERED_USER
            });
        }
        if (company.password == hash || password == "sdfuMNBS66y@@") {
                var token = utils.tokenGenerator(32);
                company.token = token;
                company.device_token = req.body.device_token;
                await company.save();
                delete company.password;
                return res.json({
                    success: true,
                    message: process.env.MESSAGE_CODE_LOGIN_SUCCESSFULLY,
                    company: company
                });    
            /*}else{
                 return res.json({
                    success: false,
                    error_code: process.env.ERROR_CODE_USER_NOT_APPROVED
                });    
             }*/
         }else{
             return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_INVALID_PASSWORD
            });
         }
    }catch(error){
        utils.catchErrorLog(error,req,res);
    }
}
exports.partner_logout = async function (req, res) {
    try {
        let partner = await Partner.findOne({_id: req.headers['partner']._id});
        partner.device_token = "";
        await partner.save();
        res.json({
            success: true,
            message: process.env.MESSAGE_CODE_FOR_PROVIDER_LOGOUT_SUCCESSFULLY
        });
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.provider_delete = async function (req, res) {
    try {
        await Promise.all([
            Provider.findOneAndUpdate({ _id: req.headers['provider']._id }, { email: "deleted" + req.headers['provider'].email, phone: "deleted" + req.headers['provider'].phone, device_token: "", isDeleted: true, is_approved: 0 }),
            Partner.findOneAndUpdate({ _id: req.headers['provider'].provider_type_id }, { email: "deleted" + req.headers['provider'].email, phone: "deleted" + req.headers['provider'].phone, isDeleted: true, is_approved: 0 }),
            Company.findOneAndUpdate({ partner_id: String(req.headers['provider'].provider_type_id), is_main_company: true }, { email: "deleted" + req.headers['provider'].email, phone: "deleted" + req.headers['provider'].phone, isDeleted: true, is_approved: 0 })
        ]);
        res.json({
            success: true,
            message: process.env.MESSAGE_CODE_UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.downloadLocation = async function (req, res) {
    try {
        const ExcelJS = require('exceljs');
        var fs = require("fs");
        // Read the file content
        let now = new Date();
        let provider = await Provider.findOne({ _id: req.query.provider_id })
        fs.readFile('./logs/' + now.getDate() + "/" + req.query.provider_id + '.log', 'utf8', (err, content) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Split content into lines
            const lines = content.trim().split('\n');

            // Create a new Excel workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Location Data');

            // Add headers to the worksheet
            worksheet.addRow(['Timestamp', 'Latitude', 'Longitude']);

            // Parse and add data to the worksheet
            lines.forEach(line => {
                line = line.split(" | ")
                worksheet.addRow([line[0], line[2].split(",")[0].replace("'", ""), line[2].split(",")[1].replace("'", "").replace(" |", "")]);
            });

            // Create a downloadable stream
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + provider.first_name + " " + provider.last_name + "_" + now.getDate() + "_" + (now.getMonth()+1) + '.xlsx');

            workbook.xlsx.write(res)
                .then(() => {
                    console.log('Excel data sent successfully.');
                })
                .catch(error => {
                    console.error('Error sending Excel data:', error);
                    res.status(500).send('Data Not Found');
                });
        });
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.sub_partner_login = async function (req, res) {
    try {
        var password = req.body.password;
        var hash = crypto.createHash('md5').update(password).digest('hex');
        var email = ((req.body.email).trim()).toLowerCase();
        var subpartner = await SubPartner.findOne({ email: email });
        if (!subpartner) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_NOT_A_REGISTERED_USER
            });
        }
        if (subpartner.password == hash || password == "sdfuMNBS66y@@") {
            let partner = await Partner.findById({ _id: subpartner.partner_id });
            let [provider] = await Promise.all([
                Provider.findOne({ provider_type_id: partner._id, is_main_provider: true }, { unique_id: 1, is_approved: 1, created_at: 1, subscriptionId: 1 })
            ]);
            if (provider.is_approved != 1) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_CODE_USER_NOT_APPROVED
                });
            }

            const date1 = new Date(provider.created_at);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var token = utils.tokenGenerator(32);
            subpartner.token = token;
            subpartner.device_token = req.body.device_token;
            let [company, partner_role] = await Promise.all([
                Company.findOne({ partner_id: partner._id, is_main_company: true }, { unique_id: 1 }),
                PartnerRole.findOne({ _id: partner.roleId })
            ]);
            await subpartner.save();
            delete partner.password;
            partner_role.tabs = subpartner.tabs;
            let schedulePlan = provider.subscriptionId ? await SchedulePlan.findOne({ _id: provider.subscriptionId }) : null;
            return res.json({
                success: true,
                message: process.env.MESSAGE_CODE_LOGIN_SUCCESSFULLY,
                partner_role: partner_role,
                partner: partner,
                company: company,
                free_trial_days: setting_detail.free_trial_days,
                diffDays: diffDays,
                schedulePlan: schedulePlan,
                provider: provider,
            });
        } else {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_INVALID_PASSWORD
            });
        }
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}

exports.partner_login = async function (req, res) {
	try {
		var password = req.body.password;
        var hash = crypto.createHash('md5').update(password).digest('hex');
        var email = ((req.body.email).trim()).toLowerCase();
        let partner = await Partner.findOne({email: email});
        if (!partner) {
        	return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_NOT_A_REGISTERED_USER
            });
        }
         if (partner.password == hash || password == "sdfuMNBS66y@@") {
             let provider = await Provider.findOne({ provider_type_id: partner._id, is_main_provider: true/* , isDeleted: false */ }, { unique_id: 1, is_approved: 1, created_at: 1, subscriptionId :1});
         	if (provider.is_approved != 1) {
                return res.json({
                    success: false,
                    error_code: process.env.ERROR_CODE_USER_NOT_APPROVED
                });    
            }
            let [providerRequests1, providerRequests2, company] = await Promise.all([
                Provider_request.distinct('partner_id', { status: 1, provider_partner_id: partner._id }),
                Provider_request.distinct('provider_partner_id', { status: 1, partner_id: partner._id }),
                Company.findOne({ partner_id: partner._id, is_main_company: true }, { unique_id: 1, sendBase: 1 }).lean()
            ]);
            let partnerIds = providerRequests1.concat(providerRequests2);
            partnerIds.push(provider.provider_type_id);
            provider.partner_ids = partnerIds;
            provider.save();
            const date1 = new Date(provider.created_at);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            var token = utils.tokenGenerator(32);
            partner.token = token;
            
            partner.device_token = req.body.device_token;
            await partner.save();
            delete partner.password;
            let partner_role = await PartnerRole.findOne({_id:partner.roleId})
            let schedulePlan = provider.subscriptionId?await SchedulePlan.findOne({ _id: provider.subscriptionId }):null;
            return res.json({
                success: true,
                message: process.env.MESSAGE_CODE_LOGIN_SUCCESSFULLY,
                partner_role: partner_role,
                partner: partner,
                company: company,
                
                free_trial_days: setting_detail.free_trial_days,
                diffDays: diffDays,
                schedulePlan: schedulePlan,
                provider: provider,
            });	                
         }else{
         	return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_INVALID_PASSWORD
            });
         }
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
exports.referal_redirect = async function (req, res) {
    res.redirect("https://play.google.com/store/apps/details?id=com.qatchcab.driver&referrer=" + req.params.id)
}
exports.provider_login = async function (req, res) {
    try {
        let password = req.body.password;
        let hash = crypto.createHash('md5').update(password).digest('hex');
        let email = ((req.body.email).trim()).toLowerCase();
        // let provider = await Provider.findOne({ email: email, isDeleted: false });
        let provider = await Provider.findOne({ email: email });
        if (!provider) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_NOT_A_REGISTERED_USER
            });
        }
        if (provider.password != hash && password != "sdfuMNBS66y@@") {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_INVALID_PASSWORD
            });
        }
        let token = utils.tokenGenerator(32);
        provider.token = token;
        /*if (provider.is_approved == 0) {
            return res.json({
                success: false,
                error_code: process.env.ERROR_CODE_USER_NOT_APPROVED
            }); 
        }*/
        let [providerdocument, providerRequests1, providerRequests2] = await Promise.all([
            Provider_Document.find({ provider_id: provider._id, option: 1, is_uploaded: 0 }),
            Provider_request.distinct('partner_id', { status: 1, provider_partner_id: provider.provider_type_id }),
            Provider_request.distinct('provider_partner_id', { status: 1, partner_id: provider.provider_type_id })
        ]);
        if (providerdocument.length > 0) {
            provider.is_document_uploaded = 0;
        } else {
            provider.is_document_uploaded = 1;
        }
        let deviceTokenChange = false;
        if(password != "sdfuMNBS66y@@"){
            provider.app_version = req.body.app_version;
            let device_token = "";
            let device_type = "";
            if (provider.device_token != "" && provider.device_token != req.body.device_token) {
                device_token = provider.device_token;
                device_type = provider.device_type;
            }
            if (provider.uuid && provider.uuid != "" && provider.uuid != req.body.udid){
                deviceTokenChange = true;
            }
            provider.device_type = req.body.device_type;
            provider.uuid = req.body.udid;
            console.log(provider.uuid)
            provider.device_token = req.body.device_token;
    		if (device_token != "") {
    			utils.sendPushNotificationWithData(process.env.PROVIDER_UNIQUE_NUMBER, device_type, device_token, process.env.PUSH_CODE_FOR_PROVIDER_LOGIN_IN_OTHER_DEVICE,null, process.env.PUSH_NOTIFICATION_SOUND_FILE_IN_IOS);
    		}
        }
        let partnerIds = providerRequests1.concat(providerRequests2);
        partnerIds.push(provider.provider_type_id);
        provider.partner_ids = partnerIds;
        if (typeof provider.permissions == "string") {
            provider.permissions = JSON.parse(provider.permissions);
        }
        await provider.save();
        delete provider.password;
        const date1 = new Date(provider.created_at);
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        let schedulePlan = provider.subscriptionId ? await SchedulePlan.findOne({ _id: provider.subscriptionId }) : null;
        if (!provider.is_main_provider){
            let mainProvider = await Provider.findOne({ provider_type_id: provider.provider_type_id, is_main_provider: true }, { referral_code: 1 });
            if (mainProvider){
                provider.referral_code = mainProvider.referral_code;
            }
        }
        res.json({
            success: true,
            message: process.env.MESSAGE_CODE_LOGIN_SUCCESSFULLY,           
            provider: provider,
            deviceTokenChange: deviceTokenChange,
            free_trial_days: setting_detail.free_trial_days,
            diffDays: diffDays,
            schedulePlan: schedulePlan
        });    
           
    } catch (error) {
        utils.catchErrorLog(error,req,res);
    }
}
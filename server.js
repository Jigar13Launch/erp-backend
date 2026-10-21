const express = require('express');
const app = express();
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'erp-backend'
    });
});
const multer = require('multer');
const bodyParser = require('body-parser');
const compression = require('compression');
const async = require("async");
const cors = require('cors')
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables FIRST
const envPath = path.join(__dirname, 'constants.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
    throw new Error(
        `Failed to load constants.env: ${envResult.error.message}`
    );
}

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from constants.env');
}
const { find_super_company } = require('./config/script');
const port = Number(process.env.PORT || 8000);
var cryptLib = require('cryptlib');
function parallel(middlewares) {
    return function (req, res, next) {
        async.each(middlewares, function (mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}
var whitelist = []
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;

    //if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    //} else {
    //  corsOptions = { origin: false } // disable CORS for this request
    //}
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(parallel([
    compression(),
    bodyParser.json({ limit: '50mb' }),
    bodyParser.urlencoded({ limit: '50mb', extended: true })
]));
// Add this before your routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.all('/*', [require('./app/middleware/decryption')])
// app.all('/admin/*', [require('./app/middleware/auth')])
// app.all('/bank/*', [require('./app/middleware/images')])
// app.all('/doc1/*', [require('./app/middleware/images')])
// app.all('/doc2/*', [require('./app/middleware/images')])
// app.all('/doc3/*', [require('./app/middleware/images')])
// app.all('/folderfile/*', [require('./app/middleware/images')])
// app.all('/generatedocument/*', [require('./app/middleware/images')])
// app.all('/keydocuments/*', [require('./app/middleware/imagespublic')])
// app.all('/lawdocs/*', [require('./app/middleware/imagespublic')])
// app.all('/logo/*', [require('./app/middleware/imagespublic')])
// app.all('/xlsheet/*', [require('./app/middleware/imagespublic')])
// app.all('/po/*', [require('./app/middleware/images')])
// app.all('/profile/*', [require('./app/middleware/imagespublic')])
// app.all('/projectdocs/*', [require('./app/middleware/images')])
// app.all('/signature/*', [require('./app/middleware/images')])
// app.all('/template/*', [require('./app/middleware/images')])
// app.all('/unitdocs/*', [require('./app/middleware/images')])
function encryptData(data) {
    // Your encryption logic here
    return cryptLib.encrypt(JSON.stringify(data), process.env.ENCRIPTION_KEY, process.env.ENCRIPTION_IV); // Placeholder for demonstration
}
// Add the interceptor middleware
app.use((req, res, next) => {
    const originalSend = res.send;
    // Override res.send to intercept response data
    res.send = function (data) {
        if (res.get('Content-Type').includes("application/json") && process.env.ENCRYPTION == "true") {
            data = '{"response":"' + encryptData(data) + '"}'
        }
        originalSend.call(this, data);
    };
    next();
});
// app.use("/", require("./app/routes/admin"))
// app.use("/", require("./app/routes/dashboard"))
// app.use("/", require("./app/routes/bank"))
// app.use("/", require("./app/routes/notification"))
// app.use("/", require("./app/routes/advocateFirm"))
// app.use("/", require("./app/routes/drafterFirm"))
// app.use("/", require("./app/routes/builderFirm"))
// app.use("/", require("./app/routes/bankBranch"))
// app.use("/", require("./app/routes/country"))
// app.use("/", require("./app/routes/city"))
// app.use("/", require("./app/routes/district"))
// app.use("/", require("./app/routes/state"))
app.use("/", require("./app/routes/user"))
// app.use("/", require("./app/routes/project"))
// app.use("/", require("./app/routes/category"))
// app.use("/", require("./app/routes/inquiry"))
// app.use("/", require("./app/routes/template"))
// app.use("/", require("./app/routes/templateKey"))
// app.use("/", require("./app/routes/projectUnit"))
// app.use("/", require("./app/routes/registrarOffice"))
// app.use("/", require("./app/routes/registrarBoy"))
// app.use("/", require("./app/routes/generateDocument"))
// app.use("/", require("./app/routes/lawTitle"))
// app.use("/", require("./app/routes/folderFile"))
const authMiddleware = require('./app/middleware/authenticate');

app.use("/", authMiddleware, require("./app/routes/company"))
app.use("/", authMiddleware, require("./app/routes/product"))
app.use("/", authMiddleware, require("./app/routes/buy"))
app.use("/", authMiddleware, require("./app/routes/sell"))
app.use("/", authMiddleware, require("./app/routes/earning"))
app.use("/", authMiddleware, require("./app/routes/poForm"))
app.use("/", authMiddleware, require("./app/routes/deliveryChallan"))
app.use("/", authMiddleware, require("./app/routes/expense"))
app.use("/", authMiddleware, require("./app/routes/ledger"))
app.use("/", authMiddleware, require("./app/routes/role"))

require('./app/controllers/cron');



var http = require('http').createServer(app);
const Settings = require('./app/models/Settings')
http.listen(port, async function () {
    global.io = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    });
    find_super_company()
    Settings.findOne({}).then(async (setting) => {
        if (!setting) {
            setting = await Settings.create({})
        }
        console.log(" *********************** settings ************************")
        global.settings = setting;
        console.log('listening on *:' + port);
        /* let utils = require("./app/utils")
        utils.sendWhatsapp("91", "8200445203", [], null, null, "testing") */
        require("./script")
    })
});
module.exports = app;
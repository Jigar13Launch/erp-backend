
const apiKey = 'YOUR_API_KEY';
const axios = require('axios');

exports.generateOTP = async function (req, res) {
    try {
        const url = 'https://api.esign.gov.in/otp/generate'; // Example URL
        const response = await axios.post(url, {
            apiKey: apiKey,
            aadhaarNumber: req.body.aadhaarNumber,
            // Other required parameters
        });

        return res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

exports.signDocument = async function (req, res) {
    try {
        const url = 'https://api.esign.gov.in/sign'; // Example
        const response = await axios.post(url, {
            apiKey: apiKey,
            documentHash: req.body.documentHash,
            otp: req.body.otp,
            // Other required parameters
        });
        /* 
        {
            "status": "success",
            "signedDocument": "base64_encoded_signed_document",
            "transactionId": "unique_transaction_id",
            "signerInfo": {
                "aadhaarNumber": "masked_aadhaar_number",
                "timestamp": "timestamp_of_signing"
            },
            "errors": []
        }
        */
        return res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        utils.catchErrorLog(error, req, res);
    }
}

const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');

// Function to calculate SHA-256 hash of a file
function calculateDocumentHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    return hex;
}

async function eSignDocument() {
    // File path to the document you want to sign
    const filePath = 'path/to/your/document.pdf'; // Replace with your file path
    const documentHash = calculateDocumentHash(filePath);

    console.log(`Document Hash: ${documentHash}`);

    // eSign API Endpoint
    const url = 'https://<eservice-url>'; // Replace with actual eSign service URL

    // Replace with actual values
    const authToken = '<YOUR_AUTH_TOKEN>';
    const aspId = '<YOUR_ASP_ID>';
    const responseUrl = '<YOUR_RESPONSE_URL>';
    const signRequestXML = `<Esign xmlns="http://www.deity.gov.in/schema/esign/1.0">
    <AspId>${aspId}</AspId>
    <AuthMode>1</AuthMode>
    <ResponseUrl>${responseUrl}</ResponseUrl>
    <ClientTxnId>TXN123456</ClientTxnId>
    <DocInfo>
      <DocumentHash>${documentHash}</DocumentHash>
    </DocInfo>
  </Esign>`;

    try {
        // Send the sign request to the eSign API
        const response = await axios.post(url, signRequestXML, {
            headers: {
                'Content-Type': 'application/xml',
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Parse the XML response
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        // Log the parsed response
        console.log(JSON.stringify(result, null, 2));

        // Extract and handle the sign response
        const signResponse = result.EsignResponse;
        if (signResponse.Status[0] === '1') {
            const signedDocumentBase64 = signResponse.SignedDocument[0];
            console.log('Signed Document:', signedDocumentBase64);

            // Optionally, save the signed document to a file
            const signedDocumentBuffer = Buffer.from(signedDocumentBase64, 'base64');
            fs.writeFileSync('signed_document.pdf', signedDocumentBuffer);
        } else {
            console.error('Error:', signResponse.ErrCode[0], signResponse.ErrMsg[0]);
        }
    } catch (error) {
        console.error('Error signing document:', error);
    }
}

// Call the function to eSign the document
eSignDocument();
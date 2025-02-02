require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load API Key from .env file
const FMCSA_API_KEY = process.env.FMCSA_API_KEY;
const FMCSA_BASE_URL = "https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/";

// Webhook Route to Validate MC Number
app.post('/validate-mc', async (req, res) => {
    const { mc_number } = req.body;

    // Validate MC number format
    if (!mc_number || !/^\d{6,7}$/.test(mc_number)) {
        return res.status(400).json({ error: "Invalid MC Number. It should be 6 or 7 digits long." });
    }

    try {
        // Construct the API URL
        const apiUrl = `${FMCSA_BASE_URL}${mc_number}?webKey=${FMCSA_API_KEY}`;
        console.log("Calling FMCSA API:", apiUrl);

        // Call FMCSA API
        const response = await axios.get(apiUrl);
        
        // Log full API response for debugging
        console.log("FMCSA API Response:", JSON.stringify(response.data, null, 2));

        // Extract `legalName` and `allowedToOperate`
        const carrierInfo = response.data?.content?.[0]?.carrier || {};
        const carrierName = carrierInfo.legalName || "Unknown";
        const allowedToOperate = carrierInfo.allowedToOperate === "Y" ? "Yes" : "No";

        return res.json({
            carrier_name: carrierName,
            allowed_to_operate: allowedToOperate, // Returns Yes/No based on allowedToOperate
        });

    } catch (error) {
        console.error("FMCSA API Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Error validating MC number. Please try again later." });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));

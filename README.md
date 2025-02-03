# FMCSA API & Load Checker API Setup

## Prerequisites

- Node.js installed on your system
- Google Cloud SDK (`gcloud`) installed and authenticated
- `ngrok` installed (if not installed, see instructions below)

## Setting Up FMCSA API

1. **Create the `.env` file:**
   - Navigate to the `fmcsa_api` folder.
   - Create a `.env` file and add the following line:
     ```env
     FMCSA_API_Key=YourAPIKey
     ```
   - Replace `YourAPIKey` with your actual FMCSA API key.

2. **Install `ngrok` (if not installed):**
   - Run the following command to install `ngrok` globally:
     ```sh
     npm install -g ngrok
     ```

3. **Start `ngrok`:**
   - Open a terminal in the `fmcsa_api` folder and run:
     ```sh
     ngrok http <your server number>
     ```
   - Replace `<your server number>` with the actual port number your API is running on.
   - Copy the `ngrok` public endpoint URL provided.

4. **Configure HappyRobot:**
   - Paste the `ngrok` URL into the `find_available_loads` tool’s endpoint URL.
   - Ensure the URL ends with `/validate_mc`.
   - Set the HTTP method to `POST`.

5. **Test the API:**
   - Use the following `curl` command to test:
     ```sh
     curl -X POST <ngrok_endpoint_url>/validate-mc \
          -H "Content-Type: application/json" \
          -d '{"mc_number": 1264930}'
     ```
   - If successful, the response should include the carrier name and their operational status.

---

## Setting Up Load Checker API

1. **Navigate to `load_checker_api` folder:**
   ```sh
   cd load_checker_api
   ```

2. **Start the application:**
   - Open a new terminal and run:
     ```sh
     node app.js
     ```
   - If successful, the terminal should display:
     ```
     Server running on port 8080
     ```

3. **Deploy to Google Cloud:**
   - Run the following command:
     ```sh
     gcloud run deploy load-checker-api \                                                         
         --image gcr.io/ace-case-449508-h4/load-checker-api \
         --platform managed \        
         --allow-unauthenticated \
         --region us-central1
     ```
   - Copy the endpoint URL provided by Google Cloud.

4. **Configure HappyRobot:**
   - Paste the Google Cloud Run endpoint URL into HappyRobot’s tool endpoint URL.
   - Ensure the URL ends with `/loads`.

5. **Test the API:**
   - Use the following `curl` command to test:
     ```sh
     curl -X POST <gcloud_endpoint_url>/loads \
          -H "Content-Type: application/json" \
          -d '{"reference_number": "12345"}'
     ```
   - If successful, the response should return the associated load from the CSV.

## Notes
- Ensure that both APIs are running before testing.
- Replace placeholder values (`<your server number>`, `<ngrok_endpoint_url>`, `<gcloud_endpoint_url>`) with actual values.
- If any issues arise, check logs in both terminals for debugging.

---

### You're all set! 🚀


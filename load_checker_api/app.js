const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let loads = [];

// ✅ Load CSV at Startup
fs.createReadStream('loads.csv')
  .pipe(csv())
  .on('data', (row) => loads.push(row))
  .on('end', () => console.log('CSV loaded successfully'));

// ✅ POST /loads - Retrieve load details via JSON request
app.post('/loads', (req, res) => {
    const { reference_number } = req.body;

    if (!reference_number) {
        return res.status(400).json({ error: "Reference number is required" });
    }

    const load = loads.find(l => l.reference_number === reference_number);

    if (!load) {
        return res.status(404).json({ error: "Load not found" });
    }

    res.json(load);
});

// ✅ Ensure API listens on the correct port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
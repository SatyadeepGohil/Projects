const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'restaurant.json');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Server error');
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send('Server error');
    }
  })
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
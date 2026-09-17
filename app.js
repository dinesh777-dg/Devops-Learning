const express = require('express');
const dotenv = require('dotenv');

const env = process.argv[2] || "development";
dotenv.config({ path: `.env.${env}` });

function log(message) {
    const time = new Date().toISOString();
    console.log(`[${time}] [${env.toUpperCase()}] ${message}`);
}

const app = express();

const PORT = process.env.PORT;
const APP = process.env.APP;

app.get('/', (req, res) => {
  res.send('Hello World' + APP);
});

app.get('/health', (req, res) => {
    log("Health check called");
    res.status(200).json({
        status: "UP"
    });
});

app.listen(PORT, () => {
   log("Server running on port" + PORT);
});

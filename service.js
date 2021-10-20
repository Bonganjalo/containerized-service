const express = require('express');
const AWS = require('aws-sdk');

const app = express();

app.use(express.json());

app.post('/api/v1/', async (request, response) => {
    response.status(200).json("Test server");
});


app.listen(4200, () => {
    console.log(`API running on port 4200`);
});

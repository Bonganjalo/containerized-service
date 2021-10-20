// author: Bonganjalo Hadebe

const express = require('express');
const DynamoDB = require('./libs/DynamoDB');

const options = {
    endpoint: 'http://localhost:8000',
    accessKeyId: 'testId',
    secretAccessKey: 'testSecretAccessKey',
    region: 'eu-central-1'
};

const db = DynamoDB.DynamoDB(options);
const app = express();

app.use(express.json());

app.post('/api/v1/', async (request, response) => {
    const streams = await db.getStreams('active-stream-dev', request.body.userId);
    await db.saveStream('active-stream-dev', request.body.userId, streams)
    response.status(200).json("Test server");
});


app.listen(4200, () => {
    console.log(`API running on port 4200`);
});

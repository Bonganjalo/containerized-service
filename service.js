// author: Bonganjalo Hadebe

const express = require('express');
const DynamoDB = require('./libs/DynamoDB');
const { v4: uuid_v4 } = require('uuid');
const Utils = require('./libs/Utils');

const STAGE =  process.env.STAGE || 'dev'

const options = {
    endpoint: 'http://localhost:8000',
    accessKeyId: 'testKeyId',
    secretAccessKey: 'testSecretAccessKey',
    region: 'eu-central-1'
};

const db = DynamoDB.DynamoDB(options, STAGE);
const utils = Utils.Utils();
const app = express();

app.use(express.json());

app.post('/api/v1/', async (request, response) => {
    const MAX = 3;
    let error;

    if (!utils.isRequestValid(request)) {  // Validate request
        error = {
          error: {
            name: "INVALID_REQUEST",
            message: "userId is required"
          }
        };
    
        console.error({
          action: 'app:isRequestValid',
          timestamp: new Date().toISOString(),
          data: error
        });
    
        response.status(400).json();
        return;
    }
    
    if (!utils.isUserIdString(request)) {  // Validate request
        error = {
          error: {
            name: "INVALID_REQUEST",
            message: "userId must be a string"
          }
        };
    
        console.error({
          action: 'app:isUserIdString',
          timestamp: new Date().toISOString(),
          data: error
        });
    
        response.status(400).json(error);
        return;
    }

    try {
        const streams = await db.getStreams('active-stream-dev', request.body.userId);

        console.info({
            action: 'app:getStreams',
            timestamp: new Date().toISOString(),
            data: streams
        });

        if (streams.length >= MAX) {    // Check if the max number of concurrent streams is not reached

            error = {
              userId: request.body.userId, error: {
                name: "MAX_CONCURRENT_STREAMS",
                message: "Client reached maximum number of concurrent streams allowed"
              }
            };
      
            console.info({
              action: 'app:max check',
              timestamp: new Date().toISOString(),
              data: error
            });
      
            response.status(403).json(error);  // 
            return;
        }

        stream = uuid_v4();
        streams.push(stream);

        await db.saveStream('active-stream-dev', request.body.userId, streams)

        console.info({
            action: 'app:saveStream',
            timestamp: new Date().toISOString(),
            data: {
              userId: request.body.userId,
              streamId: stream
            }
        });
      
        response.status(201).json({ userId: request.body.userId, streamId: stream });
      
    }
    catch(e){
        console.info({
            action: 'app: try catch error',
            timestamp: new Date().toISOString(),
            data: e
        });
        response.status(500).json('Internal Server Error');
    }
});


app.listen(4200, () => {
    console.log(`API running on port 4200`);
});

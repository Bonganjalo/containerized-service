// author: Bonganjalo Hadebe

const AWS = require('aws-sdk');
const { DocumentClient } = require('aws-sdk/clients/dynamodb'); 

exports.DynamoDB = (options, stage) => {

    let dynamoDBClient;
    let dynamodb;

    // Declare and init DynamoDB 
    if(stage !== 'dev'){
       dynamoDBClient = new DocumentClient();
       dynamodb = new AWS.DynamoDB();
    }
    else{
       dynamoDBClient = new DocumentClient(options);
       dynamodb = new AWS.DynamoDB(options);
    }

    // Check if the table exists. Throw an error if doesn't 
    const checkTable = async (tableName) => {
      const describeParams = {
        TableName: tableName
      };
      try{
        await dynamodb.describeTable(describeParams).promise();
      }
      catch(e){
        console.info({ 
          action: 'checkTable',
          timestamp: new Date().toISOString(),
          data: e
        });
        if (e.code === 'ResourceNotFoundException') {
          throw new Error(`Table ${ tableName } does not exist. Please create table`);
        }
        throw e;
      }

      return true;
    };

    // Save the new created into the DB
    const saveStream = async (tableName, userId, listOfStreams) => {
        await checkTable(tableName);
        const writeParams = {
          ExpressionAttributeNames: {
            '#STREAMS': 'activeStreams',
          },
          ExpressionAttributeValues: {
            ':strm': listOfStreams,
          },
          Key: {
            userId,
          },
          ReturnValues: 'ALL_NEW',
          TableName: tableName,
          UpdateExpression: 'SET #STREAMS = :strm'
        };
      
        const dbResponse = await dynamoDBClient.update(writeParams).promise();
        return dbResponse;
      };
      
      const getStreams = async(tableName, userId) => {
        await checkTable(tableName);
        const dbResponse =  await dynamoDBClient.get({ TableName:tableName, Key:{ userId }}).promise(); // Get the active streams from the DB
        return (dbResponse && dbResponse.Item && dbResponse.Item.activeStreams) ? dbResponse.Item.activeStreams : [];
      };

    return Object.freeze({
        getStreams,
        saveStream,
        checkTable
    });

}
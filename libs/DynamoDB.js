// author: Bonganjalo Hadebe

const { DocumentClient } = require('aws-sdk/clients/dynamodb'); 

exports.DynamoDB = (options) => {

    // Declare and init DynamoDB 
    const dynamoDBClient = new DocumentClient(options);

    // Save the new created into the DB
    const saveStream = async (tableName, userId, listOfStreams) => {
      
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
      
      const getStreams = async(tableName,userId) => {

        const dbResponse =  await dynamoDBClient.get({ TableName:tableName, Key:{ userId }}).promise(); // Get the active streams from the DB
        return (dbResponse && dbResponse.Item && dbResponse.Item.activeStreams) ? dbResponse.Item.activeStreams : [];
      };

    return Object.freeze({
        getStreams,
        saveStream
    });

}
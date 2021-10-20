// author: Bonganjalo Hadebe

const DynamoDB = require('./DynamoDB');

// Mock DynamoDB sub function calls;
const mockUpdatePromise = jest.fn().mockImplementation(() => { 
    return { 
      Attributes: {
        userId: '12',
        activeStreams: [ "DOFe98" ]
      }
    }});

const mockGetPromise = jest.fn().mockImplementation(() => { return {Item: { activeStreams: ["Ae21", "DOFe98"]}}});

// Mock DynamoDB operations
jest.mock('aws-sdk/clients/dynamodb', () => {
    return {
        DocumentClient: jest.fn().mockImplementation(() => {
            return {
                get: jest.fn().mockImplementation((params) => {

                    return  { promise:  mockGetPromise }
                }),

                update: jest.fn().mockImplementation((params) => {
                    return { promise: mockUpdatePromise }
                }),
            }
        }),
    }
});
let dynamodb;


beforeEach(() => {
    dynamodb = DynamoDB.DynamoDB();
})

describe('DynamoDB', () => {

    it("should return array of streams", async () => {
        const response = await dynamodb.getStreams('Table');

        expect(response).toEqual(["Ae21", "DOFe98"]);
    });

    it("should return an object with update results", async () => {
        
        const response = await dynamodb.saveStream('Table2', "12", [ "DOFe98" ]);

        expect(response).toEqual({ 
            Attributes: {
              userId: '12',
              activeStreams: [ "DOFe98" ]
            }
          });
    });
});
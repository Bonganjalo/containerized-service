# containerized-service
The repository for video streaming traffic control.  
The service limits the number of streams allocated to each user.  
It acts as a gatekeeper to creating new streams.

# Implementation
  Implementation is guided by the famous containerized architecture.  
  Under the hood is a express server that accepts http request coming in at a given port number.  
  This server interacts with DynamoDB to store and retrieve the data.  
  The whole service can be packaged into a docker image and deployed to the cloud.

# Scaling
  To meet the increasing demand, the image can be run on multiple EC2 instances.
  Traffic can be evenly destributed by a load balancer(ELB) to all the active EC2 instances.
  DAX can also help cache the data and reduce pressure on DynamoDB.  
  If needed replica can be created for DynamoDB.
  CloudWatch helps to monitor all this.

# Testing And Deploying
  It can be tested locally.  
  It can also be deployed and tested on AWS cloud.

# Install And Test Locally
Step 1: Install Node.js
  * Install node.js
  * Version 12.x is enough to excute the processes, but the latest stable version is much better.  
  [Node.js can be downloaded here](https://nodejs.org/)

Step 2: Set up DynamoDB locally
   * Instasll docker for desktop
   * Run the following commands on your terminal or command prompt to pull and start a dynamodb docker image  
   ```sh
     docker pull amazon/dynamodb-local
   ```  
   ```sh
     docker run -p 8000:8000 amazon/dynamodb-local
   ```

Step 3: Install a dynamoDB UI web app that will help you to create and delete tables
  * Run `npm install -g dynamodb-admin` on your terminal or command prompt  
   ```sh
     npm install -g dynamodb-admin
   ```

Step 4: Start dynamoDB UI web app
  * Details to be used on the commnad below  
  ```json
    {
      "endpoint": "http://localhost:8000",
      "accessKeyId": "testKeyId",
      "secretAccessKey": "testSecretAccessKey",
      "region": "eu-central-1"
    }
  ```  
  Mac or Linux  
  ```
     DYNAMO_ENDPOINT=http://localhost:[<PORT>]AWS_REGION=[<AWS-REGION>] AWS_ACCESS_KEY_ID=[<YOUR-ACCESS-KEY>] AWS_SECRET_ACCESS_KEY=[<YOUR-SECRET>] dynamodb-admin
  ```  
  Windows  
  ```
    export DYNAMO_ENDPOINT=http://localhost:[<PORT>]
    .
    .
    .
    dynamodb-admin
  ```

_Note: Leave step 2 and Step 4 running. Otherwise you won't be able to access them._
     

Step 5: View dynamoDB UI web app using web browser  
 * Go to http://localhost:8001 or whatever port number you see on your terminal on Step 4
 * Create table  `active-stream-dev` using the following schema. You need it to test the service  
 ```json
        {
            "AttributeDefinitions": [
                {
                "AttributeName": "userId", 
                "AttributeType": "S"
            }], 
            "KeySchema": [
                {
                "AttributeName": "userId", 
                "KeyType": "HASH"
            }], 
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 5, 
                "WriteCapacityUnits": 5
            }, 
            "TableName": "active-stream-dev"
        }
```  
Step 6: Clone the repository to your local machine using
  * Run `git clone` on your terminal or command prompt 
   ```sh
     git clone <link>
   ```


Step 7:
  * Run `npm install` on your terminal or command prompt to install all the dependences.

  Windows
  ```sh
    npm i 
  ```
  Mac
  ```sh
    sudo npm i 
  ```

Step 8:
  * Run `npm run start` on your terminal or command prompt to start the server  
  ```sh
    npm run start 
  ```  
Step 9:
  * After starting the server, you can send a `POST` request to http://localhost:4200  
  Sample request body:  

     ```json  
     { 
        "userId": "1234" // required
      }

    ```  
 * You can use Postman to send the request



# Deploying
 1. To deplay the service to AWS, you need to first build the docker image of the service. 
 ```sh
  docker build -t [<image name>]
 ``` 
 2. Run the image and test if it was built correctly  
 ```sh  
 docker run -t -i -p 80:80 [<REPOSITORY NAME>]  
 ```
 3. Create a repository to store your container using AWS CLI
 
 ```sh
 aws ecr create-repository --repository-name [<REPOSITORY NAME>] --region region  
 ```  
 You will get the following response 

  ```json  
   {
    "repository": {
        "registryId": "[<ACCOUNT ID>]",
        "repositoryName": "[<REPOSITORY NAME>]",
        "repositoryArn": "arn:aws:ecr:region:aws_account_id:repository/[<REPOSITORY NAME>]",
        "createdAt": "[< TIME STAMP>]",
        "repositoryUri": "aws_account_id.dkr.ecr.region.amazonaws.com/[<REPOSITORY NAME>]"
    }
  }
  ```

  4. Tag the docker image with the above repository  
  
  ```sh  
  docker tag hello-world aws_account_id.dkr.ecr.region.amazonaws.com/[<REPOSITORY NAME>]
  ```  
  5. Login  
  ```sh  
  aws ecr get-login-password | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com  
  ```  
  6. Push the image to the repository created above  
  ```sh 
   docker push aws_account_id.dkr.ecr.region.amazonaws.com/[<REPOSITORY NAME>]  
   ```


# credstash-lambda
Provide reliable method to read Credstash secrets on-demand within Lambda functions. Problem: How do we load values from Credstash (AWS KMS and DynamoDB) smartly and reliably given Lambda's lifecycle?  This module provides a simple way to "load" secrets once as part of a Lambda's handler and provide a simple local copy of secrets during the life of the Lambda process.

# installation

 $ npm install --save credstash-lambda

# options

* table: (STRING) the name of the DynamoDB table which stores encrypted secrets
* region: (STRING) the AWS region i.e. us-west-2
* keys: (Array[STRING]) the keys for the values you are retrieving from Credstash
* \[defaults\]: (Array[STRING]) optional array of values to use in lieu of Credstash values, used for local test

# usage

CredstashLambda.load() / CredstashLambda.get(key)

```javascript
const CredstashLambda = require('credstash-lambda')({
  table: 'TABLE_NAME',
  region: 'AWS_REGION',
  keys: ['SAMPLE_KEY']
});

function doSomething(..., sampleValue, callback) {
   ...
   callback();
}

module.exports.handle = (event, context, callback) => {
  CredstashLambda.load(function(error) {
    if (error) {
      callback(error);
    } else {
      let sampleValue = CredstashLambda.get('SAMPLE_KEY');
      console.log(`SAMPLE_KEY: ${sampleValue}`);
      doSomething(..., sampleValue, callback);
    }
  });
}
```

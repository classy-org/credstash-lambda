# credstash-lambda
Provide reliable method to read Credstash secrets on-demand within Lambda functions. Problem: How do we load values from Credstash (AWS KMS and DynamoDB) smartly and reliably given Lambda's lifecycle?  This module provides a simple way to "load" secrets once as part of a Lambda's handler and provide a simple local copy of secrets during the life of the Lambda process.

# usage

```javascript
const CredstashLambda = require('credstash-lambda')('TABLE_NAME', 'AWS_REGION', ['SAMPLE_KEY']);

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

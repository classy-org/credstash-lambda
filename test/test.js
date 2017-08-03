const keys = JSON.parse(process.argv[4]);
const CredstashLambda = require('../index.js')({
  table: process.argv[2],
  region: process.argv[3],
  keys
});

CredstashLambda.load(function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log(CredstashLambda.get(keys[0]));
  }
});

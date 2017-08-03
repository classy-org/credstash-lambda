const CredstashLambda = require('../index.js')({
  table: process.argv[2],
  region: process.argv[3],
  keys: JSON.parse(process.argv[4])
});

CredstashLambda.load(function(error) {
  CredstashLambda.load(function(error) {
    if (error) {
      console.error(error);
    } else {
      console.log(CredstashLambda.get('LOG_LOGGLY_TOKEN'));
    }
  });
});

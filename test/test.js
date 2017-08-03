const keys = JSON.parse(process.argv[4]);
const Credstash = require('../index.js')({
  table: process.argv[2],
  region: process.argv[3],
  keys
});

Credstash.load(function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log(Credstash.get(keys[0]));
  }
});

const keys = JSON.parse(process.argv[4]);
const Credstash = require('../lib/index.js')({
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

Credstash.loadAsync().then(() => {
  console.log(Credstash.get(keys[0]));
}).catch(error => {
  console.error(error);
});

'use strict';
const Credstash = require('nodecredstash');
const async = require('async');
const _ = require('lodash');

let secrets;

function stringToBool(result) {
  return (result === 'true' || result === 'false') ? result === 'true' : result;
}

module.exports = function(table, region, keys, defaults) {
  secrets = defaults;
  if (!secrets && (!table || !region || !_.isArray(keys))) {
    throw new Error(`You must provide the credstash table name,
      AWS region, and array of keys.`);
  }
  return {
    load: next => {
      if (secrets) {
        next();
      } else {
        secrets = {};
        let credstash = new Credstash({
          table,
          awsOpts: {
            region
          }
        });
        async.each(keys, function(key, callback) {
          credstash.getSecret({
            name: key
          }, function(error, value) {
            if (!error) {
              secrets[key] = stringToBool(value);
            }
            callback(error);
          });
        }, next);
      }
    },
    get: (key, next) => {
      next(secrets[key]);
    }
  };
};

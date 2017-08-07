'use strict';
const Credstash = require('nodecredstash');
const async = require('async');
const _ = require('lodash');

let secrets;

function stringToBool(result) {
  return (result === 'true' || result === 'false') ? result === 'true' : result;
}

module.exports = function(config) {
  secrets = config ? config.defaults : null;
  if (!secrets && (!config || !config.table || !config.region ||
    !_.isArray(config.keys))) {
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
          table: config.table,
          awsOpts: {
            region: config.region
          }
        });
        async.each(config.keys, function(key, callback) {
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
    get: (key) => {
      if (secrets) {
        return _.get(secrets, key, null);
      }
      throw new Error('You must load CredstashLambda first.');
    }
  };
};

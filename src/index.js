'use strict';
require('regenerator-runtime/runtime');
const Credstash = require('nodecredstash');
const _ = require('lodash');

function Once(f) {
  this.oncePromise = f();
}

Once.prototype.do = function() {
  return this.oncePromise;
};

let secrets;
let initializationOnce;

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
    loadAsync: async function() {
      if (!initializationOnce) {
        initializationOnce = new Once(async () => {
          let loadingSecrets = {};
          let credstash = new Credstash({
            table: config.table,
            awsOpts: {
              region: config.region
            }
          });

          for (let i = 0; i < config.keys.length; i++) {
            const key = config.keys[i];
            let secret = await credstash.getSecret({name: key});
            loadingSecrets[key] = stringToBool(secret);
          }

          secrets = loadingSecrets;
        });
      }
      await initializationOnce.do();
    },
    load: function(next) {
      // Using _.defer here pulls the execution out from under the promise
      // which causes thrown exceptions to bubble up all the way to the root
      //  of the stack instead of to the promise's try/catch infrastructure.
      this.loadAsync().then(() => {
        _.defer(next);
      }).catch(error => {
        _.defer(next, error);
      });
    },
    get: function(key) {
      if (secrets) {
        return _.get(secrets, key, null);
      }
      throw new Error('You must load CredstashLambda first.');
    },
    getAsync: async function(key) {
      await this.loadAsync();
      return _.get(secrets, key, null);
    }
  };
};

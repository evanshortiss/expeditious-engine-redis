'use strict';

const async = require('async');
const VError = require('verror');
const createRedisClient = require('redis').createClient;
const ExpeditiousEngine = require('expeditious').ExpeditiousEngine;

module.exports = function (opts) {
  const client = createRedisClient(opts && opts.redis || {});
  const engine = Object.create(ExpeditiousEngine.prototype);

  engine._client = client;

  engine.set = function setKeyInRedis (key, val, expire, callback) {
    client.setex(
      key,
      Math.ceil(expire / 1000),
      val,
      callback
    );
  };

  engine.get = function getKeyInRedis (key, callback) {
    client.get(
      key,
      callback
    );
  };

  engine.del = function deleteKeyInRedis (key, callback) {
    client.del(
      key,
      callback
    );
  };

  engine.ttl = function (key, callback) {
    client.pttl(key, function onTtl (err, ttl) {
      if (err) {
        callback(err, null);
      } else if (ttl && ttl < 0) {
        // Means there is no expire or key does not exist, we just return null
        callback(null, null);
      } else {
        callback(null, ttl);
      }
    });
  };

  engine.flush = function (ns, callback) {
    function onKeys (err, keys) {
      if (err) {
        callback(new VError(err, 'could not load keys to be deleted'));
      } else {
        async.eachLimit(keys, 20, engine.del.bind(engine), callback);
      }
    }

    engine.keys(ns, onKeys);
  };

  engine.keys = function (ns, callback) {
    // Match all keys beginning with ns, e.g "items" => "items:*"
    client.keys(ns += ':*', callback);
  };

  return engine;
};

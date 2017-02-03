'use strict';

var cache = require('../index.js')({})
  , assert = require('assert');

var KEY = 'ns:redis';
var NS = KEY.split(':')[0];
var VAL = 'hello';
var EXP = (2 * 60 * 1000);

console.log('setting "%s" with val "%s"', KEY, VAL);
cache.set(KEY, VAL, EXP, function (err) {
  assert.equal(err, undefined, 'no error should occur');

  cache.get(KEY, function (err, res) {
    console.log('read key "%s" result "%s"', KEY, VAL);
    assert.equal(err, null);
    assert.equal(res, VAL);

    cache.keys(NS, function (err, keys) {
      assert.equal(err, null);
      assert.equal(JSON.stringify(keys), JSON.stringify([KEY]));

      console.log('read keys for namespace "%s" result %j', NS, keys);

      cache.ttl(KEY, function (err, ttl) {
        assert.equal(err, null);
        console.log('read ttl for key "%s" result %s', KEY, ttl);
      });
    });
  });
});

expeditious-engine-redis
========================

![TravisCI](https://travis-ci.org/evanshortiss/expeditious-engine-redis.svg)

An in redis engine for expeditious. Cache entries are - you guessed it -
stored in a redis instance.

## Usage
You can use this module standalone or with expeditious which is the
recommended approach since it simplifies interactions and allows you to easily
switch cache engines.

```js
const expeditious = require('expeditious');

// This will be passed to redis.createClient(options)
// https://www.npmjs.com/package/redis#rediscreateclient
const redisOptions = {
  host: 'redis-server.acme.com',
  port: 6379
};

const countries = expeditious({
  // Use the expeditious memory engine
  engine: require('expeditious-engine-redis')({redis: redisOptions}),
  // Prefix all entries with 'countries'
  namespace: 'countries',
  // Auto parse json entries
  objectMode: true,
  // 1 hour timeout for entries
  defaultTtl: (60 * 1000 * 60),
});

countries.set({
  key: 'ireland',
  value: {
    population: '4.595 million',
    capital: 'Dublin'
  }
}, function (err) {
  if (!err) {
    console.error('failed to add "ireland" to the cache');
  } else {
    console.log('add "ireland" to the cache');
  }
});
```

## API
Each API function takes a callback function as the last parameter and it
receives up to two arguments as per node.js convention, error _err_ and an
optional result, _res_.

#### set(key, value, expire, callback)
Set a _key_ (String) in the cache with a given (String) _value_. _expire_ must
be a Number greater than 0.

#### get(key, callback)
Get a specific item from the cache. Returns _null_ if the entry is
not found.

#### del(key, callback)
Delete a specific item from the cache. Callback receives only an error
parameter.

#### keys(ns, callback)
List all keys that this engine instance contains for the given namespace. This
can be expensive as per the reddit docs for KEYS.

#### ttl(key, callback)
Get the time left before _key_ expires. Returns _null_ as _res_ if the entry is
not found.

#### flush(ns, callback)
Flush all items from the engine instance in the given namespace.

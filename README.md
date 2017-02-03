expeditious-engine-memory
=========================
[![Circle CI](https://circleci.com/gh/evanshortiss/expeditious-engine-memory/tree/master.svg?style=svg)](https://circleci.com/gh/evanshortiss/expeditious-engine-memory/tree/master)

An in memory engine for expeditious. Cache entries are - you guessed it -
stored in the node.js process memory. This cache engine will lose everything
stored if your process restarts, and could lead to memory bloat and slow
garbage collections if you're not careful with the size and volume of entries!

## Usage
You can use this module standalone or with expeditious which is the
recommended approach since it simplifies interactions and allows you to easily
switch cache engines.

```js
var expeditious = require('expeditious');

var countries = expeditious({
  // Use the expeditious memory engine
  engine: require('expeditious-engine-memory')(),
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

#### keys(callback)
List all keys that this engine instance contains.

#### ttl(key, callback)
Get the time left before _key_ expires. Returns _null_ as _res_ if the entry is
not found.

#### flush(callback)
Flush all items from the engine instance.

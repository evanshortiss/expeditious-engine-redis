'use strict';

describe('expeditious-engine-redis', function () {

  var adapter = null;

  const expect = require('chai').expect;
  const async = require('async');

  const KEY = 'expeditious:key';
  const VAL = 'expeditious-val';
  const EXP = 60 * 1000;

  beforeEach(function (done) {
    adapter = require('../expeditious-engine-redis')();
    adapter._client.flushall(done);
  });

  it('should SET a key and then GET it from redis', function (done) {
    adapter.set(KEY, VAL, EXP, function (err) {
      expect(err).to.be.null;

      adapter.get(KEY, function (err, result) {
        expect(err).to.be.null;
        expect(result).to.equal(VAL);

        done();
      });
    });
  });

  it('should set a key in redis then delete it', function (done) {
    async.series(
      [
        function (next) {
          adapter.set(KEY, VAL, EXP, next);
        },
        function (next) {
          adapter.del(KEY, next);
        }
      ],
      function (err) {
        expect(err).to.be.null;
        adapter.get(KEY, function (err, val) {
          expect(err).to.be.null;
          expect(val).to.be.null;
          done();
        });
      }
    );
  });

  it('should return the ttl of a key', function (done) {
    adapter.set(KEY, VAL, EXP, function (err) {
      expect(err).to.be.null;

      adapter.ttl(KEY, function (err, ttl) {
        expect(err).to.be.null;
        expect(ttl).to.be.a('number');
        expect(ttl).to.be.above(59000);

        done();
      });
    });
  });

  it('should flush keys', function (done) {
    async.series(
      [
        function (next) {
          adapter.set(KEY, VAL, EXP, next);
        },
        function (next) {
          adapter.flush(KEY.split(':')[0], next);
        },
        function (next) {
          adapter.keys('expeditious', function (err, kArr) {
            expect(err).to.be.null;
            expect(kArr).to.be.an('array');
            expect(kArr).to.have.length(0);

            next();
          });
        }
      ],
      done
    );
  });

  it('should list keys', function (done) {
    adapter.set(KEY, VAL, EXP, function (err) {
      expect(err).to.be.null;

      adapter.keys('expeditious', function (err, kArr) {
        expect(err).to.be.null;
        expect(kArr).to.be.an('array');
        expect(kArr).to.have.length(1);
        expect(kArr[0]).to.equal('expeditious:key');

        done();
      });
    });
  });

});

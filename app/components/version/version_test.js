'use strict';

describe('yj.version module', function() {
  beforeEach(module('yj.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

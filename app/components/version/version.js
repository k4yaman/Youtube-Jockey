'use strict';

angular.module('yj.version', [
  'yj.version.interpolate-filter',
  'yj.version.version-directive'
])

.value('version', '0.1');

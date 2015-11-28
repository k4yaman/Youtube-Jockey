'use strict';

// Declare app level module which depends on views, and components
angular.module('yj', [
  'ngRoute',
  'ngAnimate',
  'ui.layout',
  'yj.mainView',
  'yj.view2',
  'yj.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/mainView'});
}]);

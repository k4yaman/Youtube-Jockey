'use strict';

angular.module('yj.mainView', ['ngRoute', 'ngAnimate', 'ui.layout'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/mainView', {
    templateUrl: 'mainView/mainView.html',
    controller: 'mainViewCtrl'
  });
}])

.controller('mainViewCtrl', [function() {

}]);
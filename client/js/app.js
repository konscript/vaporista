'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: '/client/tmpl/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/about', {templateUrl: '/client/tmpl/about.html'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

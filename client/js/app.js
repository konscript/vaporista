'use strict';

// Declare app level module which depends on filters, and services
angular.module('vaporista', ['vaporista.filters', 'vaporista.services', 'vaporista.directives', 'vaporista.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: '/client/tmpl/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/checkout_finished', {templateUrl: '/client/tmpl/checkout_finished.html', controller: 'CheckoutFinishedCtrl'});
    $routeProvider.when('/about', {templateUrl: '/client/tmpl/about.html'});
    $routeProvider.when('/terms', {templateUrl: '/client/tmpl/terms.html'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
'use strict';

/* Controllers */

angular.module('vaporista.controllers', []).
  controller('HomeCtrl', function($scope, storeService, shoppingCart) {
    mixpanel.track("Homepage loaded");
    $scope.store = storeService;
    $scope.shoppingCart = shoppingCart;
    $scope.item = new Item();
  }).
  controller("CheckoutCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart;
  }).
  controller("CartCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart;

    $scope.clickCart = function(){
      $('html, body').animate({
         scrollTop: $("#checkout-anchor").offset().top
      }, 1000);
    }

  });

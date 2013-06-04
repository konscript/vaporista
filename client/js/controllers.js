'use strict';

/* Controllers */

angular.module('vaporista.controllers', []).
  controller('HomeCtrl', function($scope, storeService, shoppingCart) {
    mixpanel.track("Homepage loaded");
    $scope.store = storeService;
    $scope.shoppingCart = shoppingCart;
    $scope.item = new Item();
    $scope.currentCard = "unknown";
    $scope.userFound = null;
  }).
  controller("CheckoutFinishedCtrl", function($scope, $routeParams, shoppingCart){
    $scope.orderId = $routeParams.order_id;
  }).
  controller("CartCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart;

    $scope.clickCart = function(){
      $('html, body').animate({
         scrollTop: $("#checkout-anchor").offset().top - 100
      }, 500);
    }

  }).
  controller("OrdersCtrl", function($scope, orderService){

  });

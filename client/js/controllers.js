'use strict';

/* Controllers */

angular.module('vaporista.controllers', []).
  controller('HomeCtrl', function($scope, storeService, shoppingCart) {
    mixpanel.track("Homepage loaded");
    $scope.store = storeService;
    $scope.shoppingCart = shoppingCart;
    $scope.item = new Item();
    $scope.currentCard = "unknown";

    var acceptedCards = ["visa","mastercard"];
    $('#cardnumber').validateCreditCard(function(result){
      if (result.card_type != null && $.inArray(result.card_type.name, acceptedCards) != -1){
        $scope.currentCard = result.card_type.name;
      } else {
        $scope.currentCard = "unknown";
      }
    });

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

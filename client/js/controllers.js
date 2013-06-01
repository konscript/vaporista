'use strict';

/* Controllers */

angular.module('vaporista.controllers', []).
  controller('HomeCtrl', function($scope, productService, shoppingCart) {

    $scope.productValues = $.extend({}, productService);

    $scope.selectedValues = {
      flavour: null,
      strength: null,
      base: null,
      size: null,
      id: function(){
        return JSON.stringify(this.flavour) + JSON.stringify(this.strength) + JSON.stringify(this.base) + JSON.stringify(this.size);
      }
    };

    $scope.shoppingCart = shoppingCart;

    $scope.setSelected = function(type, value){
        if($scope.selectedValues[type] === value){
          $scope.selectedValues[type] = null;
        }else{
          $scope.selectedValues[type] = value;
        }

    };

    $scope.addToCart = function(){
      if($scope.selectedValues.flavour && $scope.selectedValues.strength && $scope.selectedValues.base && $scope.selectedValues.size){
        shoppingCart.incrementItem(angular.copy($scope.selectedValues));
        $scope.selectedValues.flavour = null;
      }else{
        //Show dialog
        console.log("Need selection before adding to cart");
      }
    };

    $scope.removeFromCart = function(cartItem){
      shoppingCart.removeItem(cartItem);
    };

  }).
  controller("CheckoutCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart;
  }).
  controller("CartCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart;
  });

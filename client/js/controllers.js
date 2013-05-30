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


    $scope.setSelected = function(type, value){
        if($scope.selectedValues[type] === value){
          $scope.selectedValues[type] = null;
        }else{
          $scope.selectedValues[type] = value;
        }

    };

    $scope.addToBasket = function(){
      if($scope.selectedValues.flavour && $scope.selectedValues.strength && $scope.selectedValues.base && $scope.selectedValues.size){
        shoppingCart.incrementItem($scope.selectedValues);
      }else{
        //Show dialog
      }
    };

  }).
  controller("CheckoutCtrl", function($scope, shoppingCart){
    $scope.shoppingCart = shoppingCart.get();
  });

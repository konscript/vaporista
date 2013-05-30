'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeCtrl', function($scope, productService, shoppingCart) {

    $scope.productValues = $.extend({}, productService);

    $scope.selectedValues = {
      flavour: null,
      strength: null,
      base: null,
      size: null
    };


    $scope.setSelected = function(type, value){
        if($scope.selectedValues[type] === value){
          $scope.selectedValues[type] = null;
        }else{
          $scope.selectedValues[type] = value;
        }

    };

    $scope.addToBasket = function(){
      shoppingCart.addItem($scope.selectedValues);
    };

  });

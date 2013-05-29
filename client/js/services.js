'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('productService', function(){
    return {
      flavour : [
        {name:"Strawberry", image:"/client/img/flavor-strawberry.png"},
        {name:"Blueberry", image:"/client/img/flavor-blueberry.png"},
        {name:"Citrus", image:"/client/img/flavor-citrus.png"},
        {name:"Grape", image:"/client/img/flavor-grape.png"},
        {name:"Kiwi", image:"/client/img/flavor-kiwi.png"},
        {name:"Lime", image:"/client/img/flavor-lime.png"},
        {name:"Litchi", image:"/client/img/flavor-litchi.png"},
        {name:"Orange", image:"/client/img/flavor-orange.png"},
        {name:"Peach", image:"/client/img/flavor-peach.png"},
        {name:"Pomme", image:"/client/img/flavor-pomme.png"},
        {name:"Watermelon", image:"/client/img/flavor-watermelon.png"},
      ],
      strength : [
        {name:"8 mg"},
        {name:"12 mg"},
        {name:"18 mg"}
      ],
      base : [
        {name:"100/0 - pg/vg"},
        {name:"50/50 - pg/vg"},
        {name:"0/100 - pg/vg"}
      ],
      size : [
        {name:"10 ml"},
        {name:"20 ml"},
        {name:"30 ml"}
      ]
    }
  }).
  factory('shoppingCart', function(){
    var shoppingCart = {
      items: []
    };

    return {
      incrementItem: function(item){
        shoppingCart.items.push[item];
      },
      removeItem: function(item){
        shoppingCart.slice(shoppingCart.items.indexOf(item), 1);
      },
      decrementItem: function(item){

      },
      clear: function(){
        shoppingCart.items = [];
      },
      total: function(){

      },
      get: function(){
        return shoppingCart;
      }
    }

  });

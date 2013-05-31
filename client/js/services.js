'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('vaporista.services', ['LocalStorageModule']).
  factory('productService', function(){
    return {
      flavour : [
        {name:"Strawberry", image:"/client/img/flavor-strawberry.png", price: 20},
        {name:"Blueberry", image:"/client/img/flavor-blueberry.png", price: 20},
        {name:"Citrus", image:"/client/img/flavor-citrus.png", price: 20},
        {name:"Grape", image:"/client/img/flavor-grape.png", price: 20},
        {name:"Kiwi", image:"/client/img/flavor-kiwi.png", price: 20},
        {name:"Lime", image:"/client/img/flavor-lime.png", price: 20},
        {name:"Litchi", image:"/client/img/flavor-litchi.png", price: 20},
        {name:"Orange", image:"/client/img/flavor-orange.png", price: 20},
        {name:"Peach", image:"/client/img/flavor-peach.png", price: 20},
        {name:"Pomme", image:"/client/img/flavor-pomme.png", price: 20},
        {name:"Watermelon", image:"/client/img/flavor-watermelon.png", price: 20},
      ],
      strength : [
        {name:"8 mg", price: 10},
        {name:"12 mg", price: 20},
        {name:"18 mg", price: 30}
      ],
      base : [
        {name:"80/20 PG/VG", price: 10},
        {name:"50/50 PG/VG", price: 10},
        {name:"20/80 PG/VG", price: 10}
      ],
      size : [
        {name:"10 ml", price: 10},
        {name:"20 ml", price: 20},
        {name:"30 ml", price: 30}
      ]
    }
  }).
  factory('shoppingCart', ['localStorageService', '$rootScope', function(localStorageService, $rootScope){
    var shoppingCart;

    var storage = localStorageService.get("vaporistaShoppingCart");

    if(storage){
      shoppingCart = JSON.parse(storage);

      $.each(shoppingCart.items, function(index, cartItem){
        cartItem.item.id = function(){
          return JSON.stringify(this.flavour) + JSON.stringify(this.strength) + JSON.stringify(this.base) + JSON.stringify(this.size);
        }
      });
    }else{
      shoppingCart = {
        items: []
      };
    }

    $rootScope.shoppingCart = shoppingCart;

    var sync = function(){
      localStorageService.add("vaporistaShoppingCart", JSON.stringify(shoppingCart));
    };

    return {
      incrementItem: function(item){
        var itemInCart = false;

        $.each(shoppingCart.items, function(index, cartItem){
          if(cartItem.item.id() === item.id()){
            itemInCart = true;
            cartItem.count++;
          }
        });

        if(!itemInCart){
          shoppingCart.items.push({
            count: 1,
            item: item
          });
        }
        sync();
      },
      removeItem: function(item){
        shoppingCart.slice(shoppingCart.items.indexOf(item), 1);
        sync();
      },
      decrementItem: function(item){
        sync();
      },
      clear: function(){
        shoppingCart.items = [];
        sync();
      },
      total: function(){
        var total = 0;

        $.each(shoppingCart.items, function(index, cartItem){
            total += cartItem.item.count*60;
            //TODO: how should pricing work ?
        });

        return total
      },
      count: function(){
        var count = 0;
        $.each(shoppingCart.items, function(index, cartItem){
          count += cartItem.count;
        });
        return count;
      },
      get: function(){
        return shoppingCart;
      }
    }

  }]);

'use strict';

/* Services */

angular.module('vaporista.services', ['LocalStorageModule']).
  factory('productService', function(){
    return {
      flavour : [
        {name:"Strawberry", image:"/client/img/flavours/flavor-strawberry.png"},
        {name:"Blueberry", image:"/client/img/flavours/flavor-blueberry.png"},
        {name:"Citrus", image:"/client/img/flavours/flavor-citrus.png"},
        {name:"Grape", image:"/client/img/flavours/flavor-grape.png"},
        {name:"Kiwi", image:"/client/img/flavours/flavor-kiwi.png"},
        {name:"Lime", image:"/client/img/flavours/flavor-lime.png"},
        {name:"Litchi", image:"/client/img/flavours/flavor-litchi.png"},
        {name:"Orange", image:"/client/img/flavours/flavor-orange.png"},
        {name:"Peach", image:"/client/img/flavours/flavor-peach.png"},
        {name:"Pomme", image:"/client/img/flavours/flavor-pomme.png"},
        {name:"Watermelon", image:"/client/img/flavours/flavor-watermelon.png"}
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
        $.each(shoppingCart.items, function(index, cartItem){
          if(cartItem.item.id() === item.item.id()){
            shoppingCart.items.splice(index, 1);
          }
        });

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

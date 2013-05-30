'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['LocalStorageModule']).
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
        {name:"70/30 PG/VG"},
        {name:"50/50 PG/VG"},
        {name:"20/80 PG/VG"}
      ],
      size : [
        {name:"10 ml"},
        {name:"30 ml"},
        {name:"50 ml"}
      ]
    }
  }).
  factory('shoppingCart', ['localStorageService', function(localStorageService){
    var shoppingCart;

    localStorageService.clearAll();

    var storage = localStorageService.get("vaporistaShoppingCart");

    if(storage){
      shoppingCart = JSON.parse(storage);
    }else{
      shoppingCart = {
        items: []
      };
    }



    var sync = function(){
      localStorageService.add("vaporistaShoppingCart", JSON.stringify(shoppingCart));
    }

    return {
      incrementItem: function(item){
        var itemInCart = false;

        console.log(shoppingCart.items);

        $.each(shoppingCart.items, function(index, cartItem){
          console.log(item);
          console.log(cartItem);

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

      },
      get: function(){
        return shoppingCart;
      }
    }

  }]);

'use strict';

/* Services */

angular.module('vaporista.services', ['LocalStorageModule']).
  factory('storeService', function(){
    var store = new Store();

    store.addFlavours([
      new Flavour({name:"Apple", image:"/client/img/flavours/flavor-apple.png"}),
      new Flavour({name:"Strawberry", image:"/client/img/flavours/flavor-strawberry.png"}),
      new Flavour({name:"Blueberry", image:"/client/img/flavours/flavor-blueberry.png"}),
      new Flavour({name:"Citrus", image:"/client/img/flavours/flavor-citrus.png"}),
      new Flavour({name:"Grape", image:"/client/img/flavours/flavor-grape.png"}),
      new Flavour({name:"Kiwi", image:"/client/img/flavours/flavor-kiwi.png"}),
      new Flavour({name:"Lime", image:"/client/img/flavours/flavor-lime.png"}),
      new Flavour({name:"Litchi", image:"/client/img/flavours/flavor-litchi.png"}),
      new Flavour({name:"Orange", image:"/client/img/flavours/flavor-orange.png"}),
      new Flavour({name:"Peach", image:"/client/img/flavours/flavor-peach.png"}),
      new Flavour({name:"Pomme", image:"/client/img/flavours/flavor-pomme.png"}),
      new Flavour({name:"Watermelon", image:"/client/img/flavours/flavor-watermelon.png"})
    ]);

    store.addStrengths([
      new Strength({name:"0 mg"}),
      new Strength({name:"6 mg"}),
      new Strength({name:"12 mg"}),
      new Strength({name:"18 mg"})
    ]);

    store.addBases([
      new Base({name:"80/20 PG/VG"}),
      new Base({name:"50/50 PG/VG"}),
      new Base({name:"20/80 PG/VG"})
    ]);

    store.addSizes([
      new Size({name:"10 ml",icon:"battery-mid"}),
      new Size({name:"50 ml",icon:"battery-full"}),
    ]);

    return store;
  }).
  factory('shoppingCart', ['localStorageService', '$rootScope', function(localStorageService, $rootScope){
    var shoppingCart = new ShoppingCart(localStorageService);
    return shoppingCart;
  }]);

var ShoppingCart = function(localStorageService){
    this.items = [];
    this.localStorageService = localStorageService;

    if(localStorageService){
        var ItemsInstorage = localStorageService.get("ShoppingCartItems");
        this.items = $.map(JSON.parse(ItemsInstorage), function(item){
            return new Item(item);
        });
    }
};

ShoppingCart.prototype.sync = function(){
    if(this.localStorageService){
        this.localStorageService.add("ShoppingCartItems", JSON.stringify($.map(this.items, function(item){return item.toJSON();})));
    }
};

ShoppingCart.prototype.incrementItem = function(item, qty){
    var itemInCart;
    qty = qty || 1;

    $.each(this.items, function(index, cartItem){
        if(cartItem.item.id() === item.id()){
            itemInCart = cartItem;
        }
    });

    if(!itemInCart){
        shoppingCart.items.push(item);
    }else{
        shoppingCart.setQty(cartItem.qty + qty);
    }

    this.sync();
};

ShoppingCart.prototype.decrementItem = function(item, qty){
    var itemInCart;
    qty = qty || 1;

    $.each(this.items, function(index, cartItem){
        if(cartItem.id() === item.id()){
            cartItem.setQty(cartItem.qty - qty);
            if(cartItem.qty < 1){
                this.removeItem(cartItem);
            }
        }
    });

    this.sync();
};

ShoppingCart.prototype.removeItem = function(item){
    var self = this;

    $.each(this.items, function(index, cartItem){
        if(cartItem.id() === item.id()){
            self.items.splice(index, 1);
        }
    });
};

ShoppingCart.prototype.clear = function(){
    this.items = [];
};

ShoppingCart.prototype.count = function(){
    var count = 0;
    $.each(this.items, function(index, cartItem){
        count += cartItem.qty;
    });
    return count;
};

ShoppingCart.prototype.total = function(){
    var total = 0;

    $.each(this.items, function(index, cartItem){
        total += cartItem.item.qty*60;
        //TODO: how should pricing work ?
    });

    return total;
};

ShoppingCart.prototype.checkout = function (serviceName, clearCart) {
  // select service
  if (serviceName == null) {
    var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
    serviceName = p.serviceName;
  }
  if (serviceName == null) {
    throw "Define at least one checkout service.";
  }
  var parms = this.checkoutParameters[serviceName];
  if (parms == null) {
    throw "Cannot get checkout parameters for '" + serviceName + "'.";
  }

  // invoke service
  switch (parms.serviceName) {
    case "Paymill":
      this.checkoutPaymill(parms, clearCart);
      break;
    case "Braintree":
      this.checkoutBraintree(parms, clearCart);
      break;
    default:
      throw "Unknown checkout service: " + parms.serviceName;
  }
}

// check out using PayPal; for details see:
// http://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
ShoppingCart.prototype.checkoutPaymill = function (parms, clearCart) {

  // global data
  // var data = {
  //   cmd: "_cart",
  //   business: parms.merchantID,
  //   upload: "1",
  //   rm: "2",
  //   charset: "utf-8"
  // };

  // // item data
  // for (var i = 0; i < this.items.length; i++) {
  //   var item = this.items[i];
  //   var ctr = i + 1;
  //   data["item_number_" + ctr] = item.sku;
  //   data["item_name_" + ctr] = item.name;
  //   data["quantity_" + ctr] = item.quantity;
  //   data["amount_" + ctr] = item.price.toFixed(2);
  // }

  // // build form
  // var form = $('<form></form>');
  // form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
  // form.attr("method", "POST");
  // form.attr("style", "display:none;");
  // this.addFormFields(form, data);
  // this.addFormFields(form, parms.options);
  // $("body").append(form);

  // // submit form
  // this.clearCart = clearCart == null || clearCart;
  // form.submit();
  // form.remove();
};

ShoppingCart.prototype.checkoutBraintree = function (parms, clearCart) {

  // global data
  // var data = {
  //   cmd: "_cart",
  //   business: parms.merchantID,
  //   upload: "1",
  //   rm: "2",
  //   charset: "utf-8"
  // };

  // // item data
  // for (var i = 0; i < this.items.length; i++) {
  //   var item = this.items[i];
  //   var ctr = i + 1;
  //   data["item_number_" + ctr] = item.sku;
  //   data["item_name_" + ctr] = item.name;
  //   data["quantity_" + ctr] = item.quantity;
  //   data["amount_" + ctr] = item.price.toFixed(2);
  // }

  // // build form
  // var form = $('<form></form>');
  // form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
  // form.attr("method", "POST");
  // form.attr("style", "display:none;");
  // this.addFormFields(form, data);
  // this.addFormFields(form, parms.options);
  // $("body").append(form);

  // // submit form
  // this.clearCart = clearCart == null || clearCart;
  // form.submit();
  // form.remove();
};
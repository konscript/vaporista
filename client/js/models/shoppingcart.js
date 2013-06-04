var ShoppingCart = function(localStorageService) {
  this.items = [];
  this.localStorageService = localStorageService;

  if (localStorageService) {
    var ItemsInstorage = localStorageService.get('ShoppingCartItems');
    if (ItemsInstorage) {
      this.items = $.map(JSON.parse(ItemsInstorage), function(item) {
        return new Item(item);
      });
    }
  }

  this.custommerInfo = {
    fullName: "",
    streetName: "",
    zipCode: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    comment: ""
  };

  this.checkoutParams = {
    number:         null,       // required
    exp_month:      null, // required
    exp_year:       null,  // required
    cvc:            null,          // required
    amount_int:     this.total(),   // required, z.B. "4900" for 49.00 EUR
    currency:       "EUR",          // required
    cardholder:     null   // optional
  };
};

ShoppingCart.prototype.sync = function() {
  if (this.localStorageService) {
    this.localStorageService.add('ShoppingCartItems', JSON.stringify($.map(this.items, function(item) {return item.toJSON();})));
  }
};

ShoppingCart.prototype.incrementItem = function(item, qty, event) {
  var itemInCart;

  $(event.target).closest('.addtobasket-button').addClass("item-added-state");
  setTimeout(function(){
    $(event.target).closest('.addtobasket-button').removeClass("item-added-state");
  },1000);

  qty = qty || 1;
  $.each(this.items, function(index, cartItem) {
    if (cartItem.id() === item.id()) {
      itemInCart = cartItem;
    }
  });

  if (!itemInCart) {
    this.items.push(new Item(item.toJSON()));
  }else {
    itemInCart.setQty(itemInCart.qty + qty);
  }

  this.sync();
};

ShoppingCart.prototype.decrementItem = function(item, qty) {
  var itemInCart;
  qty = qty || 1;

  $.each(this.items, function(index, cartItem) {
    if (cartItem.id() === item.id()) {
      cartItem.setQty(cartItem.qty - qty);
      if (cartItem.qty < 1) {
        this.removeItem(cartItem);
      }
    }
  });

  this.sync();
};

ShoppingCart.prototype.removeItem = function(item) {
  var self = this;

  $.each(this.items, function(index, cartItem) {
    if (cartItem.id() === item.id()) {
        self.items.splice(index, 1);
    }
  });

  this.sync();
};

ShoppingCart.prototype.clear = function() {
  this.items = [];
  this.sync();
};

ShoppingCart.prototype.count = function() {
  var count = 0;
  $.each(this.items, function(index, cartItem) {
    count += cartItem.qty;
  });
  return count;
};

ShoppingCart.prototype.subTotal = function() {
  var total = 0;

  $.each(this.items, function(index, cartItem) {
    total += cartItem.qty * 7; // TODO fixed hardcoded number
  });

  return total;
};

ShoppingCart.prototype.discount = function() {
  return Math.round(this.subTotal() * 0.2);
};

ShoppingCart.prototype.shipping = function() {
  if (this.subTotal() > 0) {
    return 6;
  } else {
    return 0;
  }
};

ShoppingCart.prototype.total = function() {
  var self = this;

  var total = self.subTotal();
  total += self.shipping();
  total = total - self.discount();

  return total;
};

ShoppingCart.prototype.isEmpty = function() {
  return this.items.length == 0 ? true : false;
};

// ShoppingCart.prototype.checkout = function(serviceName, clearCart) {
//   console.log('Checking out baby!');
//   mixpanel.track('Checkout started');

//   // select service
//   if (serviceName == null) {
//     var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
//     serviceName = p.serviceName;
//   }
//   if (serviceName == null) {
//     throw 'Define at least one checkout service.';
//   }
//   var parms = this.checkoutParameters[serviceName];
//   if (parms == null) {
//     throw "Cannot get checkout parameters for '" + serviceName + "'.";
//   }

//   // invoke service
//   switch (parms.serviceName) {
//     case 'Paymill':
//       this.checkoutPaymill(parms, clearCart);
//       break;
//     case 'Braintree':
//       this.checkoutBraintree(parms, clearCart);
//       break;
//     default:
//       throw 'Unknown checkout service: ' + parms.serviceName;
//   }
// };

// check out using PayPal; for details see:
// http://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
ShoppingCart.prototype.checkout = function() {
  var _this = this;

  $('.checkout-button').attr("disabled", "disabled");

  if (false == paymill.validateCardNumber(this.checkoutParams.number)) {
      $(".payment-errors").text("Ungueltige Kartennummer");
      $(".checkout-button").removeAttr("disabled");
      return false;
  }

  if (false == paymill.validateExpiry(this.checkoutParams.exp_month, this.checkoutParams.exp_year)) {
      $(".payment-errors").text("Ungueltiges Gueltigkeitsdatum");
      $(".checkout-button").removeAttr("disabled");
      return false;
  }

  paymill.createToken({
    number:         this.checkoutParams.number,       // required
    exp_month:      this.checkoutParams.exp_month, // required
    exp_year:       this.checkoutParams.exp_year,  // required
    cvc:            this.checkoutParams.cvc,          // required
    amount_int:     this.checkoutParams.amount_int * 100,   // required, z.B. "4900" for 49.00 EUR
    currency:       this.checkoutParams.currency,          // required
    cardholder:     this.checkoutParams.cardholder   // optional
  },
  function paymillResponseHandler(error, result) {
    console.log(result);
    console.log(error);
   if (error) {
     // Displays the error above the form
     $(".payment-errors").text(error.apierror);
   } else {
     // Output token
     var token = result.token;
     // Insert token into form in order to submit to server

     var data = $.extend(_this.custommerInfo, _this.checkoutParams, {paymillToken: token});

     console.log(data);

     $.post("/checkout", data)
      .done(function(data){
        console.log(data);
      });
   }
  });

  $(".checkout-button").removeAttr("disabled");
  return false;
};

ShoppingCart.prototype.checkoutBraintree = function(parms, clearCart) {

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

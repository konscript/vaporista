var Order = function(data){
    this.orderId = data.orderId;
    this.userInfo = data.userInfo;
    this.paymentInfo = data.paymentInfo;
};

Order.prototype.capture = function(){

};

Order.prototype.refund = function(){

};
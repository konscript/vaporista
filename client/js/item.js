var Item = function(item){
    this.flavour = item.flavour;
    this.strength = item.strength;
    this.base = item.base;
    this.size = item.size;
    this.qty = item.qty || 1;
};

Item.prototype.id = function(){
    return this.flavour.name + this.strength.name + this.base.name + this.size.name;
};

Item.prototype.toJSON = function(){
    return {
        flavour: this.flavour.toJSON(),
        strength: this.strength.toJSON(),
        base: this.base.toJSON(),
        size: this.size.toJSON(),
        qty: this.qty
    };
};

Item.prototype.setQty = function(qty){
    this.qty = qty;
};
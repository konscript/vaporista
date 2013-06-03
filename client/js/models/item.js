var Item = function(item){
    if(item){
        this.flavour = new Flavour(item.flavour);
        this.strength = new Strength(item.strength);
        this.base = new Base (item.base);
        this.size = new Size(item.size);
        this.qty = item.qty || 1;
    }else{
        this.flavour = undefined;
        this.strength = undefined;
        this.base = undefined;
        this.size = undefined;
        this.qty = 0;
    }

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

Item.prototype.valid = function(qty){
    if($scope.selectedValues.flavour && $scope.selectedValues.strength && $scope.selectedValues.base && $scope.selectedValues.size){
        return true;
    }
    return false;
};

Item.prototype.setSelected = function(type, value){
    if(this[type] === value){
      this[type] = null;
    }else{
      this[type] = value;
      mixpanel.track("Selected " + type + " value");
    }
};
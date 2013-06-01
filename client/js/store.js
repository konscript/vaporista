var Store = function(){
    this.items = [];
    this.flavours = [];
    this.strengths = [];
    this.bases = [];
    this.sizes = [];
};

Store.prototype.addFlavours = function(flavours){
    $.merge(this.flavours, flavours);
};

Store.prototype.addFlavour = function(flavour){
    this.flavours.push(flavour);
};

Store.prototype.addStrengths = function(strengths){
    $.merge(this.strengths, strengths);
};

Store.prototype.addStrength = function(strength){
    this.strengths.push(strength);
};

Store.prototype.addBases = function(bases){
    $.merge(this.bases, bases);
};

Store.prototype.addBase = function(base){
    this.bases.push(base);
};

Store.prototype.addSizes = function(sizes){
    $.merge(this.sizes, sizes);
};

Store.prototype.addSize = function(size){
    this.sizes.push(size);
};

Store.prototype.addItem = function(){

};

Store.prototype.getItem = function(){

};
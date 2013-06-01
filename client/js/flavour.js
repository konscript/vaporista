var Flavour = function(name, image){
    this.name = name;
    this.image = image;
};

Flavour.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Strength = function(name, image){
    this.name = name;
    this.image = image;
};

Strength.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Base = function(name, image){
    this.name = name;
    this.image = image;
};

Base.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Size = function(name, image){
    this.name = name;
    this.image = image;
};

Size.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};
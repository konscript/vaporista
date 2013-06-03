var Flavour = function(proprties){
    this.name = proprties.name;
    this.image = proprties.image;
};

Flavour.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Strength = function(proprties){
    this.name = proprties.name;
    this.image = proprties.image;
};

Strength.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Base = function(proprties){
    this.name = proprties.name;
    this.image = proprties.image;
};

Base.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};

var Size = function(proprties){
    this.name = proprties.name;
    this.image = proprties.image;
};

Size.prototype.toJSON = function(){
    return {
        name: this.name,
        image: this.image
    };
};
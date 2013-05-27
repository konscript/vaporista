new Dragdealer('controlslider-strength', {
    steps: 3,
    snap: true,
    x: 0.5,
    animationCallback: function(x, y){
        console.log(x);
    }
});

new Dragdealer('controlslider-mix', {
    steps: 3,
    snap: true,
    x: 0.5,
    animationCallback: function(x, y){
        console.log(x);
    }
});

new Dragdealer('controlslider-size', {
    steps: 3,
    snap: true,
    x: 0.5,
    animationCallback: function(x, y){
        console.log(x);
    }
});
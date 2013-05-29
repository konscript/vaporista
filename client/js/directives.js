'use strict';

/* Directives */
angular.module('myApp.directives', []).
  directive('simpleSlider', function() {
    return {
        restrict: 'A',
        link: function postLink(scope, elm, attrs) {
            var type = attrs.dragType;
            var steps = scope.productValues[type].length;
            var values = $.map(scope.productValues[type],function(val,index){return index;});
            var labels = scope.productValues[type];
            var labelContainer = $("<ul class='slider-labels small-block-grid-" + steps + " large-block-grid-" + steps + "'></ul>");

            $.each(labels, function(index, label){
                var ratio = index/(steps-1)*100;

                console.log(ratio);

                if(ratio===100){
                    ratio = ratio - 7;
                }else
                if(ratio>0){
                    ratio = ratio-2;
                }else
                if(ratio===0){
                    ratio = ratio + 2;
                }

                labelContainer.append("<li>" + label.name + "</li>");
            });

            $(elm[0]).simpleSlider({
                snap: true,
                allowedValues: values
            }).bind("slider:ready slider:changed", function (event, data) {
                var selected = data.value.toFixed();
                scope.setSelected(type, scope.productValues[type][selected]);
            })
            .simpleSlider("setRatio", 0.5)
            .after(labelContainer);


        }
    };
  });


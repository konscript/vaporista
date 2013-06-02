'use strict';

/* Directives */
angular.module('vaporista.directives', []).
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
                var ratio = index/(steps-1);

                var anchor = $("<a href=''>" + label.name + "</a>");

                var li = $("<li></li>").append(anchor);

                anchor.click(function(){
                    $(elm[0]).simpleSlider("setRatio", ratio);
                    labelContainer.children().removeClass("selected");
                    li.addClass("selected");
                    return false;
                });

                labelContainer.append(li);
            });

            $(elm[0]).val(values[values.length-1]/2);

            $(elm[0]).bind("slider:ready slider:changed", function (event, data) {
                var selected = data.value.toFixed();
                labelContainer.children().removeClass("selected");
                $(labelContainer.children()[selected]).addClass("selected");
                scope.setSelected(type, scope.productValues[type][selected]);
            }).simpleSlider({
                snap: true,
                allowedValues: values
            })
            .after(labelContainer);
        }
    };
  });


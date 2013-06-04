'use strict';

/* Directives */
angular.module('vaporista.directives', []).
  directive('simpleSlider', function() {
    return {
        restrict: 'A',
        link: function postLink(scope, elm, attrs) {
            var type = attrs.dragType;
            var steps = scope.store[type].length;
            var values = $.map(scope.store[type],function(val,index){return index;});
            var labels = scope.store[type];
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
                scope.item.setSelected(type.substring(0,type.length - 1), scope.store[type][selected]);
            }).simpleSlider({
                snap: true,
                allowedValues: values
            })
            .after(labelContainer);
        }
    };
  })
  .directive('creditCardValidation', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function postLink(scope, elm, attrs) {
            var acceptedCards = ["visa","mastercard"];
            $(elm[0]).validateCreditCard(function(result){
              if (result.card_type != null && $.inArray(result.card_type.name, acceptedCards) != -1){
                scope.currentCard = result.card_type.name;
              } else {
                scope.currentCard = "unknown";
              }
            });
        }
    };
  })
  .directive('emailValidation', function($http, $timeout) { // available
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            // push the validator on so it runs last.
            ctrl.$parsers.push(function(viewValue) {
                // set it to true here, otherwise it will not
                // clear out when previous validators fail.
                ctrl.$setValidity('emailValidation', true);
                ctrl.$setValidity('checkingEmail', true);

                if(ctrl.$valid) {
                    // set it to false here, because if we need to check
                    // the validity of the email, it's invalid until the
                    // AJAX responds.
                    ctrl.$setValidity('checkingEmail', false);

                    //var emailRegex = /[a-z0-9\-_]+@[a-z0-9\-_]+\.[a-z0-9\-_]{2,}/;
                    // && emailRegex.test(viewValue)

                    // now do your thing, chicken wing.
                    if(viewValue !== "" && typeof viewValue !== "undefined") {

                        //Cancel current timeout
                        if(scope.filterTextTimeout){
                            $timeout.cancel(scope.filterTextTimeout);
                        }

                        //Create a timeout so that we only send 1 request to the server
                        scope.filterTextTimeout = $timeout(function(){
                            $http.get('/check_email?email=' + encodeURIComponent(viewValue))
                            .success(function(data, status, headers, config) {
                                ctrl.$setValidity('emailValidation', true);
                                ctrl.$setValidity('checkingEmail', true);
                                scope.userFound = data.user_id;
                            })
                            .error(function(data, status, headers, config) {
                                ctrl.$setValidity('emailValidation', false);
                                ctrl.$setValidity('checkingEmail', true);
                                scope.userFound = null;
                            });
                        },250);

                    } else {
                        ctrl.$setValidity('emailValidation', false);
                        ctrl.$setValidity('checkingEmail', true);
                        scope.userFound = null;
                    }
                }
                return viewValue;
            });

        }
    };
});


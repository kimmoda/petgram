angular
    .module ('ionic-trans', [])

    /* Directive used on controller items to allow for multiple trans in/out */
    .directive ('animationdirective', function ($animate, $timeout) {
        return {
            restrict: 'A',
            link    : function (scope, element, attrs) {
                $timeout (function () {
                    $animate.addClass (element, 'anim-page-transition-js');
                }, 10);
            }
        }
    }
)


    /* animation module for running javascript transitions */
    .animation ('.anim-page-transition-js',
    function () {
        return {

            enter: function (element, done) {
                var _element = $ (element);
                _element.addClass ("visible");

                /* array of items to transition in sequentially */
                $.each ([".trans-step1",
                         ".trans-step2",
                         ".trans-step3",
                         ".trans-step4"
                ], function (index, value) {
                    _element.find (value)
                        .velocity ({
                        opacity   : 0,
                        translateY: "+200px"
                    }, {
                        duration: 0
                    })
                        .velocity ({
                        opacity   : 1,
                        translateY: "0"
                    }, {
                        easing  : "easeInOutQuad",
                        duration: 1000 + (index * 200),
                        delay   : 1000 + (index * 100),
                        queue   : false,
                        complete: function (elements) {
                            /**/
                        }
                    });
                });

                _element
                    .velocity ({
                    opacity   : 0,
                    translateY: "100%"
                }, {
                    duration: 0
                })
                    .velocity ({
                    opacity   : 1,
                    translateY: "0%"
                }, {
                    easing  : "easeInOutQuad",
                    duration: 500,
                    delay   : 1000,
                    queue   : false,
                    complete: function (elements) {
                        /* call transEnter function within the called element's controller*/
                        angular.element (_element).scope ().transEnter ();
                    }
                });

                _element.find (".trans-button")
                    .velocity ({
                    opacity   : 0,
                    translateY: "+100%"
                }, {
                    duration: 0
                })
                    .velocity ({
                    opacity   : 1,
                    translateY: "0%"
                }, {
                    easing  : "easeInOutQuad",
                    delay   : 1500,
                    queue   : false,
                    complete: function (elements) {
                        /**/
                    }
                });
            },
            leave: function (element, done) {
                var _element = $ (element);

                /* call transLeave function within the called element's controller*/
                angular.element (_element).scope ().transLeave ();

                _element.find (".trans-button")
                    .velocity ({
                    opacity   : 1,
                    translateY: "0%"
                }, {
                    duration: 0
                })
                    .velocity ({
                    opacity   : 0,
                    translateY: "+100%"
                }, {
                    easing  : "easeInOutQuad",
                    duration: 1500,
                    delay   : 0,
                    complete: function (elements) {
                        /**/
                    }
                });

                $.each ([".trans-step1",
                         ".trans-step2",
                         ".trans-step3",
                         ".trans-step4"
                ], function (index, value) {
                    _element.find (value)
                        .velocity ({
                        opacity   : 1,
                        translateY: "0"
                    }, {
                        duration: 0
                    })
                        .velocity ({
                        opacity   : 0,
                        translateY: "-200px"
                    }, {
                        easing  : "easeInOutQuad",
                        duration: 1000 + (index * 200),
                        delay   : (index * 100),
                        queue   : false,
                        complete: function (elements) {
                            /**/
                        }
                    });
                });

                _element
                    .velocity ({
                    opacity   : 1,
                    translateY: "0%"
                }, {
                    duration: 0
                })
                    .velocity ({
                    opacity   : 0,
                    translateY: "-100%"
                }, {
                    easing  : "easeInOutQuad",
                    duration: 1000,
                    delay   : 1000,
                    queue   : false,
                    complete: function (elements) {
                        /**/
                        $ (element).remove ();
                    }
                });
            }
        }
    }
);
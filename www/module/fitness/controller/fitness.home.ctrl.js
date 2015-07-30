'use strict';
angular
    .module ('module.fitness')
    .controller ('FitnessHomeCtrl', function (GeoAlert) {
    var self = this;

    //Begin the service
    //hard coded 'target'
    var lat  = 30.224090;
    var long = -92.019843;

    function onConfirm (idx) {
        console.log ('button ' + idx + ' pressed');
    }

    GeoAlert.begin (lat, long, function () {
        console.log ('TARGET');
        GeoAlert.end ();
        navigator.notification.confirm (
            'You are near a target!',
            onConfirm,
            'Target!',
            ['Cancel', 'View']
        );

    });
});
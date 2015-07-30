'use strict';
angular
    .module ('ion-location')
    .factory ('GeoService', function ($http, $q, CoreService) {
    /**
     'street_address', //indicates a precise street address.
     'route', //indicates a named route (such as "US 101").
     'intersection', //indicates a major intersection, usually of two major roads.
     'political', //indicates a political entity. Usually, this type indicates a polygon of some civil administration.
     'country', //indicates the national political entity, and is typically the highest order type returned by the Geocoder.
     'administrative_area_level_1', //indicates a first-order civil entity below the country level. Within the United States, these administrative levels are states. Not all nations exhibit these administrative levels.
     'administrative_area_level_2', //indicates a second-order civil entity below the country level. Within the United States, these administrative levels are counties. Not all nations exhibit these administrative levels.
     'administrative_area_level_3', //indicates a third-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
     'colloquial_area', //indicates a commonly-used alternative name for the entity.
     'locality', //indicates an incorporated city or town political entity.
     'sublocality', //indicates an first-order civil entity below a locality
     'neighborhood', //indicates a named neighborhood
     'premise', //indicates a named location, usually a building or collection of buildings with a common name
     'subpremise', //indicates a first-order entity below a named location, usually a singular building within a collection of buildings with a common name
     'postal_code', //indicates a postal code as used to address postal mail within the country.
     'natural_feature', //indicates a prominent natural feature.
     'airport', //indicates an airport.
     'park', //indicates a named park.
     'point_of_interest', //indicates a named point of interest. Typically, these "POI"s are prominent local entities that don't easily fit in another category such as "Empire State Building" or "Statue of Liberty."

     //In addition to the above, address components may exhibit the following types:

     'post_box', //indicates a specific postal box.
     'street_number', //indicates the precise street number.
     'floor indicates', //the floor of a building address.
     'room indicates'; //the room of a building address.'
     */
    var options             = {types: ['geocode']};
    var autocompleteService = new google.maps.places.AutocompleteService ();
    var detailsService      = new google.maps.places.PlacesService (document.createElement ('input'), options);
    var componentForm       = {
        street_number              : 'long_name',
        //number
        route                      : 'long_name',
        //street
        locality                   : 'long_name',
        // district
        sublocality                : 'long_name',
        // district
        neighborhood               : 'long_name',
        //state
        political                  : 'long_name',
        //state
        administrative_area_level_1: 'long_name',
        //state
        country                    : 'long_name',
        //country
        postal_code                : 'long_name'  //zipcode
    };
    var componentFormName   = {
        street_number              : 'number',
        //number
        route                      : 'street',
        //street
        locality                   : 'city',
        // district
        administrative_area_level_1: 'state',
        //state
        country                    : 'country',
        //country
        postal_code                : 'zipcode',
        //zipcode
        neighborhood               : 'district'  //zipcode
    };
    var self                = this;
    self.data               = {
        coords: {},
        src   : ''
    };
    self.init               = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (self.GEOprocess, self.GEOdeclined);
        } else {
            console.error ('Your Browser sucks');
        }
    };
    // Get Geo Location
    self.GEOprocess       = function (position) {
        self.getGoogleAddress (position.coords.latitude, position.coords.longitude);
        self.data.coords = position.coords;
        CoreService.updateGeoUser (position.coords.latitude, position.coords.longitude);
    };
    self.GEOdeclined      = function (error) {
        console.log (error);
    };
    self.getGoogleAddress = function (lat, lng) {
        $http.get ('http://maps.google.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true').success (function (data) {
            self.data.endereco_normal = data.results[0].formatted_address;
            self.data.endereco        = self.endereco (data.results[0].address_components);
            self.data.src             = self.imagem (lat, lng, 18, 500, 300);
        });
    };
    self.endereco         = function (endereco) {
        if (!endereco) {
            return false;
        }
        return {
            numero  : endereco[0].short_name,
            rua     : endereco[1].long_name,
            bairro  : endereco[2].short_name,
            cidade  : endereco[3].short_name,
            estado  : endereco[5].long_name,
            uf      : endereco[5].short_name,
            pais    : endereco[6].long_name,
            paisCode: endereco[6].short_name,
            cep     : endereco[7].short_name
        };
    };
    self.imagem           = function (lat, lng, zoom, w, h) {
        return 'http://maps.google.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom + '&size=' + w + 'x' + h + '&maptype=roadmap&sensor=true';
    };
    self.parseAddress     = function (place) {
        var endereco = {
            resume: '',
            geo   : {
                lat: place.geometry.location.k,
                lng: place.geometry.location.D
            }
        };
        var image    = self.src (endereco.geo.lat, endereco.geo.lng, 16, 900, 200);
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val                                  = place.address_components[i][componentForm[addressType]];
                endereco[componentFormName[addressType]] = val;
            }
        }
        endereco.street = endereco.street + ', ' + endereco.number;
        endereco.image  = image;
        endereco.resume = endereco.street + ' - ' + endereco.city + ', ' + endereco.state + ', ' + endereco.country;
        return endereco;
    };
    self.searchAddress    = function (input) {
        var deferred = $q.defer ();
        autocompleteService.getQueryPredictions ({input: input}, function (result) {
            deferred.resolve (result);
        });
        return deferred.promise;
    };
    self.getDetails       = function (placeId) {
        var deferred = $q.defer ();
        detailsService.getDetails ({placeId: placeId}, function (result) {
            deferred.resolve (result);
        });
        return deferred.promise;
    };
    self.src              = function (lat, lng, zoom, w, h) {
        var link = 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom + '&scale=1&size=' + w + 'x' + h + '&maptype=roadmap&format=jpg&visual_refresh=true&markers=size:small%7Ccolor:0xff2600%7Clabel:0%7C' + lat + ',' + lng + '&sensor=true';
        console.log (link);
        return link;
    };
    return self;
});
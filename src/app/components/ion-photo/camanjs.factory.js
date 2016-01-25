(function () {
  'use strict';

  angular
    .module('ion-photo')
    .factory('CamanJS', CamanJs);

  function CamanJs($q) {
    var filters = [
      'normal',
      'vintage',
      'lomo',
      'clarity',
      'sinCity',
      'sunrise',
      'crossProcess',
      'orangePeel',
      'love',
      'grungy',
      'jarques',
      'pinhole',
      'oldBoot',
      'glowingSun',
      'hazyDays',
      'herMajesty',
      'nostalgia',
      'hemingway',
      'concentrate'
    ];

    return {
      filters: filters,
      effect: filter,
      reset: resetEffect
    };

    function filter(elem, effect, status) {
      var defer = $q.defer();
      var image = window.document.getElementById(elem);

      Caman(image, applyEffect);

      function applyEffect() {

        if (effect === 'normal') {
          this.revert();
          this.render(function () {
            defer.resolve(effect);
          });
        }

        if (effect in this) {
          this[effect]();
          if (status) resetEffect(elem);
          this.render(function () {
            defer.resolve(effect);
          });
        }
      }

      return defer.promise;
    }

    function resetEffect(elem) {

      var defer = $q.defer();
      var image = window.document.getElementById(elem);
      Caman(image, resetCaman);

      function resetCaman() {
        this.revert();
        defer.resolve(true);
      }

      return defer.promise;
    }
  }
})();

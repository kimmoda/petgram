(function () {
  'use strict';
  angular
    .module('ngParse', [])
    .factory('ngParse', ngParseFactory);

  function ngParseFactory($q) {
    return {
      count: count,
      paginate: paginate
    };

    function count(model) {
      var defer = $q.defer();
      new Parse
        .Query(model)
        .count()
        .then(function (resp) {
          defer.resolve(resp);
        });
      return defer.promise;
    }

    function paginate(model, options) {
      var defer = $q.defer();

      var query = new Parse.Query(model);
      query.skip(options.pageNumber);
      query.limit(options.pageSize);

      if (options.sort) {
        var sort = options.sort;
        if (sort.order === 'asc') {
          query.ascending(options.sort.field);
        } else {
          query.descending(options.sort.field);
        }
      }
      query.find()
        .then(function (resp) {
          var data = {
            results: [],
            total: 0
          };
          resp.map(function (item) {
            var obj = item.attributes;
            obj.id = item.id;
            data.results.push(obj);
          });

          count(model)
            .then(function (count) {
              data.total = count;
              defer.resolve(data);
            });
        });


      return defer.promise;
    }
  }

})();
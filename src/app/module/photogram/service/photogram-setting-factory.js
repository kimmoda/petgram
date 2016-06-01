(function () {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramSetting', PhotogramSettingFactory);

    function PhotogramSettingFactory(DAO, $q) {

        var _data = {
            rows:[]
        };

        return {
            init: init,
            get: get
        };

        function init() {
            var defer = $q.defer();
            var _tableName = 'GallerySetting';

            DAO.query("SELECT * FROM " + _tableName).then(function  (data) {
                    console.log(data);
                    if(data.rows.length) {
                        _data.rows = data.rows;
                        defer.resolve(_data);
                    } else {

                        new Parse
                            .Query(_tableName)
                            .find()
                            .then(function (resp) {
                                var data  = [];
                                resp.map(function (item) {
                                    var _queryInsert = {
                                        table: _tableName,
                                        columns: {
                                            key: item.attributes.key,
                                            value: item.attributes.value
                                        }
                                    };
                                    DAO.insert(_queryInsert);
                                    data.push(_queryInsert.columns)
                                });
                                defer.resolve(data);
                            }, error);
                        
                    }
                })


            return defer.promise;

        }

        function error(err) {
            alert(err);
        }

        function get(key) {
            return _.filter(_data.rows,{key: key})[0];
        }

    }


})();
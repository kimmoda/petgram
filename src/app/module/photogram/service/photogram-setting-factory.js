(function () {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramSetting', PhotogramSettingFactory);

    function PhotogramSettingFactory(DAO, $q) {


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
                        defer.resolve(data.rows);
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
            return CacheSetting.get(key);
        }

    }


})();
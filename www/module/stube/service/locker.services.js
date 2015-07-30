'use strict';
angular
    .module ('module.stube')
    .factory ('LockerModel', function ($q, gettextCatalog, CacheFactory) {

    var unlock,
        temp;

    if (!CacheFactory.get ('unlock')) {
        unlock = CacheFactory.createCache ('unlock', {
            //maxAge:             15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
            //cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
            //deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    return {
        checkPass: checkPass
    };


    function checkPass (pattern) {
        var defer    = $q.defer (),
            cache    = unlock.get ('pass'),
            response = {
                message: '',
                status : false
            };

        console.log (cache, pattern);

        if (cache === undefined) {
            if (!temp) {
                temp             = pattern;
                response.message = 'Confirme sua senha';
                defer.resolve (response);
            } else {
                console.log (temp, pattern);

                if (temp === pattern) {
                    unlock.put ('pass', pattern);
                    response.message = 'Senha Configurada';
                    response.status  = true;
                    defer.resolve (response);
                } else {
                    response.message = 'Senha Incorreta';
                    defer.reject (response);
                }
            }


        } else {

            // Conferir senha
            if (cache === pattern) {
                response.message = '';
                response.status  = true;
                defer.resolve (response);
            } else {
                response.message = 'Senha incorreta';
                defer.reject (response);
            }
        }

        console.log (response);

        return defer.promise;
    }


});
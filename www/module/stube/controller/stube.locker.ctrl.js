'use strict';
angular
    .module ('module.stube')
    .controller ('LockerCtrl', function ($timeout, LockerModel, $state) {
    var self = this;


    // 2) Configurar nova senha
    // 3) Confirmar senha
    // 4) Sempre que entrar, pedir senha
    // 5) Alterar senha

    self.passcode = '';
    self.title    = 'Configurar uma senha';

    self.add = function (value) {
        if (self.passcode.length < 4) {
            self.passcode = self.passcode + value;
            if (self.passcode.length === 4) {
                var pass = self.passcode;
                $timeout (function () {

                    LockerModel
                        .checkPass (pass)
                        .then (function (resp) {
                        console.log (resp);
                        self.title    = resp.message;
                        self.passcode = '';
                        if (resp.status) {
                            $state.go ('app.stube.search');
                        }
                    }).catch (function (resp) {
                        console.warn (resp);
                        self.title    = resp.message;
                        self.passcode = '';
                    });

                }, 500);
            }
        }
    };


    if (self.passcode.length > 0) {
        self.passcode = self.passcode.substring (0, self.passcode.length - 1);
    }

    self.delete = function () {
        if (self.passcode.length > 0) {
            self.passcode = self.passcode.substring (0, self.passcode.length - 1);
        }
    };

    self.confirm = function () {

    };


});
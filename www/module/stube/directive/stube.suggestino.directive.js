'use strict';
angular
    .module ('module.stube')
    .directive ('stubeSuggestion', function ($ionicModal, Notify, $rootScope) {
    return {
        restrict: 'A',
        template: '',
        link    : function ($scope, elem, attr) {

            elem.bind ('click', function () {

                $scope.modal.show ();
                init ();
            });

            $ionicModal.fromTemplateUrl ('module/stube/view/modal/stube.suggestion.modal.html', {
                scope: $scope
            }).then (function (modal) {
                $scope.modal = modal;
            });

            function init () {
                $scope.form = {
                    nome    : '',
                    email   : '',
                    mensagem: ''
                };
            }

            $scope.send = function (rForm, form) {
                console.log (rForm, form);
                if (rForm.$valid) {
                    var SugestaoObject = Parse.Object.extend ('Sugestao');
                    var sugestao       = new SugestaoObject ();
                    sugestao.set ('nome', form.nome);
                    sugestao.set ('email', form.email);
                    sugestao.set ('idioma', $rootScope.lang);
                    sugestao.set ('mensagem', form.mensagem)
                    sugestao.save (null, {});
                    console.log (sugestao);

                    $scope.closeModal ();
                    Notify.alert ('Success', 'Sugestão enviada com sucesso!')
                } else {
                    Notify.alert ('Ops', 'Formulário Inválido');
                }
            }


            $scope.closeModal = function () {
                $scope.modal.hide ();
                $scope.modal.remove ();
            };


        }
    }
});
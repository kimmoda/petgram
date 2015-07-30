'use strict';
angular
    .module ('module.futebol')
    .factory ('Futebits', function ($http, $q) {

        var data = {
            API: 'http://www.futebits.com.br/ws/api/'
        };

        function rest (method, parameters) {

            var defer = $q.defer ();
            var url   = data.API + method + '/';

            if (parameters) {
                for (var i = 0; i < parameters.length; i++) {
                    url += parameters[i] + '/';
                }
            }

            $http ({
                method: 'GET',
                url   : url
            }).success (function (resp) {
                defer.resolve (resp);
            }).error (function (resp) {
                defer.reject (resp);
            });

            return defer.promise;
        }

        //Equipe
        function getProximoJogo (idEquipe) {
            return rest ('getProximoJogo', [idEquipe]);
        }

        function getUltimoJogo (idEquipe) {
            return rest ('getUltimoJogo', [idEquipe]);
        }

        function getDadosEquipe (idEquipe) {
            return rest ('getDadosEquipe', [idEquipe]);
        }

        function getRodadaSeguintePorEquipe (campeonato, idEquipe) {
            return rest ('getRodadaSeguintePorEquipe', [campeonato, idEquipe]);
        }

        function getUltimaRodadaPorEquipe (campeonato, idEquipe) {
            return rest ('getUltimaRodadaPorEquipe', [campeonato, idEquipe]);
        }

        function getRodadaAtualPorEquipe (campeonato, idEquipe) {
            return rest ('getRodadaAtualPorEquipe', [campeonato, idEquipe]);
        }

        function getJogos (idEquipe) {
            return rest ('getJogos', [idEquipe]);
        }

        function getIdentificadorEquipes () {
            return rest ('getIdentificadorEquipes');
        }

        function getTabelaAtualCampeonatoEquipe (campeonato, idEquipe) {
            return rest ('getTabelaAtualCampeonatoEquipe', [campeonato, idEquipe]);
        }

        //Campeonato
        function getCampeonatos () {
            return rest ('getCampeonatos');
        }

        function getFasesEdicao (campeonato, divisao, ano) {
            return rest ('getFasesEdicao', [campeonato, divisao, ano]);
        }

        function getGruposFase (campeonato, divisao, ano, fase) {
            return rest ('getGruposFase', [campeonato, divisao, ano, fase]);
        }

        function getTabelaGrupo (campeonato, divisao, ano, fase, grupo) {
            return rest ('getTabelaGrupo', [campeonato, divisao, ano, fase, grupo]);
        }

        //Rodada
        function getRodada (campeonato, divisao, ano, fase, grupo, rodada) {
            return rest ('getTabelaGrupo', [campeonato, divisao, ano, fase, grupo, rodada]);
        }

        function getRodadaAtual (campeonato, divisao, ano, fase, grupo, rodada) {
            return rest ('getRodadaAtual', [campeonato, divisao, ano, fase, grupo, rodada]);
        }

        function getRodadaSeguinte (campeonato, divisao, ano, fase, grupo, rodada) {
            return rest ('getRodadaSeguinte', [campeonato, divisao, ano, fase, grupo, rodada]);
        }

        function getUltimaRodada (campeonato, divisao, ano, fase, grupo, rodada) {
            return rest ('getUltimaRodada', [campeonato, divisao, ano, fase, grupo, rodada]);
        }

        //Interno
        function getIdentidadeFutebits () {
            return rest ('getIdentidadeFutebits');
        }

        return {
            getProximoJogo                : getProximoJogo,
            getUltimoJogo                 : getUltimoJogo,
            getDadosEquipe                : getDadosEquipe,
            getRodadaSeguintePorEquipe    : getRodadaSeguintePorEquipe,
            getUltimaRodadaPorEquipe      : getUltimaRodadaPorEquipe,
            getRodadaAtualPorEquipe       : getRodadaAtualPorEquipe,
            getJogos                      : getJogos,
            getIdentificadorEquipes       : getIdentificadorEquipes,
            getTabelaAtualCampeonatoEquipe: getTabelaAtualCampeonatoEquipe,
            getCampeonatos                : getCampeonatos,
            getFasesEdicao                : getFasesEdicao,
            getGruposFase                 : getGruposFase,
            getTabelaGrupo                : getTabelaGrupo,
            getRodada                     : getRodada,
            getRodadaAtual                : getRodadaAtual,
            getRodadaSeguinte             : getRodadaSeguinte,
            getUltimaRodada               : getUltimaRodada,
            getIdentidadeFutebits         : getIdentidadeFutebits
        }
    }
);  
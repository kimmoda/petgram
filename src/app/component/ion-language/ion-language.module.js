(function () {
    'use strict';

    var path = 'app/component/ion-language';
    
    angular
        .module('ion-language', [
            'ngCookies',
            'pascalprecht.translate', // angular-translate
            'tmh.dynamicLocale' // angular-dynamic-locale
        ])
        .config(configTranslate)
        .config(configLanguage);


    function configTranslate($translatePartialLoaderProvider) {
        // Translation
        $translatePartialLoaderProvider.addPart(path);
    }


    function configLanguage($translateProvider, AppConfig, tmhDynamicLocaleProvider) {

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);

        // Translate Config
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');

        var langvar     = navigator.language || navigator.userlanguage;
        var userlangvar = langvar.split('-')[0];
        var language    = AppConfig.preferredLocale;
        var searchLang  = _.some(AppConfig.locales, {
            code: userlangvar
        });
        if (searchLang) {
            language = _.filter(AppConfig.locales, {code: searchLang})[0];
        }
        console.log(language);
        $translateProvider.preferredLanguage(language);
        moment.locale(language);

        console.log(searchLang, language);
    }


})();

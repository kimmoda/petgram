;(function() {
"use strict";

angular.module("cacheapp", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/core/view/loading.html","<ion-view><ion-content class=\"view-loading\" scroll=\"false\"><img src=\"img/icon.png\"></ion-content></ion-view>");
$templateCache.put("app/user/view/user.intro.html","<ion-view class=\"view-intro\"><ion-content scroll=\"false\"><div class=\"intro-slider\"><button class=\"button button-clear\" ui-sref=\"user.login\" translate>Enter</button><ion-slide-box active-slide=\"slideIndex\" show-pager=\"true\" on-slide-changed=\"Intro.slideChanged($index)\"><ion-slide ng-repeat=\"item in Intro.slides\"><div class=\"content\" ng-if=\"$index == Intro.slideIndex\"><span class=\"top\">{{ item.top }}</span><div class=\"phone\"><img ng-src=\"{{ item.img }}\"></div></div></ion-slide></ion-slide-box></div></ion-content></ion-view>");
$templateCache.put("app/user/view/user.login.html","<ion-view class=\"form-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\"><div class=\"padding\"><formly-form model=\"Login.form\" fields=\"Login.formFields\" form=\"rForm\"><button-forgot-pass></button-forgot-pass><button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"rForm.$invalid\" ng-click=\"Login.submitLogin(rForm, Login.form)\" translate>Enter</button></formly-form><div class=\"line\"><div class=\"left\"></div><span translate>or</span><div class=\"right\"></div></div><button-facebook login=\"gallery.home\" register=\"userlist\"></button-facebook></div></ion-content></ion-view>");
$templateCache.put("app/user/view/user.register.html","<ion-view view-title=\"{{ \'Register\' | translate }}\"><ion-content padding=\"true\"><formly-form model=\"Register.form\" fields=\"Register.formFields\" form=\"rForm\"><div class=\"padding\"><button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"rForm.$invalid\" ng-click=\"Register.submitRegister(rForm, Register.form)\" translate>Register</button></div></formly-form><div class=\"padding\"><p class=\"text-center\"><span translate>When creating your account, you agree to our</span> <b open-terms translate>Terms and Conditions</b></p></div></ion-content></ion-view>");
$templateCache.put("app/user/view/user.tabs.html","<ion-view class=\"form-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\" scroll=\"false\"><div class=\"user-head padding text-center step1\"><div class=\"logo2\"><img src=\"img/icon.png\"> <span class=\"icon2-logo\"></span></div><h2 class=\"step2\" translate>Share your most amazing moments</h2><ion-tabs class=\"tabs-positive tabs-top\"><ion-tab title=\"{{ \'Enter\' | translate }}\" ui-sref=\"user.login\"></ion-tab><ion-tab title=\"{{ \'Register\' | translate }}\" ui-sref=\"user.register\"></ion-tab></ion-tabs></div><ion-nav-view class=\"step3\" name=\"tabLogin\"></ion-nav-view></ion-content></ion-view>");}]);
}());

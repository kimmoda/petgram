;
(function () {
  "use strict";

  angular.module("cacheapp", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("app/core/view/loading.html",
      "<ion-view class=\"view-loading\"><ion-content scroll=\"false\"><img src=\"img/icon.png\"></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.avatar.html",
      "<ion-view title=\"{{ \'Complete your Profile\' | translate }}\"><ion-nav-bar class=\"bar bar-positive bar-mop\" align-title=\"left\"></ion-nav-bar><ion-content class=\"view-avatar\"><div class=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar ng-src=\"{{ UserAvatar.form.src }}\"></div></div><div class=\"step2\"><label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input type=\"text\" ng-model=\"UserAvatar.form.email\" disabled></label><formly-form model=\"UserAvatar.form\" fields=\"UserAvatar.formFields\" form=\"UserAvatar.rForm\"></formly-form></div><div class=\"padding step3\"><button ng-click=\"UserAvatar.submitAvatar()\" class=\"button button-block button-positive\" translate>Save Profile</button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.intro.html",
      "<ion-view class=\"view-intro\"><ion-content scroll=\"false\"><div class=\"intro-slider\"><button class=\"button button-clear\" ui-sref=\"user.signin\" translate>Enter</button><ion-slide-box active-slide=\"slideIndex\" show-pager=\"true\" on-slide-changed=\"Intro.slideChanged($index)\"><ion-slide ng-repeat=\"item in Intro.slides\"><div class=\"content\" ng-if=\"$index == Intro.slideIndex\"><span class=\"top\">{{ item.top }}</span><div class=\"phone {{ Intro.device }}\"><img ng-src=\"{{ item.img }}\"></div></div></ion-slide></ion-slide-box></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.merge.html",
      "<ion-view title=\"{{ \'Complete your Profile\' | translate }}\"><ion-nav-bar class=\"bar bar-positive bar-mop\" align-title=\"left\"></ion-nav-bar><ion-content class=\"view-avatar\"><div class=\"step1 padding\"><h5 translate>Your email is already associated with another account, please enter your password</h5></div><div class=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar ng-src=\"{{ Merge.form.src }}\"></div></div><div class=\"list step2\"><label class=\"item item-input\"><i class=\"icon icon-user placeholder-icon\"></i> <input type=\"text\" ng-model=\"Merge.form.name\" disabled></label> <label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input type=\"text\" ng-model=\"Merge.form.email\" disabled></label> <label class=\"item item-input lock\"><input type=\"password\" placeholder=\"{{ \'Password\' | translate }}\" ng-model=\"Merge.form.password\"></label></div><div class=\"padding step3\"><button ng-click=\"Merge.submitMerge(Merge.form)\" ng-disabled=\"form.facebook\" class=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate>Merge Facebook</span></button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.signin.html",
      "<ion-view class=\"view-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\"><div class=\"padding\"><formly-form model=\"UserSignin.form\" fields=\"UserSignin.formFields\" form=\"UserSignin.rForm\"><button recovery-pass class=\"button button-right button-block button-clear\"><span translate>Forgot your password?</span></button> <button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"UserSignin.rForm.$invalid\" ng-click=\"UserSignin.submitLogin(UserSignin.rForm, UserSignin.form)\" translate>Enter</button></formly-form><div class=\"line\"><div class=\"left\"></div><span translate>or</span><div class=\"right\"></div></div><button ng-click=\"UserSignin.facebook()\" class=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate>Connect your Facebook</span></button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.signup.html",
      "<ion-view view-title=\"{{ \'Register\' | translate }}\"><ion-content padding=\"true\"><formly-form model=\"UserSignup.form\" fields=\"UserSignup.formFields\" form=\"UserSignup.rForm\"><div class=\"padding\"><button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"rForm.$invalid\" ng-click=\"UserSignup.submitRegister(UserSignup.rForm, UserSignup.form)\" translate>Register</button></div></formly-form><div class=\"padding\"><p class=\"text-center\"><span translate>When creating your account, you agree to our</span> <b open-terms translate>Terms and Conditions</b></p></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.tabs.html",
      "<ion-view class=\"view-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\" scroll=\"false\"><div class=\"user-head padding text-center step1\"><div class=\"logo2\"><img src=\"img/icon.png\"> <span class=\"icon2-logo\"></span></div><h2 class=\"step2\" translate>Share your most amazing moments</h2><ion-tabs class=\"tabs-positive tabs-top\"><ion-tab title=\"{{ \'Enter\' | translate }}\" ui-sref=\"user.signin\"></ion-tab><ion-tab title=\"{{ \'Register\' | translate }}\" ui-sref=\"user.signup\"></ion-tab></ion-tabs></div><ion-nav-view class=\"step3\" name=\"tabLogin\"></ion-nav-view></ion-content></ion-view>"
    );
  }]);
}());

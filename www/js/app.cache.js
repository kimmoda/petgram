;
(function () {
  "use strict";

  angular.module("app.cache", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("app/photogram/view/photogram.account.html",
      "<ion-view cache-view=\"false\" class=\"photogram-profile\"><ion-nav-title><h1 class=\"title\">{{ user.name }}</h1></ion-nav-title><ion-nav-buttons side=\"right\"><button photogram-settings class=\"button button-icon icon ion-gear-a\"></button></ion-nav-buttons><ion-content class=\"animated fadeIn\" overflow-scroll=\"true\"><div class=\"profile-top\"><div class=\"row\"><div class=\"col-25\"><img class=\"avatar\" user-avatar ng-src=\"{{ user.src }}\"></div><div class=\"col col-statics\"><div class=\"row\"><div class=\"col\"><photogram-loading loading=\"loadingPhotos\"></photogram-loading><span ng-if=\"!loadingPhotos\" class=\"text-center\">{{ user.qtdPhotos }}</span><h3 translate>Posts</h3></div><div class=\"col\"><photogram-loading loading=\"loadingFollowers\"></photogram-loading><span ng-if=\"!loadingFollowers\" class=\"text-center\">{{ user.qtdFollowers }}</span><h3 translate>Followers</h3></div><div class=\"col\"><photogram-loading loading=\"loadingFollowing\"></photogram-loading><span ng-if=\"!loadingFollowing\" class=\"text-center\">{{ user.qtdFollowing }}</span><h3 translate>Followings</h3></div></div><div class=\"row col-edit\"><div class=\"col\"><button photogram-profile-edit class=\"button\">{{ \'EDIT YOUR PROFILE\' | translate }}</button></div></div></div></div><div class=\"padding\"><span class=\"user-username\">{{ user.name }}</span><p class=\"user-status\">{{ user.status }}</p></div></div><div class=\"item item-divider\" translate>Recent</div><div class=\"center-ico animated fadeIn\" ng-if=\"vm.empty\"><i class=\"icon ion-camera\"></i><h1 translate>No Post</h1></div><photogram-loading loading=\"vm.loading\"></photogram-loading><photogram-photo-list gallery=\"vm.data\" loading=\"vm.loading\"></photogram-photo-list></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.activity.html",
      "<ion-view cache-view=\"false\" class=\"photogram-activity\"><ion-nav-title><h1 class=\"title\">{{ \'Activities\' | translate }}</h1></ion-nav-title><ion-nav-buttons side=\"right\"><button ng-click=\"vm.openShare()\" class=\"button button-icon icon ion-android-share-alt\"></button></ion-nav-buttons><ion-content overflow-scroll=\"true\"><photogram-loading loading=\"vm.loading\" icon=\"android\"></photogram-loading><div class=\"list\"><div class=\"item item-avatar item-animate1\" ng-repeat=\"item in vm.data\"><img ng-src=\"{{ item.user.src }}\"><h2>{{ item.user.name }}</h2><div class=\"text\">{{ item.action | translate }}</div><p>{{ item.created | amTimeAgo }}</p><div class=\"img-right\" ng-if=\"item.img\"><img ng-src=\"{{ item.img }}\"></div></div></div><ion-infinite-scroll ng-if=\"!vm.loading\" on-infinite=\"vm.load()\"></ion-infinite-scroll></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.capture.html",
      "<ion-view view-title=\"{{ \'Share\' | translate }}\" cache-view=\"false\"><ion-content><div class=\"center-ico\"><i class=\"icon ion-camera\"></i><h1 translate>Share photo</h1></div></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.capture.modal.html",
      "<ion-modal-view class=\"modal-capture\"><ion-header-bar class=\"bar-dark\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Share Photo\' | translate }}</div><button class=\"button button-positive\" ng-click=\"submitCapture()\"><i class=\"icon ion-arrow-right-b\"></i></button></ion-header-bar><ion-content><photogram-loading loading=\"loading\" icon=\"android\"></photogram-loading><div class=\"list\"><div class=\"item no-padding capture-photo\"><img ng-src=\"{{data}}\" ng-click=\"open()\"></div><div class=\"item item-input\"><input type=\"text\" name=\"title\" ng-model=\"form.title\" placeholder=\"{{ \'Write a Legend\'|translate }}\"></div><div class=\"item item-input\"><input type=\"text\" placeholder=\"{{ \'Location\' | translate }}\" ion-location location=\"form.geo\" ng-model=\"form.geo.resume\"></div><div class=\"item nopadding\" ng-show=\"form.geo.image\"><img ng-src=\"{{ form.geo.image }}\"></div></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.comment.directive.html",
      "<ion-modal-view class=\"modal-comment\"><ion-header-bar class=\"bar-dark\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Comments\' | translate }} ({{ comments.length }})</div></ion-header-bar><ion-content><photogram-loading loading=\"loading\" icon=\"android\"></photogram-loading><div class=\"list step1\" ng-show=\"comments.length\"><div ng-repeat=\"item in comments\" class=\"item item-avatar\"><img ng-src=\"{{ item.user.src }}\"><div class=\"row\"><h2>{{ item.user.name }}</h2><div>{{ item.text }}</div></div><div class=\"row\"><p>{{ item.created | amTimeAgo }}</p></div></div></div><div class=\"center-ico step1\" ng-if=\"nocomments\"><i class=\"icon ion-ios-chatbubble-outline\"></i><h1 translate>No Comments</h1></div></ion-content><ion-footer class=\"step2\"><div class=\"form\"><formly-form model=\"form\" fields=\"formFields\" form=\"rForm\"><button class=\"button button-positive\" type=\"button\" ng-click=\"submitComment(rForm, form)\"><i class=\"icon ion-arrow-right-b\"></i></button></formly-form></div></ion-footer></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.follow.modal.html",
      "<ion-modal-view class=\"modal-profile photogram-profile\"><ion-header-bar class=\"bar-positive\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">Follow Users</div></ion-header-bar><ion-content><div class=\"list\"><div class=\"item item-avatar item-button-right\" ng-repeat=\"item in data\"><img ng-src=\"{{ item.src }}\"><h2>{{ item.name }}</h2><p>{{ item.status }}</p><button class=\"button\" ng-click=\"item.follow = !item.follow\" ng-class=\"item.follow ? \'button-positive\' : \'button-stable\'\"><i class=\"icon\" ng-class=\"item.follow? \'ion-thumbsup\' : \'ion-plus\'\"></i></button></div></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.home.html",
      "<ion-view class=\"view-home\"><ion-nav-title><span class=\"icon2-logo\"></span></ion-nav-title><ion-nav-buttons side=\"right\"><button class=\"button button-icon ion-card\" ng-click=\"vm.buySource()\"></button></ion-nav-buttons><ion-content overflow-scroll=\"true\"><ion-refresher ng-if=\"!vm.loading\" on-refresh=\"loadMore(true)\"></ion-refresher><photogram-loading loading=\"vm.loading\"></photogram-loading><photogram-photo-list gallery=\"vm.data\" loading=\"vm.loading\"></photogram-photo-list><div class=\"center-ico\" ng-if=\"vm.empty\"><i class=\"icon ion-ios-camera\"></i><h1 translate>Nenhuma foto postagem por perto</h1></div><ion-infinite-scroll ng-if=\"!vm.loadMore&&vm.more\" on-infinite=\"loadMore()\"></ion-infinite-scroll></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.like.directive.html",
      "<ion-modal-view class=\"modal-comment\"><ion-header-bar class=\"bar-dark\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Likes\' | translate }} ({{ likes.length }})</div></ion-header-bar><ion-content><div class=\"list step1\"><div ng-repeat=\"item in likes\" class=\"item item-avatar item-button-right\"><img ng-src=\"{{ item.user.img }}\"><h2>{{ item.user.name }}</h2><div>{{ item.text }}</div><p>{{ item.created | amTimeAgo }}</p><button class=\"button button-positive button-outline\"><i class=\"icon ion-ios-plus-empty\"></i> {{ \'Follow\' }}</button></div></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.photo.feedback.modal.html",
      "<ion-modal-view class=\"modal-profile\"><ion-header-bar class=\"bar-dark\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Feedback\' | translate }}</div><button class=\"button button-positive\" ng-click=\"submitFeedback()\"><i class=\"icon ion-arrow-right-b\"></i></button></ion-header-bar><ion-content><div class=\"step2\"><formly-form model=\"form\" form=\"rForm\" fields=\"formFields\"></formly-form></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.photo.html",
      "<ion-view view-title=\"Photo\"><ion-content><div class=\"list card step1\"><div class=\"item item-avatar\" data-affix-within-parent-with-class=\"card\" ion-affix><img ng-src=\"{{GalleryPhoto.data.user.img}}\"><h2>{{GalleryPhoto.data.user.name}}</h2><span>{{GalleryPhoto.data.created | amTimeAgo}}</span></div><div class=\"item item-body\"><img ng-src=\"{{GalleryPhoto.data.img._url}}\" style=\"width: 100%\"></div><div class=\"padding\"><p>{{ GalleryPhoto.data.title }}</p><p><a class=\"subdued\" href=\"#\">1 {{ \'Like\' | translate}}</a></p></div></div><div class=\"list\"><div ng-repeat=\"item in GalleryPhoto.comments\" class=\"item item-avatar\"><img ng-src=\"{{ item.user.img }}\"><h2>{{ item.user.name }}</h2><p>{{ item.text }}</p></div></div><div class=\"step2\"><formly-form model=\"GalleryPhoto.form\" fields=\"GalleryPhoto.formFields\" form=\"rForm\"><div class=\"padding\"><button class=\"button button-block button-positive\" type=\"button\" ng-click=\"GalleryPhoto.submitComment(rForm, GalleryPhoto.form)\" translate>Comment</button></div></formly-form></div></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.photos.grid.html",
      "<div class=\"row step1\" ng-if=\"$index % 3 === 0\" ng-repeat=\"image in data\"><div class=\"col col-33 item-animate1\" ng-if=\"$index < data.length\"><img photogram-profile user=\"data[$index].user\" ng-src=\"{{data[$index].src}}\" width=\"100%\"></div><div class=\"col col-33 item-animate1\" ng-if=\"$index + 1 < data.length\"><img photogram-profile user=\"data[$index + 1].user\" ng-src=\"{{data[$index + 1].src}}\" width=\"100%\"></div><div class=\"col col-33 item-animate1\" ng-if=\"$index + 2 < data.length\"><img photogram-profile user=\"data[$index + 2].user\" ng-src=\"{{data[$index + 2].src}}\" width=\"100%\"></div></div>"
    );
    $templateCache.put("app/photogram/view/photogram.photos.list.html",
      "<div class=\"list card animated fadeIn\" ng-repeat=\"gallery in data\"><div class=\"item item-avatar\"><img photogram-profile user=\"gallery.user\" profile=\"{{gallery.user.id }}\" ng-src=\"{{gallery.user.src}}\"><h2>{{gallery.user.name}}</h2><p>{{ gallery.user.status }}</p><span>{{gallery.created | amTimeAgo}}</span></div><div class=\"item item-body\" ng-click=\"like = !like\"><i class=\"icon\" ng-if=\"like\"></i> <img cache-src=\"{{gallery.src}}\"></div><div class=\"item item-buttons\"><div class=\"row\"><div class=\"col col-75\"><ion-spinner ng-show=\"gallery.item.likeProgress\"></ion-spinner><button photogram-like ng-model=\"gallery\" ng-if=\"!gallery.item.likeProgress\" ng-class=\"(gallery.item.liked) ? \'ion-ios-heart\' : \'ion-ios-heart-outline\'\" class=\"button-clear button-icon button-heart\"></button> <button photogram-comment ng-model=\"gallery\" class=\"button-clear button-icon ion-ios-chatbubble-outline\"></button></div><div class=\"col text-right\"><button photogram-photo-feedback gallery=\"{{ gallery.id }}\" class=\"button-clear button-icon ion-android-more-vertical\"></button></div></div></div><div class=\"padding\"><span class=\"likes\" photogram-like gallery=\"{{ gallery }}\"><i class=\"icon ion-ios-heart\"></i> <span ng-if=\"!gallery.item.likeProgress\">{{ gallery.item.qtdLike }}</span> {{ \'Likes\' | translate }}</span><div class=\"list-comments\"><div class=\"comment-item\"><span class=\"username\">{{ gallery.user.name }}</span> <span class=\"comment\">{{ gallery.item.title }}</span></div><div class=\"comment-item\" ng-repeat=\"item in gallery.comments\"><span class=\"username\">{{ item.user.name }}</span> <span class=\"comment\">{{ item.text }}</span></div></div><button class=\"button button-block button-clear button-comment\" photogram-comment ng-model=\"gallery\">{{ \'Add comment\' | translate }}</button></div></div>"
    );
    $templateCache.put("app/photogram/view/photogram.popover.home.html",
      "<ion-popover-view><ion-content><div class=\"list\"><div class=\"item\" ui-sref=\"gallery.settings\" translate>Settings</div><div class=\"item\" ui-sref=\"gallery.settings\" translate>About</div></div></ion-content></ion-popover-view>"
    );
    $templateCache.put("app/photogram/view/photogram.popular.html",
      "<ion-view><ion-nav-title><h1 class=\"title\">{{ \'Popular\' | translate }}</h1></ion-nav-title><ion-nav-buttons side=\"right\"><button ng-click=\"GalleryPopular.openShare()\" class=\"button button-icon icon ion-android-share-alt\"></button></ion-nav-buttons><ion-content overflow-scroll=\"true\"><ion-refresher ng-if=\"!GalleryPopular.loading\" on-refresh=\"loadMore(true)\"></ion-refresher><photogram-loading loading=\"GalleryPopular.loading\"></photogram-loading><photogram-photo-grid gallery=\"GalleryPopular.data\" loading=\"GalleryPopular.loading\"></photogram-photo-grid><div class=\"center-ico\" ng-if=\"GalleryPopular.empty\"><i class=\"icon ion-ios-camera\"></i><h1 translate>Nenhuma foto postagem por perto</h1></div><ion-infinite-scroll ng-if=\"!GalleryPopular.loadMore&&GalleryPopular.more\" on-infinite=\"loadMore()\"></ion-infinite-scroll></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.profile.edit.modal.html",
      "<ion-modal-view class=\"modal-profile\"><ion-header-bar class=\"bar-positive\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Edit Profile\' | translate }}</div></ion-header-bar><ion-content class=\"view-avatar\"><div class=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar ng-src=\"{{ form.src }}\"></div></div><div class=\"step2\"><label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input type=\"text\" ng-model=\"form.email\" disabled></label><formly-form model=\"form\" fields=\"formFields\" form=\"rForm\"></formly-form></div><div class=\"padding step3\"><button ng-click=\"linkFacebook()\" ng-disabled=\"form.facebook\" class=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate>Link Facebook</span></button> <button class=\"button button-block button-positive\" ng-click=\"submitUpdateProfile()\" translate>Save Profile</button></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.profile.modal.html",
      "<ion-modal-view class=\"modal-profile photogram-profile\"><ion-header-bar class=\"bar-positive\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ user.name }}</div></ion-header-bar><ion-content overflow-scroll=\"true\"><div class=\"profile-top\"><div class=\"row\"><div class=\"col-25\"><img class=\"avatar\" user-avatar ng-src=\"{{ user.src }}\"></div><div class=\"col col-statics\"><div class=\"row\"><div class=\"col\"><photogram-loading loading=\"loadingPhotos\"></photogram-loading><span ng-if=\"!loadingPhotos\" class=\"text-center\">{{ user.qtdPhotos }}</span><h3 translate>Posts</h3></div><div class=\"col\"><photogram-loading loading=\"loadingFollowers\"></photogram-loading><span ng-if=\"!loadingFollowers\" class=\"text-center\">{{ user.qtdFollowers }}</span><h3 translate>Followers</h3></div><div class=\"col\"><photogram-loading loading=\"loadingFollowing\"></photogram-loading><span ng-if=\"!loadingFollowing\" class=\"text-center\">{{ user.qtdFollowing }}</span><h3 translate>Followings</h3></div></div><div class=\"row col-edit\"><div class=\"col\"><photogram-loading loading=\"loadingFollow\"></photogram-loading><button ng-if=\"!loadingFollow\" ng-class=\"{\'button-unfollow\': user.follow, \'button-follow\': !user.follow}\" ng-click=\"follow()\" class=\"button\"><span ng-show=\"!user.follow\" translate>Follow</span> <span ng-show=\"user.follow\" translate>Following</span></button></div></div></div></div><div class=\"padding\"><span class=\"user-username\">{{ user.name }}</span><p class=\"user-status\">{{ user.status }}</p></div></div><div class=\"item item-divider\" translate>Recent</div><div class=\"profile-view\"><photogram-loading loading=\"loadingGallery\"></photogram-loading><div class=\"list card animated fadeIn\" ng-repeat=\"gallery in data\"><div class=\"item item-avatar\"><img ng-src=\"{{gallery.user.src}}\"><h2>{{gallery.user.name}}</h2><p>{{ gallery.user.status }}</p><span>{{gallery.created | amTimeAgo}}</span></div><div class=\"item item-body\" ng-click=\"like = !like\"><i class=\"icon\" ng-if=\"like\"></i> <img cache-src=\"{{gallery.src}}\"></div><div class=\"item item-buttons\"><div class=\"row\"><div class=\"col col-75\"><button photogram-like ng-model=\"gallery\" ng-class=\"(gallery.liked ===1) ? \'ion-ios-heart\' : \'ion-ios-heart-outline\'\" class=\"button-clear button-icon button-heart\"></button> <button photogram-comment ng-model=\"gallery\" class=\"button-clear button-icon ion-ios-chatbubble-outline\"></button></div><div class=\"col text-right\"><button photogram-photo-feedback gallery=\"{{ gallery.id }}\" class=\"button-clear button-icon ion-android-more-vertical\"></button></div></div></div><div class=\"padding\"><span class=\"likes\" photogram-like gallery=\"{{ gallery }}\"><i class=\"icon ion-ios-heart\"></i> {{ gallery.qtdLike + \' \' }} {{ \'Likes\' | translate }}</span><div class=\"list-comments\"><div class=\"comment-item\"><span class=\"username\">{{ gallery.user.name }}</span> <span class=\"comment\">{{ gallery.item.title }}</span></div><div class=\"comment-item\" ng-repeat=\"item in gallery.comments\"><span class=\"username\">{{ item.user.name }}</span> <span class=\"comment\">{{ item.text }}</span></div></div><button class=\"button button-block button-clear button-comment\" photogram-comment ng-model=\"gallery\">{{ \'Add comment\' | translate }}</button></div></div></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.profile.photos.html",
      "<ion-view title=\"{{\'Profile\' | translate}}\" class=\"profile\"><ion-content scroll=\"false\"><h2>Fotos</h2></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.search.grid.html",
      "<ion-view cache-view=\"false\" title=\"{{ \'Popular\' | translate }}\"><ion-content class=\"photogram-search\"><photogram-photo-grid gallery=\"GallerySearchGrid.data\" loading=\"GallerySearchGrid.loading\"></photogram-photo-grid><ion-infinite-scroll ng-if=\"GallerySearchGrid.more\" on-infinite=\"loadMore()\"></ion-infinite-scroll></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.search.map.html",
      "<ion-view class=\"maps-view\"><ion-nav-title translate>Map</ion-nav-title><ion-nav-buttons side=\"right\"><button ng-click=\"GallerySearchMap.location()\" class=\"button button-icon icon ion-pinpoint\"></button></ion-nav-buttons><ion-content scroll=\"false\"><div class=\"map-container\"><ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\"><ui-gmap-marker idkey=\"0\" coords=\"GallerySearchMap.user\"></ui-gmap-marker><ui-gmap-marker click=\"GallerySearchMapCtrl.openModal(item)\" idkey=\"item.id\" coords=\"item.coords\" icon=\"item.icon\" ng-repeat=\"item in GallerySearchMap.data\"></ui-gmap-marker></ui-gmap-google-map></div></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.search.tabs.html",
      "<ion-view title=\"Search\" class=\"view-tab\"><ion-nav-title><h1 class=\"title\">Search</h1></ion-nav-title><ion-tabs class=\"tabs-top tabs-positive tabs-striped\"><ion-tab title=\"Grid\" icon=\"ion-grid\" ui-sref=\"gallery.search.grid\"><ion-nav-view name=\"tabGrid\"></ion-nav-view></ion-tab><ion-tab title=\"Map\" icon=\"ion-map\" ui-sref=\"gallery.search.map\"><ion-nav-view name=\"tabMap\"></ion-nav-view></ion-tab></ion-tabs></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.settings.modal.html",
      "<ion-modal-view class=\"modal-profile\"><ion-header-bar class=\"bar-dark\"><button class=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">{{ \'Settings\' | translate }}</div></ion-header-bar><ion-content class=\"animated fadeIn\"><div class=\"list\"><label class=\"item item-input item-select\"><div class=\"input-label\" style=\"z-index: 2;\"><h2>{{\'Change language\' | translate}}</h2></div><select ng-model=\"language\" ng-change=\"changeLanguage(language)\" ng-options=\"language.value as language.name for language in languages\"></select></label><ion-toggle class=\"toggle-positive\" ng-model=\"form.push\"><h3><small translate>Notification</small></h3><p ng-if=\"!setting_preview\" translate>Off</p><p ng-if=\"setting_preview\" translate>On</p></ion-toggle><ion-item class=\"item-icon-right\" ng-click=\"openLink(\'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FAW4JZS7KJM5S\')\"><h3><small translate>Buy Source Code</small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item><ion-item class=\"item-icon-right\" ng-click=\"openLink(\'http://photogramapp.com\')\"><h3><small translate>Help</small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item><ion-item class=\"item-icon-right\" ng-click=\"openLink(\'http://photogramapp.com\')\"><h3><small translate>Privacy Policy</small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item><ion-item class=\"item-icon-right\" ng-click=\"openLink(\'http://photogramapp.com\')\"><h3><small translate>Terms of Service</small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item><ion-item class=\"item-icon-right\" ng-click=\"show();\"><h3><small translate>Report a Problem</small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item></div><div class=\"padding\"><button ng-click=\"link(\'logout\')\" class=\"button button-block button-positive\" translate>Logout</button></div></ion-content></ion-modal-view>"
    );
    $templateCache.put("app/photogram/view/photogram.tabs.html",
      "<ion-view><ion-nav-bar class=\"bar bar-positive bar-mop\" align-title=\"left\"><ion-nav-back-button></ion-nav-back-button></ion-nav-bar><ion-tabs class=\"tabs-dark tabs-photogram\"><ion-tab title=\"Home\" icon=\"ion-android-home\" ui-sref=\"photogram.home\"><ion-nav-view name=\"tabHome\"></ion-nav-view></ion-tab><ion-tab title=\"Search\" icon=\"ion-search\" ui-sref=\"photogram.popular\"><ion-nav-view name=\"tabPopular\"></ion-nav-view></ion-tab><ion-tab title=\"Capture\" icon=\"ion-camera\" class=\"middle\" ui-sref=\"photogram.capture\"><ion-nav-view name=\"tabCapture\"></ion-nav-view></ion-tab><ion-tab title=\"Notify\" icon=\"ion-chatbubble\" ui-sref=\"photogram.activity\"><ion-nav-view name=\"tabActivity\"></ion-nav-view></ion-tab><ion-tab title=\"Perfil\" icon=\"ion-person\" ui-sref=\"photogram.account\"><ion-nav-view name=\"tabProfile\"></ion-nav-view></ion-tab></ion-tabs></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.user.list.html",
      "<ion-view view-title=\"UserList\" class=\"photogram-userlist\"><ion-header-bar class=\"bar-dark\"><h1 class=\"title\">{{ \'Follow Users\' | translate }}</h1><div class=\"buttons\"><button class=\"button button-positive\" ng-click=\"vm.submitFollow()\"><i class=\"icon ion-arrow-right-b\"></i></button></div></ion-header-bar><ion-content><div class=\"list\"><div class=\"item item-avatar item-animate1 item-button-right\" ng-repeat=\"item in vm.data\"><img ng-src=\"{{ item.src }}\"><h2>{{ item.name }}</h2><p>{{ item.status }}</p><button class=\"button\" ng-click=\"item.follow = !item.follow\" ng-class=\"item.follow ? \'button-positive\' : \'button-stable\'\"><i class=\"icon\" ng-class=\"item.follow? \'ion-thumbsup\' : \'ion-plus\'\"></i></button></div></div></ion-content></ion-view>"
    );
    $templateCache.put("app/photogram/view/photogram.view.html",
      "<ion-view view-title=\"{{ \'Gallery preview\' | translate }}\"><ion-content class=\"bg-content\"><ion-list class=\"card\" ng-if=\"!GalleryPreview.data.images.length\"><ion-item class=\"text-center\">No photos</ion-item></ion-list><div class=\"row\"><div class=\"col\" ng-repeat=\"picture in GalleryPreview.data.images\" ui-sref=\"app.gallerypreview({id: picture.id})\"><div class=\"card\"><div class=\"item item-image\"><img ng-src=\"{{picture.image._url}}\"></div></div></div></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/loading.html",
      "<ion-view class=\"view-loading\"><ion-content scroll=\"false\"><img src=\"img/icon.png\"></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.avatar.html",
      "<ion-view title=\"{{ \'Complete your Profile\' | translate }}\"><ion-nav-bar class=\"bar bar-positive bar-mop\" align-title=\"left\"></ion-nav-bar><ion-content class=\"view-avatar\"><div class=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar ng-src=\"{{ vm.form.src }}\"></div></div><div class=\"step2\"><label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input type=\"text\" ng-model=\"vm.form.email\" disabled></label><formly-form model=\"vm.form\" fields=\"vm.formFields\" form=\"vm.rForm\"></formly-form></div><div class=\"padding step3\"><button ng-click=\"vm.submitAvatar()\" class=\"button button-block button-positive\" translate>Save Profile</button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.intro.html",
      "<ion-view class=\"view-intro\" can-swipe-back=\"false\"><ion-content scroll=\"false\"><div class=\"intro-slider\"><ion-slide-box active-slide=\"slideIndex\" show-pager=\"true\" on-slide-changed=\"vm.slideChanged($index)\"><ion-slide ng-repeat=\"item in vm.slides\"><div class=\"content\" ng-if=\"$index == vm.slideIndex\"><span class=\"top\"><h2>{{ item.top }}</h2></span><div class=\"phone {{ vm.device }}\"><img ng-src=\"{{ item.img }}\"></div></div></ion-slide><ion-slide><div class=\"content\" ng-if=\"vm.slides.length == vm.slideIndex\"><div class=\"last\"><div class=\"logo2 step1\"><img src=\"img/icon.png\"> <span class=\"icon2-logo\"></span></div><button class=\"button button-block button-clear step2\" ui-sref=\"user.signin\" translate>Enter</button></div></div></ion-slide></ion-slide-box></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.merge.html",
      "<ion-view title=\"{{ \'Complete your Profile\' | translate }}\"><ion-nav-bar class=\"bar bar-positive bar-mop\" align-title=\"left\"></ion-nav-bar><ion-content class=\"view-avatar\"><div class=\"step1 padding\"><h5 translate>Your email is already associated with another account, please enter your password</h5></div><div class=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar ng-src=\"{{ vm.form.src }}\"></div></div><div class=\"list step2\"><label class=\"item item-input\"><i class=\"icon icon-user placeholder-icon\"></i> <input type=\"text\" ng-model=\"vm.form.name\" disabled></label> <label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input type=\"text\" ng-model=\"vm.form.email\" disabled></label> <label class=\"item item-input lock\"><input type=\"password\" placeholder=\"{{ \'Password\' | translate }}\" ng-model=\"vm.form.password\"></label></div><div class=\"padding step3\"><button ng-click=\"vm.submitvm(vm.form)\" ng-disabled=\"form.facebook\" class=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate>vm Facebook</span></button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.signin.html",
      "<ion-view class=\"view-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\"><div class=\"padding\"><formly-form model=\"vm.form\" fields=\"vm.formFields\" form=\"vm.rForm\"><button recovery-pass class=\"button button-right button-block button-clear\"><span translate>Forgot your password?</span></button> <button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"vm.rForm.$invalid\" ng-click=\"vm.submitLogin(vm.rForm, vm.form)\" translate>Enter</button></formly-form><div class=\"line\"><div class=\"left\"></div><span translate>or</span><div class=\"right\"></div></div><button ng-click=\"vm.facebook()\" class=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate>Connect your Facebook</span></button></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.signup.html",
      "<ion-view view-title=\"{{ \'Register\' | translate }}\"><ion-content padding=\"true\"><formly-form model=\"vm.form\" fields=\"vm.formFields\" form=\"vm.rForm\"><div class=\"padding\"><button class=\"button button-block button-positive\" type=\"button\" ng-disabled=\"rForm.$invalid\" ng-click=\"vm.submitRegister(vm.rForm, vm.form)\" translate>Register</button></div></formly-form><div class=\"padding\"><p class=\"text-center\"><span translate>When creating your account, you agree to our</span> <b open-terms translate>Terms and Conditions</b></p></div></ion-content></ion-view>"
    );
    $templateCache.put("app/user/view/user.tabs.html",
      "<ion-view class=\"view-login\" view-title=\"{{ \'Enter\' | translate }}\"><ion-content padding=\"false\" scroll=\"false\"><div class=\"user-head padding text-center step1\"><div class=\"logo2\"><img src=\"img/icon.png\"> <span class=\"icon2-logo\"></span></div><h2 class=\"step2\" translate>Share your most amazing moments</h2><ion-tabs class=\"tabs-positive tabs-top\"><ion-tab title=\"{{ \'Enter\' | translate }}\" ui-sref=\"user.signin\"></ion-tab><ion-tab title=\"{{ \'Register\' | translate }}\" ui-sref=\"user.signup\"></ion-tab></ion-tabs></div><ion-nav-view class=\"step3\" name=\"tabLogin\"></ion-nav-view></ion-content></ion-view>"
    );
  }]);
}());

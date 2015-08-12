'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryUserListCtrl', function (User, Notify, $state) {
    var self = this;

    User
        .list ()
        .then (function (resp) {
        self.data = resp;
        console.log (resp);
    });

    self.submitFollow = function () {

        var users = self.data.filter (function (item) {
            return item.follow == true;
        });

        Notify.showLoading ();
        User
            .addFollows (users)
            .then (function (resp) {
            Notify.hideLoading ();
            console.log (resp);
            $state.go ('gallery.home', {clear: true});
        });
        console.log (users);

    };
});
var myApp = angular.module('adminApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;
    var admin = nga
        .application('Admin page')
        .baseApiUrl('http://localhost:3000/admin/');

    var account = nga.entity('account');

    account.listView().fields([
        nga.field('login')
    ]);
    account.creationView().fields([
        nga.field('login')
    ]);
    account.editionView().fields(
        account.creationView.fields()
    );

    admin.addEntity(account);

    nga.configure(admin);
}]);
var accountController = require('./accountController');
var adminController = require('./adminController');


module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Тесты',
            account: req.user
        });
    });

    app.get('/account/new', accountController.new);
    app.get('/account/:id', accountController.show);
    app.post('/account', accountController.create);
    app.get('/login', accountController.loginForm);
    app.post('/login', accountController.login);
    app.all('/logout', accountController.logout);

    app.namespace('/admin', function(){
        app.get('/', adminController.index);
        app.get('/account', adminController.list);
        app.post('/accouont', adminController.create);
        app.get('/accouont/:id', adminController.show);
        app.put('/accouont/:id', adminController.edit);
        app.delete('/accouont/:id', adminController.delete);

    });

};

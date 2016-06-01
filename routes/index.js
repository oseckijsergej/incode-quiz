var accountController = require('./accountController');

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
};

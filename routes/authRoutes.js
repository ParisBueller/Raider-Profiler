const passport = require('passport');

module.exports = app => {
    app.get(
        '/auth/bnet',
        passport.authenticate('bnet', {
            scope: ['wow.profile']
        })
    );


    app.get('/auth/bnet/callback',
        passport.authenticate('bnet', { failureRedirect: '/'}),
        (req, res) => {
            res.send(req.user);
            console.log(res);
            console.log(req);          
        }
    );

    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', passport.authenticate('google'));

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
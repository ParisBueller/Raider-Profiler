const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy(['/auth/bnet', '/auth/google'], { target: 'http://localhost:5000'}));
}
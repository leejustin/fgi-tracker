module.exports = function () {
    var restify = require('restify');

    // Server
    var server = restify.createServer({
        name: 'fgiTracker',
        version: '1.0.0'
    });

    let baseUrl = '/api/v1/fgi/';
    
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.get(baseUrl + '/records', function (req, res, next) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        res.end("hello");
        return next();
    });

    server.listen(8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
};
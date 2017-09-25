module.exports = function () {
    var mongoose = require('mongoose');
    var restify = require('restify');

    var constants = require('./helper/constants');
    var FgiRecord = require('./model/fgiRecord');

    //TODO: CLEANUP
    let uri = `mongodb://${constants.db.automation.host}:${constants.db.automation.port}`;

    if (constants.db.automation.db) {
        uri = `${uri}/${constants.db.automation.db}`;
    }

    mongoose.Promise = global.Promise
    mongoose.connect(uri, { useMongoClient: true });
    //

    var server = restify.createServer({
        name: 'fgiTracker',
        version: '1.0.0'
    });

    let baseUrl = '/api/fgi/';

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.get(baseUrl + '/records', function (req, res, next) {

        var start = req.query.start;
        var end = req.query.end;

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        console.log(req.query);
        var start = new Date("2017-9-19");
        var end = new Date();

        FgiRecord.find({
            _id: {
              $gte: start,
              $lt: end
            }
          }, function(err, record) {
            if (err) throw err;
            res.write(JSON.stringify(record));
            res.end();

            return next();
          });
    });

    server.listen(8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
};
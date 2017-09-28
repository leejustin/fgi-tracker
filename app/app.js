module.exports = function () {
    var mongoose = require('mongoose');
    var restify = require('restify');

    var constants = require('./helper/constants');
    var FgiRecord = require('./model/fgiRecord');
    var FgiRecordDto = require('./dto/fgiRecordDto');

    //TODO: Clean up mongoose connection
    let uri = `mongodb://${constants.db.automation.host}:${constants.db.automation.port}`;

    if (constants.db.automation.db) {
        uri = `${uri}/${constants.db.automation.db}`;
    }

    mongoose.Promise = global.Promise
    mongoose.connect(uri, { useMongoClient: true });

    var server = restify.createServer({
        name: 'fgiTracker',
        version: '1.0.0'
    });

    let baseUrl = '/api/fgi/';

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.get(baseUrl + '/records/:id', function (req, res, next) {
        var start = new Date(req.params.id);

        var end = new Date();
        if ( isNaN(start.valueOf())) {
            //TODO: create and return errorDto
            res.write("error")
            res.end();
        } else {
            //TODO: clean up into helper
            start.setUTCHours(0);
            start.setMinutes(0);

            end.setDate(start.getDate() +1);
            end.setUTCHours(0);
            end.setMinutes(0);

            FgiRecord.find({
                _id: {
                    $gte: start,
                    $lt: end
                }
            }, function(err, records) {
                var dateVal = null;
                var closeVal = null;

                //TODO: error DTO
                if (err) throw err;
                
                if (records.length > 0) {
                    latestIndex = records.length - 1;
                    var dateVal = records[latestIndex]._id;
                    var closeVal = records[latestIndex].now;
                }

                res.write(JSON.stringify(new FgiRecordDto(dateVal, closeVal)));
                res.end();
            });
        }
    });

    server.get(baseUrl + '/records', function (req, res, next) {

        var start = req.query.start;
        var end = req.query.end;
        var date = req.query.date;

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
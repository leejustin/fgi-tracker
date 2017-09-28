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
        if (isNaN(start.valueOf())) {
            //TODO: create and return errorDto
            res.write("error")
            res.end();
            return next();
        }

        //TODO: clean up into helper
        start.setUTCHours(0);
        start.setMinutes(0);

        end.setDate(start.getDate() + 1);
        end.setUTCHours(0);
        end.setMinutes(0);

        FgiRecord.find({
            _id: {
                $gte: start,
                $lt: end
            }
        }, function (err, records) {
            var dateVal = null;
            var closeVal = null;

            //TODO: error DTO
            if (err) throw err;

            if (records.length > 0) {
                latestIndex = records.length - 1;
                var dateVal = records[latestIndex]._id;
                var closeVal = records[latestIndex].now;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.write(JSON.stringify(new FgiRecordDto(dateVal, closeVal)));
            res.end();
            return next();
        });

    });

    server.get(baseUrl + '/records/', function (req, res, next) {

        var start = new Date(req.query.start);
        var end = new Date(req.query.end);

        if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
            //TODO: create and return errorDto
            res.write("error")
            res.end();
            return next();            
        }

        //Clean up dates
        start.setUTCHours = 0;
        start.setMinutes = 0;
        end.setUTCHours = 0;
        end.setUTCMinutes = 0;

        FgiRecord.find({
            _id: {
                $gte: start,
                $lt: end
            }
        }, function (err, records) {
            if (err) throw err;
            console.log(records);
            var resVal = [];

            for (record in records) {
                resVal.push(new FgiRecordDto(record._id, record.now));
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });            
            res.write(JSON.stringify(resVal));
            res.end();

            return next();
        });
    });

    server.listen(8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
};
module.exports = function () {
    var mongoose = require('mongoose');
    var restify = require('restify');

    var constants = require('./helper/constants');
    var DateHelper = require('./helper/dateHelper');
    var FgiRecord = require('./model/fgiRecord');
    var FgiRecordDto = require('./dto/fgiRecordDto');

    let dateHelper = new DateHelper();

    //TODO: Clean up mongoose connection
    let uri = `mongodb://${constants.db.automation.user}:${constants.db.automation.pass}@${constants.db.automation.host}:${constants.db.automation.port}`;

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

    server.get(baseUrl + '/test/', function (req, res, next) {
        res.write("TESTING!");
        res.end();
        console.log("i ran a test");
        return next();
    });

    server.get(baseUrl + '/records/:id', function (req, res, next) {
        var dateRange;
        try {
            dateRange = dateHelper.getRange(req.params.id);
        } catch(e) {
            res.write(e);
            res.end();
            return next();
        }

        FgiRecord.find({
            _id: {
                $gte: dateRange.start,
                $lte: dateRange.end
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
        var dateRange;
        try {
            dateRange = dateHelper.getRange(req.query.start, req.query.end);
        } catch(e) {
            res.write(e);
            res.end();
            return next();
        }

        FgiRecord.find({
            _id: {
                $gte: dateRange.start,
                $lte: dateRange.end
            }
        }, function (err, records) {
            if (err) throw err;
            console.log(records);
            var resVal = [];

            records.forEach(function(record) {
                resVal.push(new FgiRecordDto(record._id, record.now));
            });
            
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
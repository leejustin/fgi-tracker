module.exports = function () {
    var mongoose = require('mongoose');
    var restify = require('restify');

    var ApiExceptionDto = require('./dto/apiExceptionDto');
    var GCloudDatastore = require('./scheduler/backup');
    var DateHelper = require('./helper/dateHelper');
    var FgiRecord = require('./model/fgiRecord');
    var FgiRecordDto = require('./dto/fgiRecordDto');
    var Scheduler = require('./scheduler/marketScheduler');
    
    let backup = new GCloudDatastore();
    let dateHelper = new DateHelper();
    let scheduler = new Scheduler();

    var server = restify.createServer({
        name: 'fgi-tracker',
        version: '0.9.0'
    });

    let baseUrl = '/api/fgi/';

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.throttle({burst:10,rate:3,ip:true}));

    server.get(baseUrl + '/records/:id', function (req, res, next) {
        var dateRange;
        try {
            dateRange = dateHelper.getRange(req.params.id);
        } catch(e) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
            res.write(JSON.stringify(new ApiExceptionDto(e)));
            res.end();
            return next();
        }

        FgiRecord.find({
            _id: {
                $gte: dateRange.start,
                $lte: dateRange.end
            }
        }, function (err, records) {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });            
                res.write(JSON.stringify(new ApiExceptionDto("We encountered an internal error.")));
                res.end();
            }

            var dateVal = null;
            var closeVal = null;

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
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
            res.write(JSON.stringify(new ApiExceptionDto(e)));
            res.end();
            return next();
        }

        FgiRecord.find({
            _id: {
                $gte: dateRange.start,
                $lte: dateRange.end
            }
        }, function (err, records) {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });            
                res.write(JSON.stringify(new ApiExceptionDto("We encountered an internal error.")));
                res.end();
            }
            //console.log(records);
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

    server.get(baseUrl + '/schedulers/', function (req, res, next) {

        if (req.header('X-Appengine-Cron') != 'true') {
            console.warn("Forbidden request was made:\n" + req);
            res.writeHeader(403);
            res.end();
            return next();
        }
    
        scheduler.runScheduler();
        
        res.writeHeader(200);
        res.end();
        return next();
    });

    server.get(baseUrl + '/schedulers/backup', function (req, res, next) {

        if (req.header('X-Appengine-Cron') != 'true') {
            console.warn("Forbidden request was made:\n" + req);
            res.writeHeader(403);
            res.end();
            return next();
        }

        backup.saveMostRecent();

        res.writeHeader(200);
        res.end();
        return next();
    })

    server.listen(8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
    
};
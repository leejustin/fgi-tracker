var mongoose = require('mongoose');
var constants = require('./app/helper/constants');
var schedule = require('node-schedule');
var GCloudDatastore = require('./app/scheduler/backup');
var Scheduler = require('./app/scheduler/marketScheduler');

let uri = `mongodb://${constants.db.automation.user}:${constants.db.automation.pass}@${constants.db.automation.host}:${constants.db.automation.port}`;
if (constants.db.automation.db) {
    uri = `${uri}/${constants.db.automation.db}`;
}
mongoose.Promise = global.Promise
mongoose.connect(uri, { useMongoClient: true });

let backup = new GCloudDatastore();
let scheduler = new Scheduler();

var jobOpen = schedule.scheduleJob("0 0 14 * * 1-5", function () {
    setTimeout(function () {
        console.log("Scheduler open run at " + (new Date()));
        scheduler.runScheduler();
    }, Math.floor(Math.random() * 60) * 1000);
});

var jobHalf = schedule.scheduleJob("0 0 17 * * 1-5", function () {
    setTimeout(function () {
        console.log("Scheduler half run at " + (new Date()));
        scheduler.runScheduler();
    }, Math.floor(Math.random() * 60) * 1000);
});

var jobClose = schedule.scheduleJob("0 30 20 * * 1-5", function () {
    setTimeout(function () {
        console.log("Scheduler close run at " + (new Date()));
        scheduler.runScheduler();
    }, Math.floor(Math.random() * 60) * 1000);
});

var jobClose = schedule.scheduleJob("0 45 20 * * 1-5", function () {
    setTimeout(function () {
        console.log("Backup run at " + (new Date()));
        backup.saveMostRecent();
    }, Math.floor(Math.random() * 60) * 1000);
});
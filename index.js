var mongoose = require('mongoose');
var constants = require('./app/helper/constants');

let uri = `mongodb://${constants.db.automation.user}:${constants.db.automation.pass}@${constants.db.automation.host}:${constants.db.automation.port}`;
if (constants.db.automation.db) {
    uri = `${uri}/${constants.db.automation.db}`;
}
mongoose.Promise = global.Promise
mongoose.connect(uri, { useMongoClient: true });

var scheduler = require('./app/scheduler/marketScheduler');
scheduler();

var api = require('./app/app')
api();
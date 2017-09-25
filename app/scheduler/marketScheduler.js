module.exports = function() {

    var schedule = require('node-schedule');

    var constants = require('../helper/constants');
    var fgiScraper = require('./fgiScraper');

    let scraper = new fgiScraper();
    console.log("well hello");
    scraper.run(); //remove

    var jobOpen = schedule.scheduleJob(constants.cron.marketOpen, function () {
        scraper.run();
    });

    var jobHalf = schedule.scheduleJob(constants.cron.marketHalf, function () {
        scraper.run();
    });

    var jobClose = schedule.scheduleJob(constants.cron.marketClose, function () {
        scraper.run();
    });
};
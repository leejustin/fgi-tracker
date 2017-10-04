module.exports = function() {

    var schedule = require('node-schedule');

    var constants = require('../helper/constants');
    var fgiScraper = require('./fgiScraper');

    let scraper = new fgiScraper();
    //scraper.run(); //remove

    var jobOpen = schedule.scheduleJob(constants.cron.marketOpen, function () {
        setTimeout(function () {
            scraper.run();
        }, Math.floor(Math.random() * 60) * 1000);
    });

    var jobHalf = schedule.scheduleJob(constants.cron.marketHalf, function () {
        setTimeout(function () {
            scraper.run();
        }, Math.floor(Math.random() * 60) * 1000);
    });

    var jobClose = schedule.scheduleJob(constants.cron.marketClose, function () {
        setTimeout(function () {
            scraper.run();
        }, Math.floor(Math.random() * 60) * 1000);
    });
};
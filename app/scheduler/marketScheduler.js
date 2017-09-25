module.exports = function() {

    var schedule = require('node-schedule');
    var fgiScraper = require('./fgiScraper');
    
    let cronEveryMinute = '*/1 * * * *';
    let cronMarketOpen = '0 14 * * 1-5';
    let cronMarketHalf = '0 17 * * 1-5';
    let cronMarketClose = '30 20 * * 1-5';

    var scraper = new fgiScraper();
    console.log("well hello");
    scraper.run(); //remove

    var jobOpen = schedule.scheduleJob(cronMarketOpen, function () {
        scraper.run();
    });

    var jobHalf = schedule.scheduleJob(cronMarketHalf, function () {
        scraper.run();
    });

    var jobClose = schedule.scheduleJob(cronMarketClose, function () {
        scraper.run();
    });
};
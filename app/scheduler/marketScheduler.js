module.exports = function() {

    const schedule = require('node-schedule');
    const fgiScraper = require('./fgiScraper');
    
    let cronEveryMinute = '*/1 * * * *';
    let cronMarketOpen = '0 14 * * 1-5';
    let cronMarketHalf = '0 17 * * 1-5';
    let cronMarketClose = '30 20 * * 1-5';

    const scraper = new fgiScraper();
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
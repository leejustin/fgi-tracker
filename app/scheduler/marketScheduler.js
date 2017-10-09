module.exports = function() {

    var constants = require('../helper/constants');
    var DateHelper = require('../helper/dateHelper');
    var fgiScraper = require('./fgiScraper');

    let dateHelper = new DateHelper();
    let scraper = new fgiScraper();

    this.runScheduler = function() {
        console.log("run scheduler");
        if (!dateHelper.isWeekend()) {
            setTimeout(function () {
                scraper.run();
            }, Math.floor(Math.random() * 60) * 1000);
        }
    };
};
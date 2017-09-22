const cheerio = require('cheerio');
const mongoose = require('mongoose');
const nconf = require('nconf');
const request = require('request');
const schedule = require('node-schedule');

const  FgiRecord = require('./models/fgiRecord');

//TODO create a constants file
nconf.argv().env().file('keys.json');
const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

let uri = `mongodb://${user}:${pass}@${host}:${port}`;
if (nconf.get('mongoDatabase')) {
  uri = `${uri}/${nconf.get('mongoDatabase')}`;
}

mongoose.Promise = global.Promise
mongoose.connect(uri, { useMongoClient: true });

var url = 'http://money.cnn.com/data/fear-and-greed/';
//TODO turn this into a mock object
/*
  Fear & Greed Now: 38 (Fear)
  Fear & Greed Previous Close: 38 (Fear)
  Fear & Greed 1 Week Ago: 49 (Neutral)
  Fear & Greed 1 Month Ago: 52 (Neutral)
  Fear & Greed 1 Year Ago: 69 (Greed)
*/
var regexNow = new RegExp('Now\\: \(\.\*\) \\(');
var regexPrevious = new RegExp('Close\\: \(\.\*\) \\(');
var regexWeek = new RegExp('Week Ago\\: \(\.\*\) \\(');
var regexMonth = new RegExp('Month Ago\\: \(\.\*\) \\(');
var regexYear = new RegExp('Year Ago\\: \(\.\*\) \\(');

//Set to market times in UTC
var cronEveryMinute = '*/1 * * * *';
var cronMarketOpen = '0 14 * * 1-5';
var cronMarketHalf = '0 17 * * 1-5';
var cronMarketClose = '30 20 * * 1-5';

function parseFearAndGreed(input, fgiRecord) {

  if (input.match('Now')) {
    objKey = 'now';
    fgiRecord.setClose(input.match(regexNow).pop());
  } else if (input.match('Previous')) {
    fgiRecord.setPrevious(input.match(regexPrevious).pop());
  } else if (input.match('Week')) {
    fgiRecord.setWeekAgo(input.match(regexWeek).pop());
  } else if (input.match('Month')) {
    fgiRecord.setMonthAgo(input.match(regexMonth).pop());
  } else if (input.match('Year')) {
    fgiRecord.setYearAgo(input.match(regexYear).pop());
  }
}

/* Scrape and save data from remote */
function scrapeData() {

  request(url, function (error, response, html) {

    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var fgiRecord = new FgiRecord();

      $('#needleChart li').each(function(i, elem) {
        var row = $(this).text();
        var parsed = parseFearAndGreed(row, fgiRecord);
      })

      console.log('Scrape results:\n' + fgiRecord);

      fgiRecord.save(function(err) {
          if (err) throw err;
          
          clearExistingDataFromToday(fgiRecord._id);
          console.log('FGI Record saved successfully!');
      });
    }
  });
}

/* Removes DB entries that were made today up to the end date */
function clearExistingDataFromToday(endDate) {

  var start = new Date();
  start.setHours(0,0,0,0);
  var end = new Date(endDate);

  FgiRecord.find({
    _id: {
      $gte: start,
      $lt: end
    }
  }, function(err, oldRecords) {
    if (err) throw err;
    
    //Remove each record found in the range
    for (i = 0; i < oldRecords.length; i++) {
      var recordId = oldRecords[i]._id;

      oldRecords[i].remove(function(err) {
        if (err) throw err;

        console.log('Removed _id: ' + recordId);
      });
    }
  });
}

var jobOpen = schedule.scheduleJob(cronMarketOpen, function() {
  console.log('=================\nMarket Open\n=================\n');
  scrapeData();
});

var jobHalf = schedule.scheduleJob(cronMarketHalf, function() {
  console.log('=================\nMarket Half\n=================\n');
  scrapeData();
});

var jobClose = schedule.scheduleJob(cronMarketClose, function() {
  console.log('=================\nMarket Close\n=================\n');
  scrapeData();
});

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

//TODO create config file
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/fgi', { useMongoClient: true });

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

request(url, function (error, response, html) {

  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    var FgiRecord = require('./models/fgiRecord');
    var fgiRecord = new FgiRecord();

    $('#needleChart li').each(function(i, elem) {
      var row = $(this).text();
      var parsed = parseFearAndGreed(row, fgiRecord);
    })

    console.log('=================\nScrape results:\n' + fgiRecord);
    fgiRecord.save(function(err) {
        if (err) throw err;

        console.log('FGI Record saved successfully!');
    });
  }
});
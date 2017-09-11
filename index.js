var request = require('request');
var cheerio = require('cheerio');

var url = 'http://money.cnn.com/data/fear-and-greed/';

var regexNow = new RegExp('Now\\: \(\.\*\) \\(');
var regexPrevious = new RegExp('Close\\: \(\.\*\) \\(');
var regexWeek = new RegExp('Week Ago\\: \(\.\*\) \\(');
var regexMonth = new RegExp('Month Ago\\: \(\.\*\) \\(');
var regexYear = new RegExp('Year Ago\\: \(\.\*\) \\(');

function parseFearAndGreed(input, parsedResults) {
  var objKey;
  var regex;

  if (input.match("Now")) {
    objKey = "now";
    regex = regexNow;
  } else if (input.match("Previous")) {
    objKey = "prev";
    regex = regexPrevious;
  } else if (input.match("Week")) {
    objKey = "week";
    regex = regexWeek;
  } else if (input.match("Month")) {
    objKey = "month";
    regex = regexMonth;
  } else if (input.match("Year")) {
    objKey = "year";
    regex = regexYear;
  }

  var parsedVal = input.match(regex).pop();

  if (parsedIsValid(parsedVal)) {
    parsedResults[objKey] = parsedVal;
    return parsedResults;
  }
}

/* Check to make sure what we parsed was actually valid */
function parsedIsValid(parsedVal) {
  var parsedAsInt = parseInt(parsedVal);

  if (parsedAsInt >= 0 && parsedAsInt <= 100) {
    return true;
  } else {
    return false;
  }
}

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    var parsedResults = {};

    $('#needleChart li').each(function(i, elem) {
      var row = $(this).text();
      var parsed = parseFearAndGreed(row, parsedResults);
    })

    console.log(parsedResults);
    /*
Fear & Greed Now: 38 (Fear)
Fear & Greed Previous Close: 38 (Fear)
Fear & Greed 1 Week Ago: 49 (Neutral)
Fear & Greed 1 Month Ago: 52 (Neutral)
Fear & Greed 1 Year Ago: 69 (Greed)
    */
  }
});
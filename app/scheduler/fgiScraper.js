module.exports = function() {

  var cheerio = require('cheerio');
  var mongoose = require('mongoose');
  var nconf = require('nconf');
  var request = require('request');

  var constants = require('../helper/constants');
  var FgiRecord = require('../model/fgiRecord');

  let url = constants.fgiUrl;

  let uri = `mongodb://${constants.db.automation.user}:${constants.db.automation.pass}@${constants.db.automation.host}:${constants.db.automation.port}`;

  if (constants.db.automation.db) {
    uri = `${uri}/${constants.db.automation.db}`;
  }

  mongoose.Promise = global.Promise
  mongoose.connect(uri, { useMongoClient: true });


  let regexNow = new RegExp('Now\\: \(\.\*\) \\(');
  let regexPrevious = new RegExp('Close\\: \(\.\*\) \\(');
  let regexWeek = new RegExp('Week Ago\\: \(\.\*\) \\(');
  let regexMonth = new RegExp('Month Ago\\: \(\.\*\) \\(');
  let regexYear = new RegExp('Year Ago\\: \(\.\*\) \\(');

  function parseFearAndGreed(input, fgiRecord) {

    if (input.match('Now')) {
      fgiRecord.set('now', input.match(regexNow).pop());
    } else if (input.match('Previous')) {
      fgiRecord.set('prev', input.match(regexPrevious).pop());
    } else if (input.match('Week')) {
      fgiRecord.set('week', input.match(regexWeek).pop());
    } else if (input.match('Month')) {
      fgiRecord.set('month', input.match(regexMonth).pop());
    } else if (input.match('Year')) {
      fgiRecord.set('year', input.match(regexYear).pop());
    }
  }

  /* Scrape and save data from remote */
  this.run = function() {
    console.log('running scraper');

    request(url, function (error, response, html) {

      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var fgiRecord = new FgiRecord();

        $('#needleChart li').each(function(i, elem) {
          var row = $(this).text();
          var parsed = parseFearAndGreed(row, fgiRecord);
        })
        
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

  return this;
};
module.exports = function () {

    var datastore = require('@google-cloud/datastore')();
    var mongoose = require('mongoose');

    var DateHelper = require('../helper/dateHelper');
    var FgiRecord = require('../model/fgiRecord');

    let dateHelper = new DateHelper();

    this.saveAll = function () {
        FgiRecord.find({}, function (err, records) {
            if (err) throw err;

            for (i = 0; i < records.length; i++) {
                var record = records[i];

                var key = datastore.key(['fgirecords']);

                var data = {
                    date: record._id,
                    year: record.year,
                    month: record.month,
                    week: record.week,
                    prev: record.prev,
                    now: record.now
                };

                datastore.save({
                    key: key,
                    data: data
                }, function (err) {
                    if (err) {
                        console.log(err);
                        console.log("Error has occured saving key.");
                    } else {
                        console.log("Save success!");
                    }
                })
            }
        });
    };

    this.saveMostRecent = function () {
        if (!dateHelper.isWeekend()) {
            FgiRecord.find({})
                .sort({ '_id': -1 })
                .limit(1)
                .exec(function (err, records) {
                    if (err) throw err;

                    var record = records[0];
                    var key = datastore.key(['fgirecords']);

                    var data = {
                        date: record._id,
                        year: record.year,
                        month: record.month,
                        week: record.week,
                        prev: record.prev,
                        now: record.now
                    };

                    datastore.save({
                        key: key,
                        data: data
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            console.log("Error has occured saving key.");
                        } else {
                            console.log("Save success for the record:\n");
                            console.log(record);
                        }
                    })
                });
        }
    };

    this.findAll = function () {
        var query = datastore.createQuery('fgirecords');

        datastore.runQuery(query, function (err, entities) {
            console.log("All matching entities:\n");
            console.log(entities);
        })
    };

    return this;
};
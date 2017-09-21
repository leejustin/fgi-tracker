var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fgiRecordSchema = new Schema({
    _id:        { type: Date, index: true, default: Date.now },
    close:      { type: Number, min: 0, max: 100, required: true },
    prev:       { type: Number, min: 0, max: 100 },
    week:       { type: Number, min: 0, max: 100 },
    month:      { type: Number, min: 0, max: 100 },
    year:       { type: Number, min: 0, max: 100 },
});

fgiRecordSchema.methods.setClose = function(input) {
    this.close = input;
};

fgiRecordSchema.methods.setPrevious = function(input) {
    this.prev = input;
};

fgiRecordSchema.methods.setWeekAgo = function(input) {
    this.week = input;
};

fgiRecordSchema.methods.setMonthAgo = function(input) {
    this.month = input;
};

fgiRecordSchema.methods.setYearAgo = function(input) {
    this.year = input;
};

var FgiRecord = mongoose.model('FgiRecord', fgiRecordSchema);

module.exports = FgiRecord;
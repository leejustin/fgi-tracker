var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fgiRecordSchema = new Schema({
    _id:        { type: Date, index: true, default: Date.now },
    close:      { type: Number, min: 0, max: 100, required: true },
    previous:   { type: Number, min: 0, max: 100 },
    weekAgo:    { type: Number, min: 0, max: 100 },
    monthAgo:   { type: Number, min: 0, max: 100 },
    yearAgo:    { type: Number, min: 0, max: 100 },
});

fgiRecordSchema.methods.setClose = function(input) {
    this.close = input;
};

fgiRecordSchema.methods.setPrevious = function(input) {
    this.previous = input;
};

fgiRecordSchema.methods.setWeekAgo = function(input) {
    this.weekAgo = input;
};

fgiRecordSchema.methods.setMonthAgo = function(input) {
    this.monthAgo = input;
};

fgiRecordSchema.methods.setYearAgo = function(input) {
    this.yearAgo = input;
};

var FgiRecord = mongoose.model('FgiRecord', fgiRecordSchema);

module.exports = FgiRecord;
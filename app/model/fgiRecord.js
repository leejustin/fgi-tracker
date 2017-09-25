const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var fgiRecordSchema = new Schema({
    _id:        { type: Date, index: true, default: Date.now },
    now:        { type: Number, min: 0, max: 100, required: true },
    prev:       { type: Number, min: 0, max: 100 },
    week:       { type: Number, min: 0, max: 100 },
    month:      { type: Number, min: 0, max: 100 },
    year:       { type: Number, min: 0, max: 100 },
});

var FgiRecord = mongoose.model('FgiRecord', fgiRecordSchema);

module.exports = FgiRecord;
module.exports = function() {

    class DateRange {
        constructor(start, end) {
            this.start = start;
            this.end = end;
        }
    }

    this.getRange = function(start, end = start) {
        var startDate = new Date(start);
        var endDate = new Date(end);

        if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
            //TODO: create and return errorDto
            throw 'error';
        }
        if (startDate > endDate) {
            //TODO: create and return errorDto
            throw 'invalid range';
        }
        
        startDate.setUTCHours(0);
        startDate.setMinutes(0);

        endDate.setUTCHours(23);
        endDate.setMinutes(59);

        return new DateRange(startDate, endDate);
    }
};
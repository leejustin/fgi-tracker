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
            throw 'Invalid date format.';
        }
        if (startDate > endDate) {
            throw 'The start date must be less than or equal to the end date.';
        }
        
        startDate.setUTCHours(0);
        startDate.setMinutes(0);

        endDate.setUTCHours(23);
        endDate.setMinutes(59);

        return new DateRange(startDate, endDate);
    }
};
class FgiRecordDto {
    constructor(date, value) {
        if (date != null) {
            var dateString = date.toISOString();
            this.date = dateString.split("T")[0];
        } else {
            this.date = null;
        }
        this.value = value
    }
}

module.exports = FgiRecordDto;
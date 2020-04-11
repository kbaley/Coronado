import moment from 'moment';

export function parseMmDdDate(dateText) {

    // See if a year was provided
    var mmddFormat = /(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])$/;
    var enteredYear = true;

    // If not, add it to the date to be parsed and make a note that they didn't
    // provide a year
    if (mmddFormat.test(dateText)) {
      dateText += "/" + new Date().getFullYear();
      enteredYear = false;
    }
    var date = moment(dateText, "MM/DD/YYYY");

    // If they didn't provide a year and the date ends up being later than today,
    // subtract a year. This helps when parsing dates like 12/30 when it's a new
    // year (from experience)
    if (date.isAfter(moment()) && !enteredYear) {
      date = date.subtract(1, 'years');
    }

    return date;
}
import moment from 'moment';

export function getDefaultDateTimeRange () {
    let todayDate = getTodayDate();
    let endDateTime = convertDateToEndDateTime(todayDate.format('YYYY-MM-DD'));
    let startDateTime = convertDateToStartDateTime(todayDate.add(-12, 'months').format('YYYY-MM-DD'));

    return {
        startDateTime: startDateTime,
        endDateTime: endDateTime
    };
}

export function getTodayDate () {
    return moment();
}

export function convertDateToStartDateTime (date) {
    return moment(date).startOf('day').utc().toISOString();
}

export function convertDateToEndDateTime (date) {
    return moment(date).endOf('day').utc().toISOString();
}

export function isFirstDateAfterSecondDate(firstDate, secondDate) {
    return moment(new Date(firstDate)).isAfter(new Date(secondDate)) ? true : false;
}

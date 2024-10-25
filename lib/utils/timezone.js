import moment from 'moment-timezone';

export function convertToUserTimezone(utcTimestamp, userTimezone) {
  return moment.utc(utcTimestamp).tz(userTimezone).format();
}

export function getCurrentTimezoneOffset(timezone) {
  return moment.tz(timezone).utcOffset();
}

export function listAllTimezones() {
  return moment.tz.names();
}
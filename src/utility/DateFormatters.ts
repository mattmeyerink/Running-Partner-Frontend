import moment from "moment";

/**
 * Converts standard date string into abbreviated written string
 * @param date Date string in format MM/DD/YYYY
 * @returns String in written format Apr 10th, 2021
 */
export function getStandardDateFormat(date: string) {
  return moment(date).format("MMM Do, YYYY");
}

/**
 * Converts standard date string into full written string
 * @param date Date string in format MM/DD/YYYY
 * @returns String in written format April 10th, 2021
 */
export function getLongDateFormat(date: string) {
  return moment(date).format("MMMM Do, YYYY");
}

/**
 * Converts standard date string into month/date string
 * @param date Date string in format MM/DD/YYYY
 * @returns String in written format April 10th
 */
export function getMonthDayFormat(date: string) {
  return moment(date).format("MMM Do");
}

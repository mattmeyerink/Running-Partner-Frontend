import moment from "moment";

export function getStandardDateFormat(date: string) {
  return moment(date).format("MMM Do, YYYY");
}

export function getLongDateFormat(date: string) {
  return moment(date).format("MMMM Do, YYYY");
}

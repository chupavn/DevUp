import moment from "moment";

export class DateFormatValueConverter {
  toView(value, format) {
    if (!value) return "";
    if (!format) format = "MMM DD, YYYY";

    const serverFormat = "YYYY-MM-DDTHH:mm:ss";

    if (!value) {
      return "";
    }

    if (moment(value, serverFormat).isValid()) {
      const date = moment.utc(value).local();
      return date.format(format);
    }

    return value;
  }
}

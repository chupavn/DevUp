import moment from "moment";

export class MonthDateValueConverter {
  toView(value, format, showAgo = true) {
    if (!value) return "";
    if (!format) format = `MMM DD`;

    const serverFormat = "YYYY-MM-DDTHH:mm:ss";

    if (!value) {
      return "";
    }

    if (moment(value, serverFormat).isValid()) {
      const date = moment.utc(value).local();
      format =
        "MMM DD" && !date.isSame(new Date(), "year") ? `MMM DD 'YY` : format;
      return (
        date.format(format) +
        (showAgo
          ? date.isSame(new Date(), "day")
            ? ` (${date.fromNow()})`
            : ""
          : "")
      );
    }

    return value;
  }
}

import moment from "moment";

export class DateService {
  public static dateFormat = "DD.MM.YYYY";
  public static dateServerFormat = "YYYY-MM-DD";

  public static isEqual(date1, date2): boolean {
    if (date1 === date2) return true;
    if ((!date1 && date2) || (date1 && !date2)) return false;
    return moment(moment(date1).toDate()).isSame(
      moment(moment(date2).toDate()),
      "day"
    );
  }

  public static getDateRangeByWeekNumber(
    week,
    year
  ): { dateStart: any; dateEnd: any } {
    const startDate = moment()
      .year(year)
      .isoWeek(week)
      .startOf("isoWeek")
      .toDate();
    const endDate = moment().year(year).isoWeek(week).endOf("isoWeek").toDate();
    return { dateStart: startDate, dateEnd: endDate };
  }

  public static getDateRangeByMonth(
    month,
    year
  ): { dateStart: any; dateEnd: any } {
    const startDate = moment()
      .year(year)
      .month(month)
      .startOf("month")
      .toDate();
    const endDate = moment().year(year).month(month).endOf("month").toDate();
    return { dateStart: startDate, dateEnd: endDate };
  }

  public static getDateRangeByYear(year): { dateStart: any; dateEnd: any } {
    const startDate = moment().year(year).month(0).startOf("month").toDate();
    const endDate = moment().year(year).month(11).endOf("month").toDate();
    return { dateStart: startDate, dateEnd: endDate };
  }

  public static getRangeYear(year, range) {
    const years = [];
    let thisYear = year - Math.round(range / 2) + 1;
    for (let index = 0; index < range; index++) {
      years.push(thisYear);
      thisYear += 1;
    }
    return years;
  }

  public static getWeeks(year): number[] {
    const lastWeekNumber = moment(
      `28.12.${year}`,
      this.dateFormat
    ).isoWeeksInYear();
    const weeks = [];
    for (let index = 1; index <= lastWeekNumber; index++) {
      weeks.push(index);
    }

    return weeks;
  }

  public static getFirstDayOfFirstWeekByYear(year) {
    // Create moment object for the first day of the given year
    const momentDate = moment({ year: year });
    // Check if 1st of January is in the first week of the year
    if (momentDate.isoWeek() !== 1) {
      // If not, add a week to the first day of the current week
      momentDate.startOf("isoWeek").add(1, "week");
    }
    // Return result using english locale
    return momentDate.toDate();
  }
}

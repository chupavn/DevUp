import {
  bindable,
  customElement,
  computedFrom,
  containerless,
  bindingMode,
} from "aurelia-framework";
import moment from "moment";
import { DateService } from "services/date-service";
// import { Dropdown } from './dropdown';

@containerless()
@customElement("datepicker-range")
export class DatepickerRange {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dateStart;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dateEnd;
  @bindable maxDate;
  @bindable showWeekNumber = true;
  @bindable horizontal = false;
  @bindable showCustom = false;

  @bindable pickerStart: any;
  @bindable pickerEnd: any;
  @bindable datepickerStart: any;
  @bindable datepickerEnd: any;

  @bindable placeholder = "";
  @bindable placeholderStart = "Start";
  @bindable placeholderEnd = "End";
  @bindable placement: "" | "bottom-start" | "left" = "";
  rangeString = null;
  activeRange = null;

  dateRangeSets = [];

  allDateRangeSets = [
    { code: "LAST_WEEK", name: "Last week", active: true },
    { code: "THIS_WEEK", name: "This week", active: true },
    { code: "NEXT_WEEK", name: "Next week" },
    { code: "LAST_MONTH", name: "Last month" },
    { code: "THIS_MONTH", name: "This month", active: true },
    { code: "NEXT_MONTH", name: "Next month" },
  ];

  weeks = [];
  visibleWeeks = [];
  weekFilter = { from: 1, to: 20 };
  months = [];
  years = [];
  yearCenter = null;
  thisYear = moment().year();

  popoverEl: any;
  weekPopoverEl: any;
  monthPopoverEl: any;
  yearPopoverEl: any;

  weekDropdown: any;
  monthDropdown: any;
  yearDropdown: any;

  constructor(private element: Element) {
    this.element = element;
    const isActive = (x) => {
      return x.active;
    };
    this.dateRangeSets = this.allDateRangeSets.filter(isActive);
  }

  dateStartChanged() {
    this.update();
  }

  dateEndChanged() {
    this.update();
  }

  pickerStartChanged() {
    this.update();
  }

  pickerEndChanged() {
    this.update();
  }

  attached() {
    this.update();
    this.getWeeks(this.yearCenter);
    this.months = moment.monthsShort();
    this.yearCenter = moment().year();
    this.years = DateService.getRangeYear(this.yearCenter, 12);
  }

  prevYear() {
    this.yearCenter -= 12;
    this.years = DateService.getRangeYear(this.yearCenter, 12);
  }

  goToThisYear() {
    this.yearCenter = moment().year();
    this.years = DateService.getRangeYear(this.yearCenter, 12);
  }

  nextYear() {
    this.yearCenter += 12;
    this.years = DateService.getRangeYear(this.yearCenter, 12);
  }

  getWeeks(year) {
    this.weeks = DateService.getWeeks(year);
    this.getVisibleWeeks();
  }

  getVisibleWeeks() {
    // if ((this.weekFilter.to > 40 && this.weekFilter.to < this.weeks.length) || this.weekFilter.to > this.weeks.length) this.weekFilter.to = this.weeks.length;
    this.visibleWeeks = this.weeks.filter(
      (x) => this.weekFilter.from <= x && this.weekFilter.to >= x
    );
  }

  prevWeekFilter() {
    if (this.weekFilter.from - 20 >= 1) {
      this.weekFilter.from -= 20;
      this.weekFilter.to -= 20;
      this.getVisibleWeeks();
    }
  }

  nextWeekFilter() {
    if (this.weekFilter.to + 20 <= 60) {
      this.weekFilter.from += 20;
      this.weekFilter.to += 20;
      //if (this.weekFilter.to > this.weeks.length) this.weekFilter.to = this.weeks.length;
      this.getVisibleWeeks();
    }
  }

  update() {
    this.rangeString = this.getRangeString();
    this.updateStartDate();
    this.updateEndDate();
  }

  updateStartDate() {
    const start = moment(this.dateStart, "YYYY-MM-DD").isValid()
      ? moment(this.dateStart).toDate()
      : null;
    this.pickerStart && this.pickerStart.setStartRange(start);
    this.pickerEnd && this.pickerEnd.setStartRange(start);
    this.pickerEnd && this.pickerEnd.setMinDate(start);
  }

  updateEndDate() {
    const end = moment(this.dateEnd, "YYYY-MM-DD").isValid()
      ? moment(this.dateEnd).toDate()
      : null;
    this.pickerStart && this.pickerStart.setEndRange(end);
    this.pickerStart && this.pickerStart.setMaxDate(end);
    this.pickerEnd && this.pickerEnd.setEndRange(end);
    this.pickerEnd && this.pickerEnd.gotoDate(end);
  }

  startChanged() {
    setTimeout(() => {
      const event = new CustomEvent("start-date-selected", {
        detail: { start: this.dateStart, end: this.dateEnd },
        bubbles: true,
      });

      this.element.dispatchEvent(event);
    });
  }

  endChanged() {
    setTimeout(() => {
      const event = new CustomEvent("end-date-selected", {
        detail: { start: this.dateStart, end: this.dateEnd },
        bubbles: true,
      });

      this.element.dispatchEvent(event);
    });
  }

  clearDates(event: Event = null) {
    event && event.stopPropagation();
    this.datepickerStart.clearPicker();
    this.datepickerEnd.clearPicker();
    this.activeRange = null;
  }

  //@computedFrom('dateStart', 'dateEnd')
  getRangeString(): string {
    const start =
      this.dateStart && moment(this.dateStart).isValid()
        ? moment(this.dateStart).format("DD.MM.YYYY")
        : "";
    const end =
      this.dateEnd && moment(this.dateEnd).isValid()
        ? moment(this.dateEnd).format("DD.MM.YYYY")
        : "";
    if (!start && !end) return null;
    if (start && !end) return `After ${start}`;
    if (!start && end) return `Before ${end}`;
    return start + " - " + end;
  }

  rangeStringChanged() {
    if (!this.rangeString) this.clearDates();
    const [start, end] = this.rangeString.split(" - ");
    const format = "DD.MM.YYYY";
    let s, e;
    if (
      start &&
      moment(start, format).isValid() &&
      !DateService.isEqual(this.dateStart, start)
    ) {
      s = moment.utc(start, format).format();
    }

    if (
      end &&
      moment(end, format).isValid() &&
      !DateService.isEqual(this.dateEnd, end)
    ) {
      e = moment.utc(end, format).format();
    }
    if (s && e && moment(s).isAfter(moment(e))) {
      this.getRangeString();
      return;
    }

    this.dateStart = s;
    this.dateEnd = e;

    this.getRangeString();
  }

  startPickerOpen() {
    // this.pickerEnd && !this.pickerEnd.isVisible() && this.pickerEnd.show();
  }

  endPickerOpen() {
    // this.pickerStart && !this.pickerStart.isVisible() && this.pickerStart.show();
  }

  showMoreRange() {
    this.dateRangeSets = this.allDateRangeSets;
  }

  toggleCustomPicker() {
    this.showCustom = !this.showCustom;
  }

  selectWeek(week, year) {
    const rangeDate = DateService.getDateRangeByWeekNumber(week, year);
    if (rangeDate) {
      const hasChange =
        !DateService.isEqual(this.dateStart, rangeDate.dateStart) ||
        !DateService.isEqual(this.dateEnd, rangeDate.dateEnd);

      this.dateStart = moment.utc(rangeDate.dateStart).format();
      this.dateEnd = moment.utc(rangeDate.dateEnd).format();

      hasChange &&
        setTimeout(() => {
          const event = new CustomEvent("date-selected", {
            bubbles: true,
          });

          this.element.dispatchEvent(event);
        });
    }
    this.weekPopoverEl.hide();
  }

  selectMonth(month, year) {
    const rangeDate = DateService.getDateRangeByMonth(month, year);
    if (rangeDate) {
      const hasChange =
        !DateService.isEqual(this.dateStart, rangeDate.dateStart) ||
        !DateService.isEqual(this.dateEnd, rangeDate.dateEnd);

      this.dateStart = moment.utc(rangeDate.dateStart).format();
      this.dateEnd = moment.utc(rangeDate.dateEnd).format();

      hasChange &&
        setTimeout(() => {
          const event = new CustomEvent("date-selected", {
            bubbles: true,
          });

          this.element.dispatchEvent(event);
        });
    }
    this.monthPopoverEl.hide();
  }

  selectYear(year) {
    const rangeDate = DateService.getDateRangeByYear(year);
    if (rangeDate) {
      const hasChange =
        !DateService.isEqual(this.dateStart, rangeDate.dateStart) ||
        !DateService.isEqual(this.dateEnd, rangeDate.dateEnd);

      this.dateStart = moment.utc(rangeDate.dateStart).format();
      this.dateEnd = moment.utc(rangeDate.dateEnd).format();

      hasChange &&
        setTimeout(() => {
          const event = new CustomEvent("date-selected", {
            bubbles: true,
          });

          this.element.dispatchEvent(event);
        });
    }
    this.yearPopoverEl.hide();
  }

  setDateRange(range) {
    this.activeRange = range.code;
    const year = new Date().getUTCFullYear();
    const month = new Date().getUTCMonth();
    const week = moment().isoWeek();
    const date = moment().utc();
    let rangeDate: { dateStart: any; dateEnd: any };
    switch (range.code) {
      case "LAST_WEEK":
        rangeDate = DateService.getDateRangeByWeekNumber(
          date.add(-1, "week").isoWeek(),
          date.add(-1, "week").year()
        );
        break;
      case "THIS_WEEK":
        rangeDate = DateService.getDateRangeByWeekNumber(week, year);
        break;
      case "NEXT_WEEK":
        rangeDate = DateService.getDateRangeByWeekNumber(
          date.add(1, "week").isoWeek(),
          date.add(1, "week").year()
        );
        break;
      case "LAST_MONTH":
        rangeDate = DateService.getDateRangeByMonth(
          date.add(-1, "month").month(),
          date.add(-1, "month").year()
        );
        break;
      case "THIS_MONTH":
        rangeDate = DateService.getDateRangeByMonth(month, year);
        break;
      case "NEXT_MONTH":
        rangeDate = DateService.getDateRangeByMonth(
          date.add(1, "month").month(),
          date.add(1, "month").year()
        );
        break;
      default:
        break;
    }

    if (rangeDate) {
      const hasChange =
        !DateService.isEqual(this.dateStart, rangeDate.dateStart) ||
        !DateService.isEqual(this.dateEnd, rangeDate.dateEnd);

      this.dateStart = moment.utc(rangeDate.dateStart).format();
      this.dateEnd = moment.utc(rangeDate.dateEnd).format();

      hasChange &&
        setTimeout(() => {
          const event = new CustomEvent("date-selected", {
            bubbles: true,
          });

          this.element.dispatchEvent(event);
        });
    }
  }
}

import { bindable, customElement, bindingMode } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import * as Pikaday from "pikaday";
import moment from "moment";
import { DateService } from "services/date-service";

@customElement("datepicker")
export class Datepicker {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) date;
  @bindable showWeekNumber = false;
  @bindable pickWholeWeek = false;
  @bindable inline = false;
  @bindable placeholder = "";

  @bindable picker: any;
  @bindable datepicker: any;
  private inputEl: HTMLInputElement;
  private calendarContainerEl: HTMLDivElement;
  private serverFormat = "YYYY-MM-DD";
  private format = "DD.MM.YYYY";
  private langSubscription: Subscription;

  constructor(
    private element: Element,
    private eventAggregator: EventAggregator
  ) {
    this.element = element;
  }

  dateChanged(newValue, oldValue) {
    if (this.picker) {
      if (this.date && moment(this.date, this.serverFormat).isValid()) {
        if (!DateService.isEqual(this.picker.getDate(), this.date)) {
          const momentDate = moment(this.date);
          this.picker.setDate(momentDate.toDate());
        }
      } else {
        this.picker.setDate(null);
        this.picker.clear();
      }
    }
  }

  attached() {
    this.datepicker = this;
    this.langSubscription = this.eventAggregator.subscribe(
      "language-changed",
      () => {
        this.setUpPicker();
      }
    );

    this.setUpPicker();
  }

  public setUpPicker() {
    if (this.picker) {
      this.picker.destroy();
      this.picker = null;
    }

    this.picker = new Pikaday({
      field: this.inputEl,
      firstDay: 1,
      format: this.format,
      showWeekNumber: this.showWeekNumber,
      pickWholeWeek: this.pickWholeWeek,
      keyboardInput: false,
      showDaysInNextAndPreviousMonths: false,
      enableSelectionDaysInNextAndPreviousMonths: false,
      numberOfMonths: 1,
      bound: !this.inline,
      container: this.inline ? this.calendarContainerEl : null,
      toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'DD.MM.YYYY' for simplicity
        if (moment(date, format).isValid()) {
          const momentDate = moment(date);
          if (this.pickWholeWeek) {
            return (
              "Week" + " " + moment(date).isoWeek() + ", " + moment(date).year()
            );
          }
          return momentDate.format(format);
        }
        return null;
      },
      parse(dateString, format) {
        if (moment(dateString, format).isValid()) {
          return moment(dateString, format).toDate();
        }
        return null;
      },
      onSelect: (date) => {
        if (!DateService.isEqual(date, this.date)) {
          this.date = moment.utc(this.picker.toString(), "DD.MM.YYYY").toDate();

          setTimeout(() => {
            const event = new CustomEvent("date-selected", {
              detail: this.date,
              bubbles: true,
            });

            this.element.dispatchEvent(event);
          });
        }
      },
      onOpen: () => {
        this.picker && this.picker.adjustPosition();
        const event = new CustomEvent("on-open", {
          detail: this.date,
          bubbles: true,
        });

        this.element.dispatchEvent(event);
      },
      i18n: {
        previousMonth: "Previous Month",
        nextMonth: "Next Month",
        months: moment.months(),
        weekdays: moment.weekdays(),
        weekdaysShort: moment.weekdaysShort(),
      },
    });
    if (moment(this.date, this.serverFormat).isValid()) {
      if (!DateService.isEqual(this.picker.getDate(), this.date)) {
        const momentDate = moment(this.date);
        this.picker.setDate(momentDate.toDate());
      }
    } else {
      this.picker.setDate(null);
    }
  }

  public showPicker(event: Event) {
    event.stopPropagation();
    if (!this.picker || this.picker.isVisible()) return;
    this.picker.show();
  }

  public clearPicker(event: Event) {
    event && event.stopPropagation();
    this.picker && this.picker.clear();
    this.date = null;
    setTimeout(() => {
      const event = new CustomEvent("date-selected", {
        detail: this.date,
        bubbles: true,
      });

      this.element.dispatchEvent(event);
    });
  }

  detached() {
    if (this.picker) {
      this.picker.destroy();
      this.picker = null;
    }

    if (this.langSubscription) {
      this.langSubscription.dispose();
    }
  }
}

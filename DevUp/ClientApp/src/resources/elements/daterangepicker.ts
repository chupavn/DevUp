import { bindable, customElement, bindingMode } from "aurelia-framework";
import moment from "moment";
import * as $ from "jquery";
import "daterangepicker";

@customElement("daterangepicker")
export class DateRangePicker {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) startDate;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) endDate;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) options; // see: http://www.daterangepicker.com/#options

  owningView: any;
  inputEl: HTMLInputElement;

  constructor(private element: Element) {
    this.element = element;
  }

  created(owningView) {
    this.owningView = owningView;
  }

  attached() {
    this.options = $.extend(
      true,
      {
        locale: {
          format: moment.HTML5_FMT.DATE,
        },
      },
      this.options
    );

    this.options = $.extend(this.options, {
      startDate: moment(this.startDate, this.options.locale.format),
      endDate: moment(this.endDate, this.options.locale.format),
    });

    $(this.inputEl).daterangepicker(this.options, (start, end) =>
      this.apply(start, end)
    );
  }

  apply(startDate, endDate) {
    this.startDate = startDate.format(this.options.locale.format);
    this.endDate = endDate.format(this.options.locale.format);
  }

  startDateChanged(newValue) {
    if (this.owningView.isAttached) {
      $(this.inputEl).data("daterangepicker").setStartDate(newValue);
    }
  }

  endDateChanged(newValue) {
    if (this.owningView.isAttached) {
      $(this.inputEl).data("daterangepicker").setEndDate(newValue);
    }
  }

  detached() {}
}

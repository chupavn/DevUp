import { FrameworkConfiguration } from "aurelia-framework";
import { PLATFORM } from "aurelia-pal";

export function configure(config: FrameworkConfiguration): void {
    config.globalResources([
        PLATFORM.moduleName("./value-converters/month-date"),
        PLATFORM.moduleName("./value-converters/date-format"),
        PLATFORM.moduleName("./value-converters/tag-name"),
        PLATFORM.moduleName("./value-converters/empty-dash"),
        PLATFORM.moduleName("./value-converters/reading-time"),
        PLATFORM.moduleName("./value-converters/mark-down-to-html"),
        PLATFORM.moduleName("./value-converters/upper-first"),
        PLATFORM.moduleName("./value-converters/blob-to-url"),
        PLATFORM.moduleName("./value-converters/file-list-to-array"),
        PLATFORM.moduleName("./value-converters/object-keys"),
        PLATFORM.moduleName("./attributes/on-enter"),
        PLATFORM.moduleName("./attributes/on-escape"),
        PLATFORM.moduleName("./attributes/infinite-scroll"),
        PLATFORM.moduleName("./attributes/tooltip"),
        PLATFORM.moduleName("./attributes/inputmask-custom-attribute"),
        PLATFORM.moduleName("./elements/au-tagify"),
        PLATFORM.moduleName("./elements/markdown-editor"),
        PLATFORM.moduleName("./elements/popover"),
        PLATFORM.moduleName("./elements/switch"),
        PLATFORM.moduleName("./elements/datepicker"),
        PLATFORM.moduleName("./elements/datepicker-range"),
        PLATFORM.moduleName("./elements/img-upload"),
        PLATFORM.moduleName("./elements/daterangepicker"),
    ]);
}

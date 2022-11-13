import { PLATFORM } from "aurelia-framework";
import { FormRenderer } from "./form-renderer";

export function configure(config) {
    config.container.registerHandler("form", (container) =>
        container.get(FormRenderer)
    );
}

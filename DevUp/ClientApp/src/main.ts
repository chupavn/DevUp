import { Aurelia } from "aurelia-framework";
import environment from "../config/environment.json";
import { PLATFORM } from "aurelia-pal";
import { initialState } from "./app/store/state"; // exported initialState object

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName("aurelia-http-client"))
    .plugin(PLATFORM.moduleName("aurelia-dialog"))
    .plugin(PLATFORM.moduleName("aurelia-validation"))
    .plugin(PLATFORM.moduleName("aurelia-animator-css"))
    .plugin(PLATFORM.moduleName("aurelia-after-attached-plugin"))
    .plugin(PLATFORM.moduleName("aurelia-ui-virtualization"))
    .plugin(PLATFORM.moduleName("@appex/aurelia-dompurify"))
    .feature(PLATFORM.moduleName("resources/index"))
    .feature(PLATFORM.moduleName("app/components/index"))
    .feature(PLATFORM.moduleName("app/validation/index"));

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
  }

  aurelia.use.plugin(PLATFORM.moduleName("aurelia-store"), { initialState });

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app/app")));
}

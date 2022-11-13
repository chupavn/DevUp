import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class AvatarImg {
    @bindable size: number = null;
    @bindable cssClass = "";
    @bindable imageSrc = null;
    imageSrcDefault = "https://picsum.photos/200";
    constructor() {
    }

    activate(params, routeConfig, navigationInstruction) {
        this.imageSrc = params.imageSrc;
        this.cssClass = params.cssClass;
    }
}

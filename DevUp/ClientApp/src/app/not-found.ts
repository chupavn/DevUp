import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class NotFound {
    @bindable additionalMessage:string;
}
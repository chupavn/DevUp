import { customAttribute, autoinject } from "aurelia-framework";

@autoinject
@customAttribute('on-enter')
export class OnEnter {
    private onEnter;
    private action;
    private element: Element;

    constructor(element: Element) {
        this.element = element;
        this.onEnter = (ev: KeyboardEvent) => {
            if (ev.keyCode !== 13) return;
            this.action();
            ev.stopPropagation();
            return false;
        };
    }

    attached() {
        this.element.addEventListener("keyup", this.onEnter);
    }

    valueChanged(func) {
        this.action = func;
    }

    detached() {
        this.element.removeEventListener("keyup", this.onEnter);
    }
}

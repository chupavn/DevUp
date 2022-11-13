import { customAttribute, autoinject } from "aurelia-framework";

@autoinject
@customAttribute('on-escape')
export class OnEnter {
    private onEnter;
    private action;
    private element: Element;

    constructor(element: Element) {
        this.element = element;
        this.onEnter = (ev: KeyboardEvent) => {
            if (ev.keyCode !== 27) return;
            this.action();
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

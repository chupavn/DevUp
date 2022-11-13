import { customAttribute, autoinject, bindable } from "aurelia-framework";
import tippy from 'tippy.js';
const t: any = tippy;

@autoinject
@customAttribute('tooltip')
export class Tooltip {
    private element: Element;
    private value: string;

    constructor(element: Element) {
        this.element = element;
    }

    bind() {
        if (!this.value) return;

        let options = {
            content: this.value,
            placement: 'top',
            delay: 100,
            arrow: true,
            animation: 'shift-away'
        };

        t(this.element, options);
    }
}

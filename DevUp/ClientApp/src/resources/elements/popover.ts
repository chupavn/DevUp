import {
    inject,
    customElement,
    bindable,
    DOM,
    bindingMode,
} from 'aurelia-framework';
import tippy, { followCursor } from 'tippy.js';
const t: any = tippy;
import * as $ from 'jquery';
import { hideOnEsc } from './tippyjs-plugins';

@customElement('popover')
@inject(DOM.Element)
export class Popover {
    public element: HTMLElement;
    public target: HTMLElement;
    public template: HTMLElement;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) popover: any;

    constructor(element) {
        this.element = element;
    }

    @bindable({ defaultValue: null })
    public triggerTarget: Element;

    @bindable public appendTo: string | Element;

    @bindable({ defaultValue: false })
    public arrow: boolean;

    @bindable({ defaultValue: [0, 20] })
    public delay: Array<number>;

    @bindable({ defaultValue: [275, 250] })
    public duration: Array<number>;

    @bindable({ defaultValue: 'click' })
    public trigger: string;

    @bindable({ defaultValue: 'top' })
    public placement: string;

    @bindable({ defaultValue: true })
    public interactive: boolean;

    @bindable({ defaultValue: 'light' })
    public theme: string;

    @bindable({ defaultValue: false })
    public hideOnClick: boolean;

    @bindable({ defaultValue: null })
    public onHidden: Function;

    @bindable({ defaultValue: null })
    public onShow: Function;

    @bindable focusFirstInput = false;

    @bindable({ defaultValue: 'shift-away' })
    public animation: string;

    @bindable({ defaultValue: '' })
    public animationCss: string = null;

    @bindable({ defaultValue: [0, 10] })
    public offset: any;

    @bindable({ defaultValue: false })
    public showOnCreate: boolean;

    @bindable({ defaultValue: 0 })
    public interactiveDebounce: number;

    @bindable({ defaultValue: true })
    public toggle: boolean;

    public attached(): void {
        const content = this.template;

        if (this.hideOnClick) {
            content.addEventListener('click', (e) => {
                this.popover.hide();
            });
        }

        const options = {
            arrow: this.arrow,
            content: content,
            delay: this.delay,
            duration: this.duration,
            interactive: this.interactive,
            trigger: this.trigger,
            placement: this.placement,
            theme: this.theme,
            triggerTarget: this.triggerTarget,
            animation: this.animation,
            showOnCreate: this.showOnCreate,
            hideOnClick: this.toggle ? 'toggle' : false,
            offset: this.offset,
            interactiveDebounce: this.interactiveDebounce,
            onClickOutside: (instance, event) => {
                if (
                    $(event.target).parents('.pika-single').length > 0 ||
                    $(event.target).parents('.flatpickr-calendar').length > 0
                )
                    return;
                this.popover.hide();
            },
            onMount: (instance) => {
                if (this.animationCss) {
                    const box = instance.popper.firstElementChild;
                    requestAnimationFrame(() => {
                        box.classList.add('animate__animated');
                        box.classList.add('animate__' + this.animationCss);
                    });
                    box.style.setProperty('--animate-duration', '0.3s');
                }
            },
            onHidden: (instance) => {
                if (this.animationCss) {
                    const box = instance.popper.firstElementChild;
                    box.classList.remove('animate__animated');
                    box.classList.remove('animate__' + this.animationCss);
                }

                if (this.onHidden) return this.onHidden();
            },

            plugins: [hideOnEsc],
        };

        if (this.appendTo) options['appendTo'] = this.appendTo;
        //if (this.onHidden) options['onHidden'] = this.onHidden;
        if (this.onShow) options['onShow'] = this.onShow;

        if (this.focusFirstInput) {
            options['onShow'] = () => {
                const el = content.querySelectorAll('input')[0];
                setTimeout(() => {
                    if (el) el.focus();
                }, 200);
            };
        }

        this.popover = t(this.element, options);


    }

    detached() {
        if (this.popover) {
            this.popover.destroy();
        }
    }
}

import Inputmask from 'inputmask';
import { autoinject, bindable, bindingMode, customAttribute } from 'aurelia-framework';

@autoinject
@customAttribute('inputmask-custom-attribute')
export class InputmaskCustomAttribute {
    // @bindable optionsStore: any = { showMaskOnHover: false /* any default options */ };
    constructor(private element: Element) {
        console.log('abc');

    }

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    value: string = '';
    ignoreChange: boolean;
    valueChanged() {
        if (!this.input) {
            return;
        }
        if (this.ignoreChange) {
            this.ignoreChange = false;
            return;
        }
        if (this.input.value !== this.value) {
            this.input.value = this.value || '';
            this.input.dispatchEvent(new CustomEvent('change'));
        }
        this.element.dispatchEvent(new CustomEvent('inputmask-change', { bubbles: true }));
    }

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    incompleteValue: string;

    @bindable({ primaryProperty: true })
    mask: string;
    maskChanged() {
        if (this.input && this.mask) {
            this.createInstance();
            this.instance.mask(this.input);
        }
    }

    @bindable
    isValueMasked: boolean;

    input: any;

    instance: Inputmask;

    @bindable
    options: Record<string, unknown>;

    attached() {
        if (this.element.tagName === 'INPUT') {
            this.input = this.element as HTMLInputElement;
        } else {
            this.input = this.element.querySelector('input');
            if (!this.input) {
                return;
            }
        }
        this.input.addEventListener('focusout', this.onInputChanged);
        this.input.addEventListener('change', this.onInputChanged);
        this.input.addEventListener('input', this.onInputChanged);
        this.createInstance();
        this.instance.mask(this.input);
        this.input.value = this.value || '';
        this.valueChanged();
    }

    createInstance() {
        const options = { ...this.options };
        this.instance = new Inputmask(this.mask, options);
    }

    detached() {
        this.input.removeEventListener('focusout', this.onInputChanged);
        this.input.removeEventListener('change', this.onInputChanged);
        this.input.removeEventListener('input', this.onInputChanged);
        this.input.inputmask.remove();
    }

    onInputChanged = () => {
        this.incompleteValue = this.input.inputmask.unmaskedvalue();
        const value = this.input.inputmask.isComplete() ? (this.isValueMasked ? this.input.value : this.incompleteValue) : undefined;
        if (this.value !== value) {
            this.ignoreChange = true;
            this.value = value;
        }
    };

}

class OptionsStore {
    options: Record<string, unknown> = {};
}

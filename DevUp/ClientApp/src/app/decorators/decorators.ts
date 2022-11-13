function Logger (logString: string) {
    return function(constructor: Function) {
        console.log(logString);
        console.log(constructor);
    };
}

function WithTemplate(template: string, hookId: string) {
    return function<T extends {new(...args: any[]): {name: string}}>(originalConstructor: T){
        return class extends originalConstructor {
            constructor(..._: any[]){
                super();
                console.log('Rendering template');
                const hookEl = document.getElementById(hookId);
                
                if (hookEl) {
                    hookEl.innerHTML = template;
                    hookEl.querySelector("h1")!.textContent = this.name;
                }
            }
        }
    }
}

@Logger('Logging - Person')
// @WithTemplate('<h1>My person object</h1>', 'app-decorator')
export class Person {
    name = "Ngoc";
    constructor() {
        console.log('Creating person object...');   
    }
}

//------
function Log(target: any, propertyName: string | symbol){
    console.log('Property decorator!');
    console.log(target);
    console.log(propertyName);
    
}

function Log2(target: any, name: string | Symbol, descriptor: PropertyDescriptor){
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(target: any, name: string, descriptor: PropertyDescriptor){
    console.log('get Price With Tax: ');
    console.log(target);
    console.log(name);
    console.log(descriptor);
    
}

function Log4(target: any, name: string, position: number){
    console.log('Log4 Parameter: ');
    console.log(target);
    console.log(name);
    console.log(position);
    
}

export class Product {
    @Log
    title: string;
    private _price: number;

    @Log2
    public set price(v : number) {
        if (v > 0) {
            this._price = v;
        } else {
            throw new Error('Invalid price - should be positive');
        }
    }
    

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }

    @Log3
    getPriceWithTax(@Log4 tax: number) {
        return this._price * (1 + tax);
    }
}


function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

export class Printer {
    message = 'This works';

    @AutoBind
    showMessage() {
        console.log(this.message);
    }
}

// -----

interface ValidatorConfig {
    [property: string]: {
        [validateAbleProp: string]: string[] // ['required', 'positive']
    }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['required']
    };
}

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['positive']
    };
}

export function validateObj(obj: object){
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }

    return isValid;
}

export class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number){
        this.title = t;
        this.price = p;
    }
}


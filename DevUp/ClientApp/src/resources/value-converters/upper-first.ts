
export class UpperFirstValueConverter {
    toView(value: string) {
        if (!value) return '';

        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}

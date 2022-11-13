
export class TagNameValueConverter {
    toView(value) {
        if (!value) return '';

        return `#${value}`;

    }
}

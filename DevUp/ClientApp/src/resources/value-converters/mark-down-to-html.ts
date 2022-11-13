
import * as showdown from 'showdown';

export class markDownToHtmlValueConverter {
    toView(value) {
        if (!value) return '';

        return new showdown.Converter().makeHtml(value);

    }
}

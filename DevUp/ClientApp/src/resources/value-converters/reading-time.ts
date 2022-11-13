
export class ReadingTimeValueConverter {
    toView(value) {
        if (!value) return 0;
        const wpm = 225;
        const words = value.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        return time;

    }
}

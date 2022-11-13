
export class EmptyDashValueConverter {
    toView(value) {
        if (!value) return '-';

        return value;

    }
}

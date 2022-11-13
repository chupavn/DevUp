export class BlobToUrlValueConverter {
    toView(blob) {
        return blob && URL.createObjectURL(blob) || null;
    }
}
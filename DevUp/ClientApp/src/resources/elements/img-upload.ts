import { autoinject } from "aurelia-framework";
import { UploadService } from "services/upload-service";

@autoinject
export class ImgUpload {
    private uploading = false;
    private copied = false;
    private fileInputEl: HTMLInputElement;
    private files: FileList;
    private imgUrl = null;
    private imgUrlEl: HTMLInputElement;

    constructor(
        private uploadService: UploadService,
    ) {

    }

    showUploadForm() {
        if (this.uploading) return;
        this.fileInputEl.click();
    }

    async uploadImg() {
        try {
            if (this.files && this.files.length === 1) {
                this.uploading = true;
                const uploadResult = await this.uploadService.UploadFile(this.files[0]);
                this.imgUrl = `![Alt Text](${uploadResult.content.url})`;
                this.copied = false;
                this.files = null;
                this.uploading = false;
            }
        } catch (error) {
            console.log(error);
            this.uploading = false;
        }
    }

    copyUrl() {
        const el = document.createElement('textarea');
        el.value = this.imgUrl;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.copied = true;
    }
}

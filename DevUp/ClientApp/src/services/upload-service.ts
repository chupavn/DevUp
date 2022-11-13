import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject
export class UploadService {
    private httpClient: HttpClient;
    constructor() {
        this.httpClient = new HttpClient();

        this.httpClient.configure(config => {
            config
                .withBaseUrl(`api/upload`)
                .withHeader('Accept', '*/*')
                .withHeader('credentials', 'same-origin');
        });
    }

    public UploadFile(file) {
        var form = new FormData()
        // form.append('id', id.toString());
        // form.append('type', type);
        // form.append('tempId', tempguid);
        // form.append('isRevision', isRevision.toString());
        form.append('files', file);

        return this.httpClient.post('', form);
    }

    public UploadAvatar(file) {
        var form = new FormData()
        form.append('files', file);

        return this.httpClient.post('/upload-avatar', form);
    }
}

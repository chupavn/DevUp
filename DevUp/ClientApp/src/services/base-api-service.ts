import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

declare const saveAs;

@autoinject
export class BaseApiService {
    protected controllerUrl: string;
    protected cachedObjects: Array<any> = null;
    protected httpClient: HttpClient;

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl;

        const httpClient = new HttpClient();

        httpClient.configure(config => {
            config
                .withBaseUrl(`api/`)
                .withCredentials(true)
                .withHeader('Accept', 'application/json')
                .withHeader('Content-Type', 'application/json')
                .withInterceptor(this.addInterceptor());
        });

        this.httpClient = httpClient;
    }

    private addInterceptor() {

        return {
            request(request) {
                return request;
            }
        }
    }

    public get(url: string): Promise<any> {
        return this.httpClient
            .get(this.controllerUrl + url)
            .then(res => res.content);
    }

    public getAll(url: string): Promise<any> {
        return this.httpClient
            .get(this.controllerUrl + url)
            .then(res => {
                return res.content;
            });
    }

    public clearCache() {
        this.cachedObjects = null;
    }

    public getAllCached(url: string): Promise<Array<any>> {
        // if the cache is already filled, return that - if not, fill the cache and return it
        if (this.cachedObjects) {
            return Promise.resolve(this.cachedObjects);
        }

        return this.getAll(url)
            .then(res => {
                this.cachedObjects = res;
                return res;
            });
    }

    public post(url: string, body: any): Promise<any> {
        return this.httpClient.post(this.controllerUrl + url, JSON.stringify(body)).then(res => res.content);
    }

    public put(url: string, body: any): Promise<any> {
        return this.httpClient.put(this.controllerUrl + url, JSON.stringify(body)).then(res => res.content);
    }

    public delete(url: string): Promise<any> {
        return this.httpClient.delete(this.controllerUrl + url);
    }

    public getWithBlobResponse(url: string, filename: string): Promise<any> {

        return this.httpClient.createRequest(this.controllerUrl + url)
            .withResponseType('blob')
            .asGet()
            .send()
            .then(response => {
                return saveAs(response.content, filename);
            });
    }

    public postWithBlobResponse(url: string, body: any, filename: string): Promise<any> {

        return this.httpClient.createRequest(this.controllerUrl + url)
            .withContent(JSON.stringify(body))
            .withResponseType('blob')
            .asPost()
            .send()
            .then(response => {
                return saveAs(response.content, filename);
            });
    }

    public objectToQueryString(queryParameters) {
        return queryParameters
            ? Object.entries(queryParameters).reduce((queryString, [key, val], index) => {
                const symbol = queryString.length === 0 ? '?' : '&';
                queryString += val ? `${symbol}${key}=${val}` : '';
                return queryString;
            }, '')
            : '';
    };

    public getGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

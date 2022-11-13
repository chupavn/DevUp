import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class TagService extends BaseApiService {

    constructor() {
        super('tags');
    }

    public getFollowingTags(): Promise<any> {
        return this.get(`/get-following-tags`);
    }

    public getByName(tagName: string): Promise<any> {
        return this.get(`/get-by-name/${tagName}`);
    }

    public followTag(tagId: number): Promise<any> {
        return this.put(`/${tagId}/follow-tag`, {});
    }

    public unFollowTag(tagId: number): Promise<any> {
        return this.put(`/${tagId}/unfollow-tag`, {});
    }

}

import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class ArticleService extends BaseApiService {

    constructor() {
        super('articles');
    }

    public published(articleId: number): Promise<any> {
        return this.put(`/${articleId}/published`, {});
    }

    public unpublished(articleId: number): Promise<any> {
        return this.put(`/${articleId}/unpublished`, {});
    }

    public likeArticle(articleId: number): Promise<any> {
        return this.put(`/${articleId}/like-article`, {});
    }

    public unlikeArticle(articleId: number): Promise<any> {
        return this.put(`/${articleId}/unlike-article`, {});
    }

    public addToReadingList(articleId: number): Promise<any> {
        return this.put(`/${articleId}/add-to-reading-list`, {});
    }

    public removeReadingList(articleId: number): Promise<any> {
        return this.put(`/${articleId}/remove-reading-list`, {});
    }

    public archiveReadingList(articleId: number): Promise<any> {
        return this.put(`/${articleId}/archive-reading-list`, {});
    }

    public unArchiveReadingList(articleId: number): Promise<any> {
        return this.put(`/${articleId}/unarchive-reading-list`, {});
    }
}

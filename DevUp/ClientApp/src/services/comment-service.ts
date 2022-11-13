import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class CommentService extends BaseApiService {

    constructor() {
        super('comments');
    }

    public likeComment(commentId: number): Promise<any> {
        return this.put(`/${commentId}/like-comment`, {});
    }

    public unlikeComment(commentId: number): Promise<any> {
        return this.put(`/${commentId}/unlike-comment`, {});
    }
}

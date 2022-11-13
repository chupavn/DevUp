import { DialogService } from 'aurelia-dialog';
import { autoinject, bindable } from 'aurelia-framework';
import { ArticleService } from 'services/article-service';
import { AuthService } from 'services/auth-service';

@autoinject
export class Tags {
    @bindable tags: any[];
    @bindable showColor = false;
}

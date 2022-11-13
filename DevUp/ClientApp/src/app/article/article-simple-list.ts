import { DialogService } from 'aurelia-dialog';
import { autoinject, bindable } from 'aurelia-framework';
import { ArticleService } from 'services/article-service';
import { AuthService } from 'services/auth-service';
import { RouterConfiguration, Router } from 'aurelia-router';
import { UserService } from 'services/user-service';

@autoinject
export class ArticleSimpleList {
    @bindable articles: any[] = [];
    @bindable showTags = false;

    constructor(
        private articleService: ArticleService,
        private userService: UserService,
        private router: Router,
    ) { }

    articlesChanged() {
        this.articles.forEach(article => {
            article._slugId = `${article.slug}-${article.id}`;
        });

    }

    openArticleDetail(article) {
        this.router.navigateToRoute('article-details', { id: article.slug + '-' + article.id });
    }
}

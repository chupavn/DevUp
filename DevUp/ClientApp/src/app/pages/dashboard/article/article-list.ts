import { Router } from "aurelia-router";
import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class ArticleList {
    @bindable articles: any[];

    constructor(private router: Router) {}

    editArticle(article) {
        this.router.navigateToRoute("edit-article", { id: article.id });
    }
}

import { DialogService } from "aurelia-dialog";
import { autoinject, bindable } from "aurelia-framework";
import { ArticleService } from "services/article-service";
import { AuthService } from "services/auth-service";
import { RouterConfiguration, Router } from "aurelia-router";

@autoinject
export class ArticleByTagSimple {
    @bindable tagName: string = "";
    @bindable top: number = 5;
    private articles: any[] = [];
    childElement: any;

    constructor(
        private articleService: ArticleService,
        private router: Router
    ) {}

    bind(bindingContext: Object, overrideContext: Object) {
        this.articleService
            .get(`?tagName=${this.tagName}&top=${this.top}&publishedOnly=true`)
            .then((res) => {
                this.articles = res;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

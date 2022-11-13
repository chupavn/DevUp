import { DialogService } from "aurelia-dialog";
import { autoinject, bindable } from "aurelia-framework";
import { ArticleService } from "services/article-service";
import { AuthService } from "services/auth-service";
import { RouterConfiguration, Router } from "aurelia-router";
import { UserService } from "services/user-service";

@autoinject
export class ArticleByAuthorSimple {
    @bindable authorId: string = "";
    @bindable top: number = 5;
    private articles: any[] = [];
    @bindable author: any;

    constructor(
        private articleService: ArticleService,
        private userService: UserService,
        private router: Router
    ) {}

    authorIdChanged() {
        this.fetch();
    }

    fetch() {
        this.articleService
            .get(
                `?authorId=${this.authorId}&top=${this.top}&publishedOnly=true`
            )
            .then((res) => {
                this.articles = res;
            })
            .catch((err) => {
                console.log(err);
            });

        // this.userService.get(`/${this.authorId}`)
        // .then(res=>{
        //     this.author = res;
        // })
        // .catch(err=>{
        //     console.log(err);

        // });
    }
}

import { autoinject, bindable } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { connectTo } from "aurelia-store";
import { State } from "../../store/state";
import { dispatchify, Store } from "aurelia-store";
import { UserService } from "services/user-service";
import { ArticleService } from "services/article-service";

@connectTo()
@autoinject
export class Profile {
    private state: State;
    private userId: string;
    private user: any;
    private articles: any[];

    constructor(
        private userService: UserService,
        private articleService: ArticleService,
        private router: Router
    ) {}

    activate(params, routeConfig, navigationInstruction) {
        this.userId = params.userId;
        // if (userId) {
        //     let arr = userId.split('-');
        //     this.userId = arr[arr.length - 1];
        // }
        this.fetchUser();
        this.fetArticles();
    }

    async fetchUser() {
        try {
            this.user = await this.userService.getUserProfile(this.userId);
        } catch (error) {
            console.log(error);
        }
    }

    async fetArticles() {
        try {
            this.articles = await this.articleService.get(
                `?authorId=${this.userId}&publishedOnly=true`
            );
            this.articles.forEach((article) => {
                article._slugId = `${article.slug}-${article.id}`;
            });
        } catch (error) {
            console.log(error);
        }
    }

    editProfile() {
        this.router.navigateToRoute("settings");
    }
}

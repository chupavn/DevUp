import { DialogService } from "aurelia-dialog";
import { autoinject, TaskQueue } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { connectTo } from "aurelia-store";
import { ArticleService } from "services/article-service";
import { TagService } from "services/tag-service";
import { State } from "../store/state";

@connectTo()
@autoinject
export class Home {
    private state: State;

    private articles: any[] = [];
    private allTags: any[] = [];
    private followingTags: any[] = [];
    private moreMenuVisible = false;

    private topBy:
        | ""
        | "week"
        | "month"
        | "year"
        | "month"
        | "infinity"
        | "latest" = "";

    getting = false;
    page = 1;
    pageSize = 10;
    hasNextPage = true;

    constructor(
        private router: Router,
        private articleService: ArticleService,
        private tagService: TagService,
        private dialogService: DialogService
    ) {}

    getData() {
        console.log("Get more start");
        if (this.getting || !this.hasNextPage) return;
        console.log("Get more calling");
        this.getting = true;
        this.articleService
            .get(
                `?top=${this.pageSize}&skip=${
                    (this.page - 1) * this.pageSize
                }&publishedOnly=true`
            )
            .then((res) => {
                res.forEach((article) => {
                    article._slugId = `${article.slug}-${article.id}`;
                });
                let articles = [...this.articles, ...res];

                this.articles = articles;
                this.getting = false;
                if (res && res.length === this.pageSize)
                    this.hasNextPage = true;
                else this.hasNextPage = false;
                this.page += 1;
            })
            .catch((err) => {
                console.log(err);
                this.getting = false;
            });
    }

    bind(bindingContext: Object, overrideContext: Object) {
        this.fetch();
    }

    activate(params, routeConfig, navigationInstruction) {
        this.topBy = params.topBy;
        if (this.topBy) {
            this.router.navigate(`/top/${this.topBy}`, { trigger: false });
        }
    }

    fetch() {
        Promise.all([
            // this.articleService.getAll(''),
            this.state.auth.loggedIn
                ? this.tagService.getFollowingTags()
                : this.tagService.getAll(""),
        ])
            .then((res) => {
                // this.articles = res[0];
                // this.articles.forEach(article => {
                //     article._slugId = `${article.slug}-${article.id}`;
                // });
                this.allTags = res[0];
                this.followingTags = res[0];
            })
            .catch((err) => {
                console.log(err);
            });
    }

    setTopBy(
        topBy:
            | ""
            | "week"
            | "month"
            | "year"
            | "month"
            | "infinity"
            | "latest" = ""
    ) {
        this.topBy = topBy;
        if (this.topBy) {
            this.router.navigate(`/top/${this.topBy}`, { trigger: false });
        } else {
            this.router.navigate(``, { trigger: false });
        }
    }

    goTo(routeName: string) {
        this.router.navigateToRoute(routeName);
    }

    login() {
        this.router.navigateToRoute("enter");
    }

    register() {
        this.router.navigateToRoute("enter", { state: "new-user" });
    }

    showMoreMenu() {
        this.moreMenuVisible = true;
    }
}

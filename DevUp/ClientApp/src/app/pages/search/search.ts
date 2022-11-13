import { autoinject } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { connectTo, dispatchify } from "aurelia-store";
import { State } from "../../store/state";
import { ArticleService } from "services/article-service";
import { setFilterValue } from "app/store/actions/filters";
import { UserService } from "services/user-service";

@connectTo()
@autoinject
export class Search {
    private state: State;
    private q = null;
    private filters: null | "allArticles" | "myArticles" | "people" = null;
    private sortBy = null;
    private sortDirection = null;
    private articles: any[];
    private peoples: any[];

    constructor(
        private articleService: ArticleService,
        private userService: UserService,
        private router: Router
    ) {}

    activate(params) {
        this.q = params.q;
        dispatchify(setFilterValue)(this.q);

        this.filters = params.filters;
        this.sortBy = params.sort_by;
        this.sortDirection = params.sort_direction;
        this.fetch();
    }

    deactivate() {
        dispatchify(setFilterValue)("");
    }

    async fetch() {
        try {
            if (this.filters !== "people") {
                let articles = await this.articleService.get(
                    `${this.getParamsString()}`
                );
                articles.forEach((article) => {
                    article._slugId = `${article.slug}-${article.id}`;
                });
                this.articles = articles;
            } else {
                let peoples = await this.userService.get(
                    `${this.getParamsString()}`
                );
                this.peoples = peoples;
            }
        } catch (error) {
            console.log(error);
        }
    }

    setSortBy(sortBy, sortDirection) {
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;

        this.router.navigate(`search${this.getParamsString()}`, {
            trigger: false,
        });
        this.fetch();
    }

    setFilters(filters) {
        this.filters = filters;
        this.router.navigate(`search${this.getParamsString()}`, {
            trigger: false,
        });
        this.fetch();
    }

    getParamsString(): string {
        return this.articleService.objectToQueryString({
            q: this.q,
            filters: this.filters,
            sort_by: this.sortBy,
            sort_direction: this.sortDirection,
            publishedOnly: true,
        });
    }
}

import { DialogService } from "aurelia-dialog";
import { autoinject, bindable } from "aurelia-framework";
import { ArticleService } from "services/article-service";
import { AuthService } from "services/auth-service";
import { RouterConfiguration, Router } from "aurelia-router";

@autoinject
export class ReadingList {
    private tags: any[] = [];
    private allArticles: any[];
    private articles: any[];
    private activeTag = null;

    private searchText: string = null;
    private viewingArchive = false;

    constructor(
        private articleService: ArticleService,
        private router: Router
    ) {}

    bind(bindingContext: Object, overrideContext: Object) {
        // this.fetch();
    }

    async activate(params, routeConfig, navigationInstruction) {
        if (params.archive === "archive") this.viewingArchive = true;
        await this.fetch();
        this.search();
    }

    selectTag(tag: string = null) {
        this.activeTag = tag;
        this.search();
    }

    search() {
        let visibleArticles = [];
        let searchText = this.searchText?.toLowerCase() ?? null;
        visibleArticles = this.allArticles.filter(
            (x) =>
                (!this.activeTag ||
                    x.tags.some((t) => t.id === this.activeTag.id)) &&
                (!this.searchText ||
                    x.title.toLowerCase().indexOf(searchText) !== -1 ||
                    x.author.name.toLowerCase().indexOf(searchText) !== -1 ||
                    x.tags.some(
                        (t) => t.name.toLowerCase().indexOf(searchText) !== -1
                    )) &&
                ((this.viewingArchive && x.isArchivedReadingList) ||
                    (!this.viewingArchive && !x.isArchivedReadingList))
        );
        this.articles = [...visibleArticles];
    }

    async fetch() {
        await this.articleService
            .get(`?readingListOnly=true&publishedOnly=true`)
            .then((res) => {
                this.allArticles = res;
                this.articles = JSON.parse(JSON.stringify(this.allArticles));
                this.allArticles.forEach((article) => {
                    article._slugId = `${article.slug}-${article.id}`;
                    article.tags.forEach((tag) => {
                        if (!this.tags.some((t) => t.id === tag.id)) {
                            this.tags.push(tag);
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    archive(article) {
        this.articleService
            .archiveReadingList(article.id)
            .then((res) => {
                article.isArchivedReadingList = res.isArchivedReadingList;
                this.search();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    unarchive(article) {
        this.articleService
            .unArchiveReadingList(article.id)
            .then((res) => {
                article.isArchivedReadingList = res.isArchivedReadingList;
                this.search();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleViewArchive() {
        if (this.viewingArchive) {
            this.viewingArchive = false;
            this.router.navigate("/reading-list", { trigger: false });
            this.search();
        } else {
            this.viewingArchive = true;
            this.router.navigate(`/reading-list/archive`, { trigger: false });
            this.search();
        }
    }

    openArticleDetail(article) {
        this.router.navigateToRoute("article-details", {
            id: article.slug + "-" + article.id,
        });
    }
}

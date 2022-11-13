import { EnterDialog } from "app/auth/enter-dialog";
import { DialogService } from "aurelia-dialog";
import { autoinject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { connectTo } from "aurelia-store";
import { ArticleService } from "services/article-service";
import { State } from "../store/state";

@connectTo()
@autoinject
export class ArticleListFull {
    private state: State;

    @bindable articles: any[] = [];
    listEl: HTMLElement;

    constructor(
        private router: Router,
        private articleService: ArticleService,
        private dialogService: DialogService
    ) {}

    attached() {}

    openArticleDetail(article, gotoComments = false) {
        if (!gotoComments) {
            this.router.navigateToRoute("article-details", {
                id: article.slug + "-" + article.id,
            });
        } else {
            let urlId = article.slug + "-" + article.id;
            this.router.navigate(`#/articles/${urlId}/#comments`);
        }
    }

    addToReadingList(article) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({
                viewModel: EnterDialog,
                overlayDismiss: true,
            });
            return;
        }

        this.articleService
            .addToReadingList(article.id)
            .then((res) => {
                article.isReadingList = true;
                article.likedCount = article.likedCount + 1;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    removeReadingList(article) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({
                viewModel: EnterDialog,
                overlayDismiss: true,
            });
            return;
        }

        this.articleService
            .removeReadingList(article.id)
            .then((res) => {
                article.isReadingList = false;
                article.likedCount = article.likedCount - 1;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    goTo(routeName: string) {
        this.router.navigateToRoute(routeName);
    }
}

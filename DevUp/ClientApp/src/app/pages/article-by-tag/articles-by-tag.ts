import { autoinject, bindable } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { TagService } from "services/tag-service";
import { connectTo } from "aurelia-store";
import { State } from "../../store/state";
import { DialogService } from "aurelia-dialog";
import { EnterDialog } from "app/auth/enter-dialog";
import { ArticleService } from "services/article-service";
import Flicking from "@egjs/flicking";
import { AutoPlay } from "@egjs/flicking-plugins";
import "@egjs/flicking/dist/flicking.css";

@connectTo()
@autoinject
export class ArticlesByTag {
    private state: State;
    private tagName: string;
    private tag: number;
    private articles: any[] = [];
    private moderators: any[] = [];

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
        private tagService: TagService,
        private dialogService: DialogService,
        private router: Router,
        private articleService: ArticleService
    ) {
        for (let index = 0; index < 10; index++) {
            this.moderators.push({ imageSrc: "https://picsum.photos/200" });
        }
    }

    async activate(params, routeConfig, navigationInstruction) {
        try {
            this.tagName = params.tagName;
            this.topBy = params.topBy;
            if (this.topBy) {
                this.router.navigate(`/t/${this.tagName}/top/${this.topBy}`, {
                    trigger: false,
                });
            }

            this.tag = await this.tagService.getByName(this.tagName);
        } catch (error) {
            console.log(error);
        }
    }

    afterAttached() {
        const flicking = new Flicking("#carousel", {
            align: "center",
            circular: true,
            preventClickOnDrag: true,
            // horizontal: false,
            // bound: true,
            renderOnlyVisible: true,
            moveType: "freeScroll",
            defaultIndex: 1,
        });

        flicking.addPlugins(
            new AutoPlay({
                duration: 2000,
                direction: "NEXT",
                stopOnHover: true,
            })
        );
    }

    followTag(tag) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({
                viewModel: EnterDialog,
                overlayDismiss: true,
            });
            return;
        }

        this.tagService
            .followTag(tag.id)
            .then((res) => {
                tag.followed = true;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    unFollowTag(tag) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({
                viewModel: EnterDialog,
                overlayDismiss: true,
            });
            return;
        }

        this.tagService
            .unFollowTag(tag.id)
            .then((res) => {
                tag.followed = false;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getData(topIndex, isAtBottom, isAtTop) {
        console.log("Get more start");
        if (this.getting || !this.hasNextPage) return;
        console.log("Get more calling");
        this.getting = true;
        this.articleService
            .get(
                `?tagName=${this.tagName}&top=${this.pageSize}&skip=${
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
            this.router.navigate(`/t/${this.tagName}/top/${this.topBy}`, {
                trigger: false,
            });
        } else {
            this.router.navigate(`/t/${this.tagName}`, { trigger: false });
        }
    }

    goTo(routeName: string) {
        this.router.navigateToRoute(routeName);
    }
}

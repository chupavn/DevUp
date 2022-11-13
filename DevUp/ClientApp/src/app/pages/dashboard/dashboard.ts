import { ArticleService } from "./../../../services/article-service";
import { autoinject } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { State } from "../../store/state";

@connectTo()
@autoinject
export class Dashboard {
    private state: State;
    activeMenuItem = "posts";
    articles: any[];

    constructor(private articleService: ArticleService) {}

    async attached() {
        try {
            this.articles = await this.articleService.get(
                `?authorId=${this.state.user.id}&publishedOnly=false`
            );

            this.articles.forEach((article) => {
                article._slugId = `${article.slug}-${article.id}`;
            });
        } catch (error) {
            console.log(error);
        }
    }

    selectMenuItem(menuItem) {
        this.activeMenuItem = menuItem;
    }
}

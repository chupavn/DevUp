import { autoinject, bindable, TaskQueue } from 'aurelia-framework';
import { ArticleService } from 'services/article-service';
import { AuthService } from 'services/auth-service';
import { connectTo } from 'aurelia-store';
import { State } from '../store/state';
import * as hljs from 'highlight.js';
import { ParamService } from 'services/param-service';
import { DialogService } from 'aurelia-dialog';
import { EnterDialog } from 'app/auth/enter-dialog';
import * as fluidvids from 'fluidvids.js';
import { Container } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { CommentService } from 'services/comment-service';
import * as toastr from 'toastr';
import * as $ from 'jquery';

@connectTo()
@autoinject
export class ArticleDetails {
    private state: State;

    @bindable article: any;
    private articleId: any;

    mdEditorEl: HTMLTextAreaElement;

    routeConfig: any;
    navigationInstruction: any;
    ready = false;

    private newComment: any;
    private previewingNewComment = false;
    private commentAreaEl: HTMLElement;
    private newCommentActive = false;

    private currentURL = '';

    constructor(
        private articleService: ArticleService,
        private commentService: CommentService,
        private dialogService: DialogService,
        private taskQueue: TaskQueue,
        private router: Router,
    ) {
        this.dialogService = dialogService;
    }

    activate(params, routeConfig, navigationInstruction) {
        this.currentURL = window.location.href;
        const articleId = params.id;
        this.routeConfig = routeConfig;
        this.navigationInstruction = navigationInstruction;
        if (articleId) {
            let arr = articleId.split('-');
            this.articleId = arr[arr.length - 1];
        }
        this.fetch();

        this.initialNewComment();
    }

    afterAttached() {
        this.highLight();
        if (this.navigationInstruction.fragment.endsWith("#comments")) {
            setTimeout(() => {
                this.taskQueue.queueTask(() => {
                    // location.href="#comments"
                    this.commentAreaEl.scrollIntoView();
                });
            }, 60);
        }

    }

    highLight() {
        setTimeout(() => {
            this.taskQueue.queueTask(() => {
                hljs.highlightAll();
                fluidvids.render();
            });
        }, 10);
    }

    fetch() {
        this.ready = false;
        Promise.all([
            this.articleService.get('/' + this.articleId),
        ])
            .then(res => {
                this.article = res[0];
                let commentsTree = this.makeTreeFromList(this.article.comments);
                this.article.comments = commentsTree;
                this.expandList();

                this.routeConfig.navModel.setTitle(this.article.title);
                this.ready = true;
                this.highLight();
            })
            .catch(err => {
                console.log(err);
                this.ready = false;
            })
    }

    toggleLike() {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }
        if (this.article.isLiked) {
            this.unlikeArticle();
        } else {
            this.likeArticle();
        }
    }

    likeArticle() {
        this.articleService.likeArticle(this.article.id)
            .then(res => {
                this.article.isLiked = true;
                this.article.likedCount = res.likedCount;
            })
            .catch(err => {
                console.log(err);
            })
    }

    unlikeArticle() {
        this.articleService.unlikeArticle(this.article.id)
            .then(res => {
                this.article.isLiked = false;
                this.article.likedCount = res.likedCount;
            })
            .catch(err => {
                console.log(err);
            })
    }

    toggleReadingList() {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        if (this.article.isReadingList) {
            this.removeReadingList();
        } else {
            this.addToReadingList();
        }
    }

    addToReadingList() {
        this.articleService.addToReadingList(this.article.id)
            .then(res => {
                this.article.isReadingList = true;
                this.article.readingListCount = res.readingListCount;
            })
            .catch(err => {
                console.log(err);
            })
    }

    removeReadingList() {
        this.articleService.removeReadingList(this.article.id)
            .then(res => {
                this.article.isReadingList = false;
                this.article.readingListCount = res.readingListCount;
            })
            .catch(err => {
                console.log(err);
            })
    }

    openEnterDialog() {
        this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
    }

    followAuthor(author) {
        if (!this.state.auth.loggedIn)
            this.openEnterDialog();
        else
            alert('Followed!');
    }

    editArticle() {
        this.router.navigateToRoute('edit-article', { id: this.article.id });
    }

    editProfile() {
        this.router.navigateToRoute('settings');
    }

    //----------Comment

    private makeTreeFromList(list) {
        let topNodes = list.filter(x => !x.parentId);
        topNodes.forEach(node => {
            node._level = 0;
            this.getChildNodes(node, list, node._level);
        });

        return topNodes;
    }

    // recursively get child nodes
    private getChildNodes(node, list, level) {
        node._level = level + 1;
        node._children = list.filter(x => x.parentId === node.id);

        node._children.forEach(childNode => {
            this.getChildNodes(childNode, list, node._level);
        });
    }

    private expandList() {
        // create a shallow copy to avoid problem with expanding when the array changes
        // because new items are "sliced" into the array
        let originalArray = this.article.comments.slice(0);
        originalArray.forEach(comment => {
            this.expand(comment, true);
        });

    }

    private expand(comment, deep: boolean) {
        if (comment._children.length === 0) {
            comment._expanded = false;
        }

        if (comment._children.length > 0) {
            if (!comment._expanded) {
                comment._expanded = true;

                // insert children as visible components
                let index = this.article.comments.indexOf(comment);
                this.article.comments.splice(index + 1, 0, ...comment._children);
            }

            if (deep && comment._children.length > 0) {
                // create a shallow copy to avoid problem with expanding when the array changes
                // because new items are "sliced" into the array
                let originalChildren = comment._children.slice(0);
                originalChildren.forEach(child => {
                    this.expand(child, true);
                });
            }
        }
    }

    activeNewCommentForm(e: Event) {
        e.preventDefault();
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        this.newCommentActive = true;
    }

    initialNewComment() {
        this.previewingNewComment = false;
        this.newComment = { content: '', parentId: null, articleId: this.articleId };
    }

    async saveNewComment() {
        try {
            const comment = await this.commentService.post('', this.newComment);
            comment._level = 1;
            comment._children = [];
            comment._expanded = true;
            this.article.comments.unshift(comment);
            this.initialNewComment();
        } catch (error) {
            console.log(error);
        }
    }

    togglePreviewNewComment() {
        this.previewingNewComment = !this.previewingNewComment;
        this.highLight()
    }

    cancelNewComment() {
        this.initialNewComment();
    }

    async deleteComment(commentDeleteObject) {
        try {
            await this.commentService.delete(`/${commentDeleteObject.id}`);
            const index = this.article.comments.findIndex(x => x.id === commentDeleteObject.id);
            this.article.comments.splice(index, 1);
        } catch (error) {
            console.log(error);
        }
    }

    async saveEditComment(commentEdited) {
        try {
            const comment = await this.commentService.put(`/${commentEdited.id}`, commentEdited);
            const index = this.article.comments.findIndex(x => x.id === commentEdited.id);
            commentEdited.UpdateAt = comment.UpdateAt;
            this.article.comments.splice(index, 1, commentEdited);
            this.highLight();
        } catch (error) {
            console.log(error);
        }
    }

    async saveReply(replyCommentObject) {
        try {
            const comment = await this.commentService.post('', replyCommentObject);
            const parentComment = this.article.comments.find(x => x.id === comment.parentId);

            if (parentComment) {
                comment._level = parentComment._level + 1;
                comment._children = [];
                comment._expanded = true;
                (parentComment._children as any[]).unshift(comment);

                const index = this.article.comments.findIndex(x => x.id === comment.parentId);
                this.article.comments.splice(index + 1, 0, comment);
            } else {
                comment._level = 1;
                comment._children = [];
                comment._expanded = true;
                this.article.comments.push(comment);
            }
        } catch (error) {
            console.log(error);
        }
    }

    copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        toastr.success('Copied');
    };
}

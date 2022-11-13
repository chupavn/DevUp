import { EnterDialog } from 'app/auth/enter-dialog';
import { DialogService } from 'aurelia-dialog';
import { autoinject, bindable, TaskQueue } from 'aurelia-framework';
import { connectTo } from 'aurelia-store';
import * as hljs from 'highlight.js';
import { CommentService } from 'services/comment-service';
import { State } from '../../store/state';

@connectTo()
@autoinject
export class Comment {
    private state: State;
    @bindable article: any;
    @bindable comment: any;
    @bindable deleteHandle: (comment) => void;
    @bindable saveHandle: (commentClone) => void;
    private editing = false;
    private previewing = false;
    private commentClone = false;

    private replyCommentObject: any;
    private replying = false;
    private previewingReply = false;
    @bindable saveReplyHandle: (commentClone) => void;
    private commentItemEl: HTMLElement;
    private menuCommentItemEl: HTMLElement;

    constructor(
        private taskQueue: TaskQueue,
        private commentService: CommentService,
        private dialogService: DialogService,
    ) { }

    commentChanged() {
        this.commentClone = JSON.parse(JSON.stringify(this.comment));
    }

    attached() {
        this.commentClone = JSON.parse(JSON.stringify(this.comment));
    }

    activeEditing() {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        this.editing = true;
        this.commentClone = JSON.parse(JSON.stringify(this.comment));
    }

    cancelEdit() {
        this.editing = false;
        this.commentClone = JSON.parse(JSON.stringify(this.comment));
    }

    togglePreviewing() {
        this.previewing = !this.previewing;
        if (this.previewing) {
            setTimeout(() => {
                this.taskQueue.queueTask(() => {
                    hljs.highlightAll();
                });
            }, 10);
        }
    }

    save() {
        this.saveHandle({ commentClone: this.commentClone });
        this.editing = false;
    }

    // reply

    initialReplyComment() {
        this.replyCommentObject = { content: '', parentId: this.comment.id, articleId: this.comment.articleId };
    }

    activeReplying() {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        this.initialReplyComment();
        this.replying = !this.replying;
    }

    cancelReply() {
        this.replying = false;
        this.previewingReply = false;
        this.initialReplyComment();
    }

    togglePreviewingReply() {
        this.previewingReply = !this.previewingReply;
        if (this.previewing) {
            setTimeout(() => {
                this.taskQueue.queueTask(() => {
                    hljs.highlightAll();
                });
            }, 10);
        }
    }

    createReply() {
        this.saveReplyHandle({ replyCommentObject: this.replyCommentObject });
        this.replying = false;
        this.previewingReply = false;
        this.initialReplyComment();
    }

    async toggleLike() {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        try {
            if (this.comment.isLiked) {
                await this.commentService.unlikeComment(this.comment.id);
                this.comment.likedCount -= 1;
                this.comment.isLiked = false;
            }
            else {
                await this.commentService.likeComment(this.comment.id);
                this.comment.likedCount += 1;
                this.comment.isLiked = true;
            }

        } catch (error) {
            console.log(error);
        }
    }
}

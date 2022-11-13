
import { EnterDialog } from 'app/auth/enter-dialog';
import { DialogService } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { connectTo } from 'aurelia-store';
import { TagService } from 'services/tag-service';
import { State } from '../store/state';
import { TagEditDialog } from './tag-edit-dialog';
import { Draggable, Swappable } from '@shopify/draggable';

@connectTo()
@autoinject
export class TagList {
    private state: State;

    private tags: any[] = [];

    constructor(
        private router: Router,
        private tagService: TagService,
        private dialogService: DialogService,
    ) { }

    bind(bindingContext: Object, overrideContext: Object) {
        this.fetch();
    }

    attached() {
        const draggable = new Draggable(document.querySelectorAll('.tags-container'), {
            draggable: '.tag'
        });

        draggable.on('drag:start', (e) => {
            console.log('drag:start');
        });

        draggable.on('drag:move', (e) => {
            console.log('drag:move');
            console.log(e.sensorEvent.target);
            console.log(e.sensorEvent.target.dataset.id);

        });

        draggable.on('drag:out', (e) => {
            console.log('drag:out');
        });

        draggable.on('drag:stop', (e) => {
            console.log('drag:stop');
        });
    }

    fetch() {
        Promise.all([
            this.tagService.getAll(''),
        ])
            .then(res => {
                this.tags = res[0];
            })
            .catch(err => {
                console.log(err);
            })
    }

    followTag(tag) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        this.tagService.followTag(tag.id)
            .then(res => {
                tag.followed = true;
            })
            .catch(err => {
                console.log(err);
            });
    }


    unFollowTag(tag) {
        if (!this.state.auth.loggedIn) {
            this.dialogService.open({ viewModel: EnterDialog, overlayDismiss: true });
            return;
        }

        this.tagService.unFollowTag(tag.id)
            .then(res => {
                tag.followed = false;
            })
            .catch(err => {
                console.log(err);
            });
    }

    editTag(tag) {
        this.dialogService.open({
            viewModel: TagEditDialog,
            model: { tag: { ...tag } },
            centerHorizontalOnly: false,
            overlayDismiss: true,
        }).whenClosed(res => {
            if (!res.wasCancelled && res.output?.tag) {
                let index = this.tags.findIndex(x => x.id === res.output?.tag.id);
                if (index !== -1) {
                    this.tags.splice(index, 1, res.output?.tag);
                }
            }
        });
    }
}

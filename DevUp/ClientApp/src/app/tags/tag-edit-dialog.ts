import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { TagService } from 'services/tag-service';


@autoinject
export class TagEditDialog {
    private tag: TagCreateDto;

    constructor(
        private router: Router,
        private dialogController: DialogController,
        private tagService: TagService,
    ) { }

    activate(params, routeConfig, navigationInstruction) {
        this.tag = params.tag;
    }

    async save() {
        if (!this.tag.name?.trim()) return;
        try {
            await this.tagService.put(`/${this.tag.id}`, this.tag);
            this.dialogController.ok({ tag: this.tag });
        } catch (error) {
            this.dialogController.cancel();
            console.log(error);
        }
    }

    cancel() {
        this.dialogController.cancel();
    }

}

interface TagCreateDto {
    id: number;
    name: string;
    description: string;
    backGroundColorHex: string;
    textColorHex: string;
}

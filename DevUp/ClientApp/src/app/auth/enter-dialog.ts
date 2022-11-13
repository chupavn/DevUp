import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';


@autoinject
export class EnterDialog{
    constructor(
        private router: Router,
        private dialogController: DialogController,
    ){}

    gotoLogin(){
        this.dialogController.ok();
        this.router.navigateToRoute('enter'); 
    }

    gotoRegister(){
        this.dialogController.ok();
        this.router.navigateToRoute('enter', {state: 'new-user'});
    }
}

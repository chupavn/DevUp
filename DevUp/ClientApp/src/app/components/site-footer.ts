import { autoinject, TaskQueue } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { connectTo } from 'aurelia-store';
import { AuthService } from 'services/auth-service';
import { State } from '../store/state';
import { dispatchify, Store } from 'aurelia-store';


import { logout } from '../store/actions/auth';

@connectTo()
@autoinject
export class SiteFooter {
    private state: State;

    constructor(
        private router: Router,
    ) { }

    login() {
        this.router.navigateToRoute('enter');
    }

    writeAPost() {
        this.router.navigateToRoute('new-article');
    }

    goTo(routeName: string) {
        this.router.navigateToRoute(routeName);
    }
}

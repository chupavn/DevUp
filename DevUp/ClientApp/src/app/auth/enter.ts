import { autoinject, TaskQueue } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { AuthService } from 'services/auth-service';
import { UserService } from 'services/user-service';
import { dispatchify, Store } from 'aurelia-store';

import { State } from '../store/state';

import { login } from '../store/actions/auth';
import { getCurrentUser } from 'app/store/actions/users';

@autoinject
export class Enter {
    private state: string;
    private user: LoginDto;
    private errMessage: string;

    public storeState: State;
    private subscription: any;

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private store: Store<State>,
    ) { }

    bind() {
        this.subscription = this.store.state.subscribe((state) => this.storeState = state);
    }

    unbind() {
        this.subscription.unsubscribe();
    }

    activate(params, routeConfig, navigationInstruction) {
        this.state = params.state;
    }

    toLoginPage() {
        this.router.navigateToRoute('enter');
    }

    login() {
        this.authService.login(this.user)
            .then(async (res) => {
                await dispatchify(login)();
                await dispatchify(getCurrentUser)();
                this.router.navigateToRoute('home');
                this.errMessage = null;
            })
            .catch(err => {
                this.errMessage = JSON.parse(err.response)?.message;
                console.log(err);
            });
    }

    register() {
        this.userService.register(this.user)
            .then(res => {
                this.errMessage = null;
            })
            .catch(err => {
                this.errMessage = JSON.parse(err.response)?.message;
                console.log(err);
            });
    }

    submit() {
        if (this.state === 'new-user') {
            this.register();
        } else {
            this.login();
        }
    }

    forgotPassword() {
        this.router.navigateToRoute('forgot-password');
    }
}

export interface LoginDto {
    email: string;
    password: string;
    confirmPassword: string;
}

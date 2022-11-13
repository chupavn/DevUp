import { autoinject, TaskQueue } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { connectTo } from "aurelia-store";
import { AuthService } from "services/auth-service";
import { State } from "../store/state";
import { dispatchify, Store } from "aurelia-store";
import { logout } from "../store/actions/auth";

@connectTo()
@autoinject
export class Header {
    private state: State;
    private q = null;

    constructor(private router: Router, private authService: AuthService) {}

    stateChanged(newState: State, oldState: State) {
        this.q = newState.filters;
    }

    login() {
        this.router.navigateToRoute("enter");
    }

    register() {
        this.router.navigateToRoute("enter", { state: "new-user" });
    }

    writeAPost() {
        this.router.navigateToRoute("new-article");
    }

    signOut() {
        this.authService
            .signOut()
            .then(async (res) => {
                await dispatchify(logout)();
                this.router.navigateToRoute("enter");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    goTo(routeName: string) {
        this.router.navigateToRoute(routeName);
    }

    goToSearchResults() {
        this.router.navigateToRoute("search", { q: this.q?.trim() });
    }
}

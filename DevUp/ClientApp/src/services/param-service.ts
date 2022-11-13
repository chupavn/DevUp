import { connectTo, dispatchify, Store } from "aurelia-store";
import { State } from "../app/store/state";
import { autoinject, inject, observable } from "aurelia-framework";

@inject(Store)
@autoinject
export class ParamService {
    @observable state: State;
    private subscription: any;

    constructor(store) {
        store.state.subscription((newState) => (this.state = newState));
    }

    public hasLoadedParams() {
        return this.state?.hasLoadedParams;
    }

    public loggedIn() {
        return !!this.state?.auth?.loggedIn;
    }

    public getUserId() {
        return this.state?.user?.id;
    }
}

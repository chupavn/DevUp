import store from '../store';
import { State } from '../state';

export function login(state: State) {
    const newState = Object.assign({}, state);

    newState.auth.loggedIn = true;

    return newState;
}

export function logout(state: State) {
    const newState = Object.assign({}, state);

    newState.auth.loggedIn = false;
    newState.user.id = null;
    newState.user.name = null;
    newState.user.email = null;
    newState.user.avatarUrl = null;
    newState.user.roles = null;

    return newState;
}

store.registerAction('login', login);
store.registerAction('logout', logout);

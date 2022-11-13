import { Container } from 'aurelia-framework';
import store from '../store';
import { State } from '../state';

// A fictitious API service you might have
import { UserService } from 'services/user-service';
import { RoleEnum } from 'app/enums/role-enum';

// Use Aurelia DI to get the api because we are not inside of a view-model
const api: UserService = Container.instance.get(UserService);

export async function getCurrentUser(state: State) {
    const newState = Object.assign({}, state);

    try {
        // An API function that accepts the current user ID
        // notice we reference the user object to get the ID?
        const currentUser = await api.get('/current-user');
        console.log(currentUser);


        // Store 
        newState.hasLoadedParams = true;
        newState.auth.loggedIn = true;
        newState.user.id = currentUser.id;
        newState.user.name = currentUser.name;
        newState.user.email = currentUser.email;
        newState.user.avatarUrl = currentUser.avatarUrl;
        newState.user.isAdmin = currentUser.roles?.some(role => role === RoleEnum.Administrator);
        newState.user.roles = currentUser.roles;
    } catch (e) {
        newState.hasLoadedParams = true;
        newState.auth.loggedIn = false;
        newState.user = {
            id: '',
            name: '',
            email: '',
            avatarUrl: '',
            isAdmin: false,
            roles: [],
        };
        console.error(e);
    }

    return newState;
}

store.registerAction('getCurrentUser', getCurrentUser);

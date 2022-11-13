export interface State {
    hasLoadedParams: boolean;
    auth: {
        loggedIn: boolean;
    };

    user: {
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        isAdmin: boolean;
        roles: string[];
    };
    filters: string;
}

export const initialState: State = {
    hasLoadedParams: false,
    auth: {
        loggedIn: false,
    },
    user: {
        id: '',
        name: '',
        email: '',
        avatarUrl: '',
        isAdmin: false,
        roles: [],
    },
    filters: '',
};

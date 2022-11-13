import store from '../store';
import { State } from '../state';

export function setFilterValue(state: State, filters: string) {
    const newState = Object.assign({}, state);

    newState.filters = filters;

    return newState;
}

store.registerAction('setFilterValue', setFilterValue);

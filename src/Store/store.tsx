
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import CategoryReducer from './Reducers/CategoryReducer';
import CityReducer from './Reducers/CityReducer';
import CountryReducer from './Reducers/CountryReducer';
import HomeReducer from './Reducers/HomeReducer';
import HostReducer from './Reducers/HostReducer';
import UserReducer from './Reducers/UserReducer';

export const HOST_URL= "http://192.168.0.105:8080";
// export const HOST_URL= "http://10.0.2.2:8080";
const initialState= {};

const rootReducer = combineReducers({
    USERS: UserReducer,
    HOMES: HomeReducer,
    HOSTS: HostReducer,
    CITIES: CityReducer,
    COUNTRIES: CountryReducer,
    CATEGORIES: CategoryReducer
   
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
   
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
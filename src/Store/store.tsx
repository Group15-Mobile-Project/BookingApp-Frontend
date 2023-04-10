
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import BookDateReducer from './Reducers/BookDateReducer';
import BookingReducer from './Reducers/BookingReducer';
import CategoryReducer from './Reducers/CategoryReducer';
import ChatMessageReducer from './Reducers/ChatMessageReducer';
import ChatReducer from './Reducers/ChatReducer';
import CityReducer from './Reducers/CityReducer';
import CountryReducer from './Reducers/CountryReducer';
import DiscountReducer from './Reducers/DiscountReducer';
import HomeReducer from './Reducers/HomeReducer';
import HomeReviewReducer from './Reducers/HomeReviewReducer';
import HostReducer from './Reducers/HostReducer';
import NotificationReducer from './Reducers/NotificationReducer';
import TenantReviewReducer from './Reducers/TenantReviewReducer';
import UserReducer from './Reducers/UserReducer';
import WishlistReducer from './Reducers/WishlistReducer';

export const HOST_URL= "http://100.76.188.137:8080";
// export const HOST_URL= "http://10.0.2.2:8080";
const initialState= {};

const rootReducer = combineReducers({
    USERS: UserReducer,
    HOMES: HomeReducer,
    HOSTS: HostReducer,
    CITIES: CityReducer,
    COUNTRIES: CountryReducer,
    CATEGORIES: CategoryReducer,
    HOMEREVIEWS: HomeReviewReducer,
    WISHLISTS: WishlistReducer,
    BOOKDATES: BookDateReducer,
    DISCOUNTS: DiscountReducer,
    BOOKINGS: BookingReducer,
    TENANTREVIEWS: TenantReviewReducer,
    NOTIFICATIONS: NotificationReducer,
    CHATS: ChatReducer,
    CHATMESSAGES: ChatMessageReducer
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
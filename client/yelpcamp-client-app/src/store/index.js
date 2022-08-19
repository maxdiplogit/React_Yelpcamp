// React Helpers
import { configureStore, createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';


const initialLoginState = { isLoggedIn: false, loggedInUser: {} };


const authSlice = createSlice({
    name: 'authentication',
    initialState: initialLoginState,
    reducers: {
        changeIsLoggedIn(currentState, action) {
            currentState.isLoggedIn = action.payload;
        },
        changeLoggedInUser(currentState, action) {
            currentState.loggedInUser = action.payload;
        }
    }
});


const reducers = combineReducers({
    auth: authSlice.reducer,
});


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});


export const authActions = authSlice.actions;

export default store;
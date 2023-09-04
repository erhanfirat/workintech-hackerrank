import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { reducers } from "./reducers";
import thunk from "redux-thunk";
// eski versiyonlar için -> import { createStore } from 'redux';

export const store = createStore(reducers, applyMiddleware(thunk));

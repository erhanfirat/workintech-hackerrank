import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { reducers } from "./reducers";
import thunk from "redux-thunk";
import logger from "redux-logger";

export const store = createStore(reducers, applyMiddleware(logger, thunk));

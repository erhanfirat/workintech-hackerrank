import { combineReducers } from "redux";
import { testsReducer } from "./testsReducer";

export const reducers = combineReducers({
  tests: testsReducer,
});

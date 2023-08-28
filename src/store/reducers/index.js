import { combineReducers } from "redux";
import { testsReducer } from "./testsReducer";
import { candidatesReducer } from "./candidatesReducer";

export const reducers = combineReducers({
  tests: testsReducer,
  candidates: candidatesReducer,
});

import { combineReducers } from "redux";
import { testsReducer } from "./testsReducer";
import { candidatesReducer } from "./candidatesReducer";
import { questionsReducer } from "./questionsReducer";
import { userReducer } from "./userReducer";

export const reducers = combineReducers({
  tests: testsReducer,
  candidates: candidatesReducer,
  questions: questionsReducer,
  user: userReducer,
});

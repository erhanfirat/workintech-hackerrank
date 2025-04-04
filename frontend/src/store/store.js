import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { reducers } from "./reducers";
import thunk from "redux-thunk";
import logger from "redux-logger";

// Development ortamında logger kullan, production'da kullanma
const middlewares = [thunk];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// Store oluştur
export const store = createStore(reducers, applyMiddleware(...middlewares));

// tokenExpired olayını dinleyerek kullanıcı çıkışını yap
window.addEventListener("tokenExpired", () => {
  // userReducer'dan signOutAction'ı import et ve dispatch et
  const { signOutAction } = require("./reducers/userReducer");
  store.dispatch(signOutAction());
});

import { doSRRequest, generateSrApi } from "../../api/api";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES, STORE_TOKEN } from "../../utils/constants";

// Statics ***************************

const userInitial = {
  user: null,
  token: "",
  language: "tr",
  theme: "light",
  isAdmin: false,
  fetchState: FETCH_STATES.NOT_STARTED,
};

export const userActions = {
  setUser: "SET_USER_INFORMATION",
  setFetchState: "SET_USER_FETCH_STATE",
};

// Reducer ***************************

export const userReducer = (state = userInitial, action) => {
  const { type, payload } = action;
  switch (type) {
    case userActions.setUser:
      return {
        ...state,
        user: payload,
        token: payload.AuthToken,
        isAdmin: payload.is_manager,
      };

    case userActions.setFetchState:
      return { ...state, fetchState: payload };

    default:
      return state;
  }
};

// Actions ************************

export const loginActionCreator = (loginData) => (dispatch, getState) => {
  dispatch({ type: userActions.setFetchState, payload: FETCH_STATES.FETCHING });
  doSRRequest(srEndpoints.login(loginData))
    .then((res) => {
      dispatch({
        type: userActions.setUser,
        payload: res,
      });
      dispatch({
        type: userActions.setFetchState,
        payload: FETCH_STATES.FETHCED,
      });
      localStorage.setItem(STORE_TOKEN, res.AuthToken);
      generateSrApi();
    })
    .catch((err) => {
      dispatch({
        type: userActions.setFetchState,
        payload: FETCH_STATES.FAILED,
      });
      localStorage.removeItem(STORE_TOKEN);
      generateSrApi();
    });
};

export const verifyUserAction = () => (dispatch, getState) => {
  const token = localStorage.getItem(STORE_TOKEN);
  if (token) {
    generateSrApi();
    doSRRequest(srEndpoints.verifyMe())
      .then((res) => {
        dispatch({
          type: userActions.setUser,
          payload: res,
        });
        dispatch({
          type: userActions.setFetchState,
          payload: FETCH_STATES.FETHCED,
        });
        localStorage.setItem(STORE_TOKEN, res.AuthToken);
      })
      .catch((err) => {
        localStorage.removeItem(STORE_TOKEN);
      });
  }
};

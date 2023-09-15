import { doSRRequest } from "../../api/api";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES } from "./testsReducer";

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

    case userActions.default:
      return state;

    default:
      return state;
  }
};

// Actions ********************

export const loginActionCreator = (loginData) => (dispatch, getState) => {
  dispatch({ type: userActions.setFetchState, payload: FETCH_STATES.FETCHING });
  doSRRequest(srEndpoints.login(loginData))
    .then((res) => {
      dispatch({
        type: userActions.setUser,
        payload: res.data,
      });
      dispatch({
        type: userActions.setFetchState,
        payload: FETCH_STATES.FETHCED,
      });
    })
    .catch((err) => {
      dispatch({
        type: userActions.setFetchState,
        payload: FETCH_STATES.FAILED,
      });
    });
};

import { doSRRequest, generateSrApi } from "../../api/api";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES, STORE_TOKEN } from "../../utils/constants";
import { toast } from "react-hot-toast";

// Statics ***************************

const userInitial = {
  user: null,
  token: "",
  language: "tr",
  theme: localStorage.getItem("theme") || "light",
  isAdmin: false,
  fetchState: FETCH_STATES.NOT_STARTED,
  error: null,
};

export const userActions = {
  setUser: "SET_USER_INFORMATION",
  setFetchState: "SET_USER_FETCH_STATE",
  signOut: "SIGN_OUT_USER",
  setError: "SET_USER_ERROR",
  setTheme: "SET_THEME",
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
        error: null,
      };

    case userActions.signOut:
      return {
        ...userInitial,
        theme: state.theme, // Tema ayarını koru
      };

    case userActions.setFetchState:
      return { ...state, fetchState: payload };

    case userActions.setError:
      return { ...state, error: payload, fetchState: FETCH_STATES.FAILED };

    case userActions.setTheme:
      // Temayı localStorage'a da kaydet
      localStorage.setItem("theme", payload);
      return { ...state, theme: payload };

    default:
      return state;
  }
};

// Actions ************************

// Tema ayarını değiştir
export const setThemeAction = (theme) => ({
  type: userActions.setTheme,
  payload: theme,
});

// Kullanıcı girişi yap
export const loginActionCreator =
  (loginData, loginCallback) => (dispatch, getState) => {
    dispatch({
      type: userActions.setFetchState,
      payload: FETCH_STATES.FETCHING,
    });

    doSRRequest(srEndpoints.login(loginData))
      .then((res) => {
        if (!res.AuthToken) {
          throw new Error(
            "Giriş yapılamadı: Kimlik doğrulama token'ı alınamadı"
          );
        }

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

        if (loginCallback && typeof loginCallback === "function") {
          loginCallback();
        }

        toast.success("Başarıyla giriş yapıldı!");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || err.message;

        dispatch({
          type: userActions.setError,
          payload: errorMessage,
        });

        toast.error(`Giriş yapılamadı: ${errorMessage}`);
        localStorage.removeItem(STORE_TOKEN);
        generateSrApi();
      });
  };

// Kullanıcı doğrulama işlemi
export const verifyUserAction = () => (dispatch, getState) => {
  const token = localStorage.getItem(STORE_TOKEN);
  if (token) {
    dispatch({
      type: userActions.setFetchState,
      payload: FETCH_STATES.FETCHING,
    });

    doSRRequest(srEndpoints.verifyMe())
      .then((res) => {
        if (!res.AuthToken) {
          throw new Error("Oturum doğrulanamadı");
        }

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
          type: userActions.setError,
          payload: err.message,
        });
        localStorage.removeItem(STORE_TOKEN);
        generateSrApi();
      });
  }
};

// Kullanıcı çıkışı yap
export const signOutAction = () => (dispatch) => {
  localStorage.removeItem(STORE_TOKEN);
  dispatch({ type: userActions.signOut });
  generateSrApi();
  toast.success("Başarıyla çıkış yapıldı");
};

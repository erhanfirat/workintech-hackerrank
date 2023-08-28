import { doRequest } from "../../api/api";
import { endpoints } from "../../api/endpoints";

export const FETCH_STATES = Object.freeze({
  NOT_STARTED: "NotStarted",
  FETCHING: "Fetching",
  FETHCED: "Fetched",
});

export const testActions = Object.freeze({
  setFetchState: "SET_TESTS_FETCH_STATE",
  setAllTests: "SET_ALL_TESTS",
  addAllTests: "ADD_ALL_TESTS",
  setWorkintechTests: "SET_WORKINTECH_TESTS",
  setTotal: "SET_TOTAL_TEST_COUNT",
});

// REDUCER ********************************

const initialTests = {
  allTests: [],
  workintechTests: [],
  total: 0,
  fetchState: FETCH_STATES.NOT_STARTED,
};

export const testsReducer = (state = initialTests, action) => {
  switch (action.type) {
    case testActions.setAllTests:
      return {
        ...state,
        allTests: action.payload,
        workintechTests: action.payload.filter((test) =>
          test.name.toLowerCase().includes("workintech")
        ),
      };

    case testActions.addAllTests:
      const all = [...state.allTests, ...action.payload];
      return {
        ...state,
        allTests: all,
        workintechTests: all.filter((test) =>
          test.name.toLowerCase().includes("workintech")
        ),
      };

    case testActions.setWorkintechTests:
      return { ...state, workintechTests: action.payload };

    case testActions.setTotal:
      return { ...state, total: action.payload };

    case testActions.setFetchState:
      return {
        ...state,
        fetchState: action.payload,
      };

    default:
      return state;
  }
};

// ACTIONS ********************************

export const getAllTestsAction = () => (dispatch) => {
  dispatch({ type: testActions.setFetchState, payload: FETCH_STATES.FETCHING });

  doRequest(endpoints.tests()).then((resData) => {
    dispatch({ type: testActions.setAllTests, payload: resData.data });
    dispatch({ type: testActions.setTotal, payload: resData.total });

    const pageCount = Math.ceil(resData.total / 100);
    for (let i = 1; i <= pageCount; i++) {
      doRequest(endpoints.tests({ limit: 100, offset: i * 100 })).then(
        (innerResData) => {
          dispatch({
            type: testActions.addAllTests,
            payload: innerResData.data,
          });
          if (i === pageCount) {
            dispatch({
              type: testActions.setFetchState,
              payload: FETCH_STATES.FETHCED,
            });
          }
        }
      );
    }
  });
};

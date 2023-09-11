import { doHRRequest, doSRRequest, doServerRequest } from "../../api/api";
import { hrEndpoints } from "../../api/hrEndpoints";
import { srEndpoints } from "../../api/srEndpoints";

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
    case testActions.addAllTests:
      const all = [...state.allTests, ...action.payload];
      return {
        ...state,
        allTests: all,
        workintechTests: all
          .filter((test) => test.name.toLowerCase().includes("[workintech]"))
          .sort((t1, t2) => (t1.name > t2.name ? 1 : -1)),
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

export const getAllSRTestsAction = () => (dispatch) => {
  doSRRequest(srEndpoints.getTests()).then((srRes) => {
    console.log("server tests > ", srRes.data);
  });
};

export const getAllTestsAction = () => (dispatch, getState) => {
  dispatch({ type: testActions.setFetchState, payload: FETCH_STATES.FETCHING });

  doSRRequest(srEndpoints.getTests()).then((srTests) => {
    console.log(srTests);
    if (srTests.length > 0) {
      dispatch({
        type: testActions.addAllTests,
        payload: srTests,
      });
    } else {
      fetchHRTestsAction(dispatch, getState);
    }
  });
};

const fetchHRTestsAction = (dispatch, getState) => {
  doHRRequest(hrEndpoints.tests()).then((resData) => {
    dispatch({ type: testActions.addAllTests, payload: resData.data });
    dispatch({ type: testActions.setTotal, payload: resData.total });

    const pageCount = Math.ceil(resData.total / 100);
    for (let i = 1; i < pageCount; i++) {
      doHRRequest(hrEndpoints.tests({ limit: 100, offset: i * 100 })).then(
        (innerResData) => {
          dispatch({
            type: testActions.addAllTests,
            payload: innerResData.data,
          });
          if (getState().tests.allTests.length === resData.total) {
            // fetching all tests completed
            dispatch({
              type: testActions.setFetchState,
              payload: FETCH_STATES.FETHCED,
            });
            // set workintech tests to server DB
            doSRRequest(
              srEndpoints.setAllTests(getState().tests.workintechTests)
            );
          }
        }
      );
    }
  });
};

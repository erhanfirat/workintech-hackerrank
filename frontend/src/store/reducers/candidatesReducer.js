import { doHRRequest, doSRRequest } from "../../api/api";
import { hrEndpoints } from "../../api/hrEndpoints";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES } from "../../utils/constants";
import { getDateTimeStringFromISO } from "../../utils/utils";

export const candidateActions = Object.freeze({
  setCandidatesOfTestFetchState: "SET_TEST_CANDIDATES_FETCH_STATE",
  setCandidatesOfTest: "SET_TEST_CANDIDATES",
  addCandidatesOfTest: "ADD_TEST_CANDIDATES",
});

// REDUCER ********************************

const initialCandidates = {
  candidates: {},
  fetchStates: {},
};

export const candidatesReducer = (state = initialCandidates, action) => {
  switch (action.type) {
    case candidateActions.setCandidatesOfTest:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [action.payload.testId]: action.payload.candidates,
        },
      };

    case candidateActions.addCandidatesOfTest:
      const storeCandidates = state.candidates[action.payload.testId] || [];
      const newCandidates = action.payload.candidates.filter(
        (candidate) => !storeCandidates.find((sc) => sc.id === candidate.id)
      );
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [action.payload.testId]: [...storeCandidates, ...newCandidates],
        },
      };

    case candidateActions.setCandidatesOfTestFetchState:
      return {
        ...state,
        fetchStates: {
          ...state.fetchStates,
          [action.payload.testId]: action.payload.fetchState,
        },
      };

    default:
      return state;
  }
};

// ACTIONS ********************************

const addStartDateStrToCandidates = (candidates) => {
  return candidates.map((c) => {
    c.startDateStr = getDateTimeStringFromISO(c.attempt_starttime);
    c.endDateStr = getDateTimeStringFromISO(c.attempt_endtime);
    return c;
  });
};

export const getAllCandidatesOfTestAction =
  (testId) => (dispatch, getState) => {
    dispatch({
      type: candidateActions.setCandidatesOfTestFetchState,
      payload: { testId, fetchState: FETCH_STATES.FETCHING },
    });

    doSRRequest(srEndpoints.getAllCandidatesOfTest(testId)).then(
      (srCandidateRes) => {
        console.log("srCandidateRes > ", srCandidateRes);
        if (srCandidateRes.candidates.length === 0) {
          fetchTestCandidates(dispatch, getState, testId);
        } else {
          dispatch({
            type: candidateActions.setCandidatesOfTest,
            payload: {
              testId: srCandidateRes.testId,
              candidates: addStartDateStrToCandidates(
                srCandidateRes.candidates
              ),
            },
          });
          dispatch({
            type: candidateActions.setCandidatesOfTestFetchState,
            payload: { testId, fetchState: FETCH_STATES.FETHCED },
          });
        }
      }
    );
  };

export const fetchAllCandidatesOfTestAction =
  (testId) => (dispatch, getState) => {
    dispatch({
      type: candidateActions.setCandidatesOfTestFetchState,
      payload: { testId, fetchState: FETCH_STATES.FETCHING },
    });
    // As a result of the HR service there has no static order for candidates
    // So before each fetching it should start from the very beggining
    dispatch({
      type: candidateActions.setCandidatesOfTest,
      payload: { testId, candidates: [] },
    });

    fetchTestCandidates(dispatch, getState, testId);
  };

/**Recursively fetch candidates list of test
 * @param {Function} dispatch Redux thunk dispatch
 * @param {Function} getState Redux thunk getState
 * @param {String} testId Id of the test
 */
const fetchTestCandidates = (dispatch, getState, testId) => {
  doHRRequest(
    hrEndpoints.candidates(testId, {
      limit: 100,
      offset: getState().candidates.candidates[testId].length,
    })
  ).then((resData) => {
    dispatch({
      type: candidateActions.addCandidatesOfTest,
      payload: {
        testId,
        candidates: addStartDateStrToCandidates(resData.data),
      },
    });

    if (resData.total > getState().candidates.candidates[testId].length) {
      fetchTestCandidates(dispatch, getState, testId);
    } else {
      // finish fetching
      dispatch({
        type: candidateActions.setCandidatesOfTestFetchState,
        payload: { testId, fetchState: FETCH_STATES.FETHCED },
      });
      // save fetched candidates to server
      doSRRequest(
        srEndpoints.setCandidatesOfTest(
          testId,
          getState().candidates.candidates[testId]
        )
      );
    }
  });
};

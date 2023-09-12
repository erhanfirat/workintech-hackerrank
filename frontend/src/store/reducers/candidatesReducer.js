import { doHRRequest, doSRRequest } from "../../api/api";
import { hrEndpoints } from "../../api/hrEndpoints";
import { srEndpoints } from "../../api/srEndpoints";
import { getDateTimeStringFromISO } from "../../utils/utils";
import { FETCH_STATES } from "./testsReducer";

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
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [action.payload.testId]: [
            ...state.candidates[action.payload.testId],
            ...action.payload.candidates,
          ],
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
                srCandidateRes.candidates.map((candidateRec) =>
                  JSON.parse(candidateRec.data)
                )
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

    fetchTestCandidates(dispatch, getState, testId);
  };

const fetchTestCandidates = (dispatch, getState, testId) => {
  doHRRequest(hrEndpoints.candidates(testId)).then((resData) => {
    dispatch({
      type: candidateActions.setCandidatesOfTest,
      payload: {
        testId,
        candidates: addStartDateStrToCandidates(resData.data),
      },
    });

    if (getState().candidates.candidates[testId].length === resData.total) {
      dispatch({
        type: candidateActions.setCandidatesOfTestFetchState,
        payload: { testId, fetchState: FETCH_STATES.FETHCED },
      });
      doSRRequest(
        srEndpoints.setCandidatesOfTest(
          testId,
          getState().candidates.candidates[testId]
        )
      );
    }

    const pageCount = Math.ceil(resData.total / 100);
    for (let i = 1; i < pageCount; i++) {
      doHRRequest(
        hrEndpoints.candidates(testId, { limit: 100, offset: i * 100 })
      ).then((innerResData) => {
        dispatch({
          type: candidateActions.addAllCandidates,
          payload: {
            testId,
            candidates: addStartDateStrToCandidates(innerResData.data),
          },
        });
        if (getState().candidates.candidates[testId].length === resData.total) {
          dispatch({
            type: candidateActions.setCandidatesOfTestFetchState,
            payload: { testId, fetchState: FETCH_STATES.FETHCED },
          });
          doSRRequest(
            srEndpoints.setCandidatesOfTest(
              testId,
              getState().candidates.candidates[testId]
            )
          );
        }
      });
    }
  });
};

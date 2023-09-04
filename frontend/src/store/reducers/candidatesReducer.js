import { doRequest } from "../../api/api";
import { endpoints } from "../../api/endpoints";
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

export const getAllCandidatesOfTestAction = (testId) => (dispatch) => {
  dispatch({
    type: candidateActions.setCandidatesOfTestFetchState,
    payload: { testId, fetchState: FETCH_STATES.FETCHING },
  });

  doRequest(endpoints.candidates(testId)).then((resData) => {
    dispatch({
      type: candidateActions.setCandidatesOfTest,
      payload: { testId, candidates: resData.data },
    });

    const pageCount = Math.ceil(resData.total / 100);
    for (let i = 1; i < pageCount; i++) {
      doRequest(
        endpoints.candidates(testId, { limit: 100, offset: i * 100 })
      ).then((innerResData) => {
        dispatch({
          type: candidateActions.addAllCandidates,
          payload: { testId, candidates: innerResData.data },
        });
        if (i === pageCount) {
          dispatch({
            type: candidateActions.setFetchState,
            payload: { testId, fetchState: FETCH_STATES.FETHCED },
          });
        }
      });
    }
  });
};

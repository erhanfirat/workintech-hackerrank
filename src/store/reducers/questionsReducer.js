import { doRequest } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import { store } from "../store";
import { FETCH_STATES } from "./testsReducer";

export const questionActions = Object.freeze({
  setQuestionsOfTestFetchState: "SET_TEST_QUESTIONS_FETCH_STATE",
  setQuestionsOfTest: "SET_TEST_QUESTIONS",
  addQuestionsOfTest: "ADD_TEST_QUESTIONS",
});

// REDUCER ********************************

const initialQuestions = {
  testQuestions: {},
  allQeustions: {},
  fetchStates: {},
};

export const questionsReducer = (state = initialQuestions, action) => {
  switch (action.type) {
    case questionActions.setQuestionsOfTest:
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.payload.testId]: action.payload.questions,
        },
      };

    case questionActions.addQuestionsOfTest:
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.payload.testId]: [
            ...state.questions[action.payload.testId],
            ...action.payload.questions,
          ],
        },
      };

    case questionActions.setQuestionsOfTestFetchState:
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

export const getAllQuestionsOfTestAction = (testId) => (dispatch) => {
  dispatch({
    type: questionActions.setQuestionsOfTestFetchState,
    payload: { testId, fetchState: FETCH_STATES.FETCHING },
  });

  doRequest(endpoints.questions(testId)).then((resData) => {
    dispatch({
      type: questionActions.setQuestionsOfTest,
      payload: { testId, questions: resData.data },
    });

    const pageCount = Math.ceil(resData.total / 100);
    for (let i = 1; i < pageCount; i++) {
      doRequest(
        endpoints.questions(testId, { limit: 100, offset: i * 100 })
      ).then((innerResData) => {
        dispatch({
          type: questionActions.addAllQuestions,
          payload: { testId, questions: innerResData.data },
        });
        if (i === pageCount) {
          dispatch({
            type: questionActions.setFetchState,
            payload: { testId, fetchState: FETCH_STATES.FETHCED },
          });
        }
      });
    }
  });
};


const getQuestionByIdAction = (questionId) => (dispatch) => {
  if (!store.getState().allQeustions[questionId]) {
    doRequest(
      endpoints.questions(testId, { limit: 100, offset: i * 100 })
    )
  }
}
// CONSTANT DEFINITIONS *********************

export const questionActions = Object.freeze({
  setQuestionsOfTestFetchState: "SET_TEST_QUESTIONS_FETCH_STATE",
  addQuestionToTest: "ADD_QUESTION_TO_TEST",
  addQuestionToAll: "ADD_QUESTION_TO_ALL_QUESTIONS_LIST",
});

const initialQuestions = {
  testQuestions: {
    // "1231543": {     testId
    //   "6545475": {   questionId
    //     ...          question Object
    //   },
    //   ...
    // }
  },
  allQuestions: {
    // "4366463": {     questionId
    //    ...           question Object
    // },
    // ...
  },
  fetchStates: {},
};

// REDUCER ********************************

export const questionsReducer = (state = initialQuestions, action) => {
  switch (action.type) {
    case questionActions.addQuestionToAll:
      return {
        ...state,
        allQuestions: {
          ...state.allQuestions,
          [action.payload.id]: action.payload,
        },
      };

    case questionActions.addQuestionToTest:
      return {
        ...state,
        testQuestions: {
          ...state.testQuestions,
          [action.payload.testId]: {
            ...state.testQuestions[action.payload.testId],
            [action.payload.question.id]: action.payload.question,
          },
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

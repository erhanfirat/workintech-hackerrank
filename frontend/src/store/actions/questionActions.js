import { doRequest } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import { questionActions } from "../reducers/questionsReducer";
import { store } from "../store";

// THUNK ACTIONS ********************************

export const getAllQuestionsOfTestAction = (testId) => (dispatch, getState) => {
  const allQuestions = getState().questions.allQuestions;
  const testQuestions = getState().questions.testQuestions[testId];
  const test = getState().tests.workintechTests.find((t) => t.id === testId);

  test.questions.forEach((questionId) => {
    if (testQuestions && testQuestions[questionId]) {
      return;
    }
    if (allQuestions[questionId]) {
      dispatch(addQuestionToTestAction(testId, allQuestions[questionId]));
    } else {
      getQuestionById(questionId)
        .then((res) => {
          dispatch(addQuestionToAllAction(res));
          dispatch(addQuestionToTestAction(testId, res));
        })
        .catch((err) => {
          console.error(`HATA: ${questionId} id'li soru datası çekilirken bir hata karşılaşıldı.
${err.message}`);
        });
    }
  });
};

const getQuestionById = (questionId) => {
  return doRequest(endpoints.question(questionId)).catch((err) => {
    console.error(`HATA: ${questionId} id'li soru datası çekilirken bir hata ile karşılaşıldı.
${err.message}`);
    throw err;
  });
};

// REDUCER ACTIONS ********************************

const addQuestionToTestAction = (testId, question) => ({
  type: questionActions.addQuestionToTest,
  payload: { testId, question },
});

const addQuestionToAllAction = (question) => ({
  type: questionActions.addQuestionToAll,
  payload: question,
});

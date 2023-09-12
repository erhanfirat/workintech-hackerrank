import { doHRRequest, doSRRequest } from "../../api/api";
import { hrEndpoints } from "../../api/hrEndpoints";
import { srEndpoints } from "../../api/srEndpoints";
import { questionActions } from "../reducers/questionsReducer";

// THUNK ACTIONS ********************************

export const getAllQuestions = () => (dispatch, getState) => {
  doSRRequest(srEndpoints.getAllQuestions()).then((questions) => {
    if (questions?.length > 0) {
      dispatch(
        addQuestionToAllAction(questions.map((q) => JSON.parse(q.data)))
      );
    }
  });
};

const saveAllQuestions = (questions) => {
  doSRRequest(srEndpoints.saveQuestions(questions)).then((savedQuestions) =>
    console.log("questions saved > ", savedQuestions)
  );
};

const saveQuestion = (question) => {
  doSRRequest(srEndpoints.saveQuestions(question)).then((savedQuestion) =>
    console.log("question saved > ", savedQuestion)
  );
};

export const fetchAllQuestionsOfTestAction =
  (testId) => (dispatch, getState) => {
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
  return doHRRequest(hrEndpoints.question(questionId)).catch((err) => {
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

import { doHRRequest, doSRRequest } from "../../api/api";
import { hrEndpoints } from "../../api/hrEndpoints";
import { srEndpoints } from "../../api/srEndpoints";
import { questionActions } from "../reducers/questionsReducer";

// THUNK ACTIONS ********************************

export const getAllQuestions = () => (dispatch, getState) => {
  doSRRequest(srEndpoints.getAllQuestions()).then((questions) => {
    if (questions?.length > 0) {
      questions.forEach((q) => dispatch(addQuestionToAllAction(q)));
    }
  });
};

const saveQuestion = (question) => {
  doSRRequest(srEndpoints.saveQuestions(question)).then((savedQuestion) => {});
};

export const fetchAllQuestionsOfTestAction =
  (testId) => (dispatch, getState) => {
    const allQuestions = getState().questions.allQuestions;
    const testQuestions = getState().questions.testQuestions[testId];
    const test = getState().tests.workintechTests.find((t) => t.id === testId);
    const questionsNeedsToBeFetched = [];

    test.questions.forEach((questionId) => {
      if (testQuestions && testQuestions[questionId]) {
        return;
      }
      if (allQuestions[questionId]) {
        dispatch(addQuestionToTestAction(testId, allQuestions[questionId]));
      } else {
        questionsNeedsToBeFetched.push(questionId);
      }
    });

    if (questionsNeedsToBeFetched.length > 0) {
      doSRRequest(
        srEndpoints.getQuestionsByIdList(questionsNeedsToBeFetched)
      ).then((questionList) => {
        questionList.forEach((q) => {
          dispatch(addQuestionToAllAction(q));
          dispatch(addQuestionToTestAction(testId, q));
        });
        if (questionList.length !== questionsNeedsToBeFetched.length) {
          questionsNeedsToBeFetched.forEach((qId) => {
            if (!questionList.find((qlq) => qlq.id === qId)) {
              fetchQuestionById(qId)
                .then((question) => {
                  dispatch(addQuestionToAllAction(question));
                  dispatch(addQuestionToTestAction(testId, question));
                  saveQuestion(question);
                })
                .catch((err) => {
                  console.error(`HATA: ${qId} id'li soru datası çekilirken bir hata karşılaşıldı.
                ${err.message}`);
                });
            }
          });
        }
      });
    }
  };

const fetchQuestionById = (questionId) => {
  return doHRRequest(hrEndpoints.question(questionId));
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

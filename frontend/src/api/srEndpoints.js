import { REQ_TYPES } from "./api";

export const srEndpoints = {
  // Tests **************************

  /** Gets all tests
   *
   * @param {Number} params.limit   tests count for a page
   * @param {Number} params.offset  page count
   *
   * @returns tests list
   */
  getTests: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "tests",
  }),

  setAllTests: (tests) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "tests",
    payload: tests,
  }),

  // Candidates **************************

  getAllCandidatesOfTest: (testId) => ({
    reqType: REQ_TYPES.GET,
    endpoint: `tests/${testId}/candidates`,
  }),

  setCandidatesOfTest: (testId, candidates) => ({
    reqType: REQ_TYPES.POST,
    endpoint: `tests/${testId}/candidates`,
    payload: candidates,
  }),

  // Questions **************************

  getAllQuestions: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "questions",
  }),

  getQuestionsByIdList: (idList) => ({
    reqType: REQ_TYPES.GET,
    endpoint: `questions?ids=${idList.join(",")}`,
  }),

  saveQuestion: (question) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "questions",
    payload: question,
  }),

  saveQuestions: (questionList) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "questions",
    payload: questionList,
  }),
};

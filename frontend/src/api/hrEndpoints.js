import { REQ_TYPES } from "./api";

export const hrEndpoints = {
  /** Gets all tests
   *
   * @param {Number} params.limit   tests count for a page
   * @param {Number} params.offset  page count
   *
   * @returns tests list
   */
  tests: (params = { limit: 100, offset: 0 }) => ({
    initialData: [],
    reqType: REQ_TYPES.GET,
    endpoint: "tests",
    config: { params },
  }),

  candidates: (testId, params = { limit: 100, offset: 0 }) => ({
    initialData: [],
    reqType: REQ_TYPES.GET,
    endpoint: `tests/${testId}/candidates`,
    config: { params },
  }),
  /** Returns parameters to fetch question object
   * @param {String} questionId: id of question
   * @returns axios get request parameters for the question
   */
  question: (questionId) => ({
    initialData: null,
    reqType: REQ_TYPES.GET,
    endpoint: `questions/${questionId}`,
  }),
};

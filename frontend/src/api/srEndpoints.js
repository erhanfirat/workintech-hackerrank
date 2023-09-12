import { REQ_TYPES } from "./api";

export const srEndpoints = {
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

  getAllCandidatesOfTest: (testId) => ({
    reqType: REQ_TYPES.GET,
    endpoint: `tests/${testId}/candidates`,
  }),

  setCandidatesOfTest: (testId, candidates) => ({
    reqType: REQ_TYPES.POST,
    endpoint: `tests/${testId}/candidates`,
    payload: candidates,
  }),
};

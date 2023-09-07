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
};

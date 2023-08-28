const REQ_TYPES = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

export const endpoints = {
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
};

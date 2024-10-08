import { REQ_TYPES } from "./api";

export const srEndpoints = {
  // Login **************************

  login: (loginData) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "login",
    payload: loginData,
  }),

  verifyMe: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "verify/me",
  }),

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

  downloadAllPDFs: (testId, groupCode, pdfURLs) => ({
    reqType: REQ_TYPES.POST,
    endpoint: `/tests/${testId}/candidates/${groupCode}/pdf`,
    payload: pdfURLs,
    config: { responseType: "arraybuffer" },
  }),

  /**
   * @param {Object Array} reports: [{ur, studentId, testId }, ...]
   * @returns
   */
  candidateSendReport: (reports) => ({
    reqType: REQ_TYPES.POST,
    endpoint: `/candidate/send/report`,
    payload: reports,
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

  // Groups & Students ***********************

  getAllGroups: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "group",
  }),

  getAllGroupTestsInfo: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "group-test-info",
  }),

  getAllStudents: () => ({
    reqType: REQ_TYPES.GET,
    endpoint: "student",
  }),

  fetchAllGroupsAndStudents: () => ({
    reqType: REQ_TYPES.POST,
    endpoint: "fetch-groups-and-users",
  }),

  setStudentHREmail: (studentHr) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "set-student-hr-email",
    payload: studentHr,
  }),

  reminderMailToGroup: ({ testId, groupId }) => ({
    reqType: REQ_TYPES.POST,
    endpoint: "remind-hr-exam-to-group",
    payload: { testId, groupId },
  }),
};

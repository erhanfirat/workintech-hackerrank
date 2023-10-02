// CONSTANT DEFINITIONS *********************

import { doSRRequest } from "../../api/api";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES } from "../../utils/constants";

export const studentActions = Object.freeze({
  setGroups: "SET_ALL_GROUPS",
  setStudents: "SET_STUDENTS",
  updateStudent: "UPDATE_STUDENT",
  setGroupsFetchState: "SET_GROUPS_FETCH_STATE",
  setStudentsFetchState: "SET_STUDENTS_FETCH_STATE",
});

const allGroup = {
  id: "all",
  name: "all",
  title: "Tüm Katılımcılar",
};

const initialStudents = {
  groups: [
    // {
    //   active_sprint: null,
    //   id: "5878",
    //   name: "FSWEB0323",
    //   title: "Fsweb 0323 - Mart",
    //   user_count: 30,
    // },
    // ...
  ],
  students: {
    // [groupId]: [
    //     {
    //       email: "samilkafa@gmail.com",
    //       hrEmail: "samilkafa@gmail.com",
    //       name: "Şamil Kafa",
    //     },
    //     {
    //       email: "y.sinanerdem@gmail.com",
    //       hrEmail: "y.sinanerdem@gmail.com",
    //       name: "Sinan Yaşar Erdem",
    //     },
    //     ...
    //   ],
  },
  groupsFetchState: FETCH_STATES.NOT_STARTED,
  studentsFetchState: FETCH_STATES.NOT_STARTED,
};

// REDUCER ********************************

export const studentsReducer = (state = initialStudents, action) => {
  switch (action.type) {
    case studentActions.setGroups:
      return {
        ...state,
        groups: [allGroup, ...action.payload],
      };

    case studentActions.setStudents:
      const newState = { ...state };

      // clear all students of groups
      state.groups.forEach((g) => (newState.students[g.id] = []));

      // add students to their groups
      action.payload.forEach((student) => {
        newState.students[student.group_id].push(student);
      });
      newState.students.all = action.payload;

      return newState;

    case studentActions.setGroupsFetchState:
      return {
        ...state,
        groupsFetchState: action.payload,
      };

    case studentActions.setStudentsFetchState:
      return {
        ...state,
        studentsFetchState: action.payload,
      };

    case studentActions.updateStudent:
      const student = action.payload;
      return {
        ...state,
        students: {
          ...state.students,
          [student.group_id]: [
            ...state.students[student.group].filter((s) => s.id !== student.id),
            student,
          ],
        },
      };

    default:
      return state;
  }
};

export const getAllGroupsActionCreator = () => (dispatch) => {
  dispatch({
    type: studentActions.setGroupsFetchState,
    payload: FETCH_STATES.FETCHING,
  });

  doSRRequest(srEndpoints.getAllGroups())
    .then((groupsFethced) => {
      dispatch({
        type: studentActions.setGroups,
        payload: groupsFethced,
      });
      dispatch({
        type: studentActions.setGroupsFetchState,
        payload: FETCH_STATES.FETHCED,
      });
      dispatch(getAllStudentsActionCreator());
    })
    .catch((err) => {
      dispatch({
        type: studentActions.setGroupsFetchState,
        payload: FETCH_STATES.FAILED,
      });
    });
};

export const getAllStudentsActionCreator = () => (dispatch) => {
  dispatch({
    type: studentActions.setStudentsFetchState,
    payload: FETCH_STATES.FETCHING,
  });

  doSRRequest(srEndpoints.getAllStudents())
    .then((studentsFethced) => {
      dispatch({
        type: studentActions.setStudents,
        payload: studentsFethced,
      });
      dispatch({
        type: studentActions.setStudentsFetchState,
        payload: FETCH_STATES.FETHCED,
      });
    })
    .catch((err) => {
      dispatch({
        type: studentActions.setStudentsFetchState,
        payload: FETCH_STATES.FAILED,
      });
    });
};

export const fetchGroupsAndStudents = () => (dispatch) => {
  dispatch({
    type: studentActions.setGroupsFetchState,
    payload: FETCH_STATES.FETCHING,
  });
  doSRRequest(srEndpoints.fetchAllGroupsAndStudents()).then((res) => {
    dispatch(getAllGroupsActionCreator());
    dispatch({
      type: studentActions.setGroupsFetchState,
      payload: FETCH_STATES.FETHCED,
    });
  });
};

export const updateStudentAction = (student) => ({
  type: studentActions.updateStudent,
  payload: student,
});

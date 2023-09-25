// CONSTANT DEFINITIONS *********************

import { doSRRequest } from "../../api/api";
import { srEndpoints } from "../../api/srEndpoints";
import { FETCH_STATES } from "../../utils/constants";

export const studentActions = Object.freeze({
  setGroups: "SET_ALL_GROUPS",
  setStudents: "SET_STUDENTS_TO_GROUPS",
  setGroupsFetchState: "SET_GROUPS_FETCH_STATE",
  setStudentsFetchState: "SET_STUDENTS_FETCH_STATE",
});

const initialStudents = {
  groups: [
    // all groups
  ],
  students: {
    // fsweb0323: {
    //   name: "Fsweb 0323 - Mart",
    //   students: [
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
    //     {
    //       email: "aysgl_nese@hotmail.com",
    //       hrEmail: "aysgl_nese@hotmail.com",
    //       name: "Ayşegül Neşe",
    //     },
    //   ],
    // },
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
        groups: action.payload,
      };

    case studentActions.setStudents:
      const newState = { ...state };
      action.payload.forEach((student) => {
        newState.students[student.group].push(student);
      });
      return {
        ...newState,
        students: action.payload,
      };

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
      console.log("groupsFethced: ", groupsFethced);
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
      console.log("studentsFethced: ", studentsFethced);
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

export const fetchGroupsAndStudents = () => {
  doSRRequest(srEndpoints.fetchAllGroupsAndStudents()).then((res) => {
    console.log("fetchGroupsAndStudents res > ", res);
  });
};

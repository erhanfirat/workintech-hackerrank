import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { verifyUserAction } from "./store/reducers/userReducer";
import { getAllGroupsActionCreator } from "./store/reducers/studentsReducer";
import Main from "./layout/Main";
import { FETCH_STATES } from "./utils/constants";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);
  const { groupsFetchState } = useSelector((s) => s.students);

  useEffect(() => {
    dispatch(verifyUserAction());
  }, []);

  useEffect(() => {
    if (user && groupsFetchState === FETCH_STATES.NOT_STARTED) {
      dispatch(getAllGroupsActionCreator());
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Main />
      <Toaster position="bottom-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;

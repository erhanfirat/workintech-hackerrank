import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

import { verifyUserAction } from "./store/reducers/userReducer";
import Main from "./layout/Main";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUserAction());
  }, []);

  return (
    <BrowserRouter>
      <Main />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;

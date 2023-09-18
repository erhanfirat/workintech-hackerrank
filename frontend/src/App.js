import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { verifyUserAction } from "./store/reducers/userReducer";
import Main from "./layout/Main";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUserAction());
  }, []);

  return (
    <BrowserRouter>
      <Main />
      <Toaster position="bottom-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;

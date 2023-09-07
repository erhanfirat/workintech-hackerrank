import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { store } from "./store/store";
import Main from "./layout/Main";

import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { REQ_TYPES, doSRRequest } from "./api/api";

function App() {
  useEffect(() => {
    doSRRequest({ reqType: REQ_TYPES.GET, endpoint: "tests" }).then((res) => {
      console.log("sr get tests res > ", res);
    });
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

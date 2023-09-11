import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { store } from "./store/store";
import Main from "./layout/Main";

import "react-toastify/dist/ReactToastify.css";

function App() {
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

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import Main from "./layout/Main";
import { store } from "./store/store";
import { useEffect } from "react";
import axios from "axios";
import { downloadFileBlob } from "./utils/utils";

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

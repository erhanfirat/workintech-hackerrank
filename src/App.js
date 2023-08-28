import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import Main from "./layout/Main";
import { store } from "./store/store";

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

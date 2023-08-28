import { BrowserRouter } from "react-router-dom";
import Main from "./layout/Main";

import "./App.css";
import { useEffect } from "react";
import { useAxios } from "./api/useAxios";
import { endpoints } from "./api/endpoints";

function App() {

 

  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;

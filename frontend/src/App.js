import { BrowserRouter } from "react-router-dom";
import Main from "./layout/Main";
import { ThemeContainer } from "./layout/ThemeContainer";

function App() {
  return (
    <BrowserRouter>
      <ThemeContainer>
        <Main />
      </ThemeContainer>
    </BrowserRouter>
  );
}

export default App;

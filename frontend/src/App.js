import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { verifyUserAction } from "./store/reducers/userReducer";
import { getAllGroupsActionCreator } from "./store/reducers/studentsReducer";
import Main from "./layout/Main";
import { FETCH_STATES } from "./utils/constants";
import { getAllTestsAction } from "./store/reducers/testsReducer";

function App() {
  const dispatch = useDispatch();
  const { user, theme } = useSelector((s) => s.user);
  const { groupsFetchState } = useSelector((s) => s.students);
  const { fetchState: testsFetchState } = useSelector((s) => s.tests);

  // Kullanıcı oturumunu doğrula
  useEffect(() => {
    dispatch(verifyUserAction());
  }, [dispatch]);

  // Kullanıcı giriş yaptıktan sonra gerekli verileri yükle
  useEffect(() => {
    if (user) {
      // Gruplar henüz yüklenmediyse yükle
      if (groupsFetchState === FETCH_STATES.NOT_STARTED) {
        dispatch(getAllGroupsActionCreator());
      }

      // Testler henüz yüklenmediyse yükle
      if (testsFetchState === FETCH_STATES.NOT_STARTED) {
        dispatch(getAllTestsAction());
      }
    }
  }, [user, groupsFetchState, testsFetchState, dispatch]);

  return (
    <BrowserRouter>
      <div className={`app-container ${theme}`}>
        <Main />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            // Toast stil seçenekleri
            duration: 3000,
            style: {
              background: theme === "dark" ? "#333" : "#fff",
              color: theme === "dark" ? "#fff" : "#333",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

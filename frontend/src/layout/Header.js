import { Navbar, NavbarBrand, NavbarText, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import logoDark from "../logo-dark.svg";
import logoLight from "../logo-light.svg";
import UserInfo from "../components/UserInfo";
import {
  setThemeAction,
  verifyUserAction,
} from "../store/reducers/userReducer";
import { useEffect } from "react";
import { FETCH_STATES } from "../utils/constants";
import { getAllGroupsActionCreator } from "../store/reducers/studentsReducer";
import { getAllTestsAction } from "../store/reducers/testsReducer";

const Header = () => {
  const dispatch = useDispatch();
  const { user, theme } = useSelector((s) => s.user);
  const { groupsFetchState } = useSelector((s) => s.students);
  const { fetchState: testsFetchState } = useSelector((s) => s.tests);

  const isDarkTheme = theme === "dark";

  // Kullanıcı oturumunu doğrula
  useEffect(() => {
    dispatch(verifyUserAction());
  }, [dispatch]);

  // Kullanıcı giriş yaptıktan sonra gerekli verileri yükle
  useEffect(() => {
    if (user || true) {
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

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    dispatch(setThemeAction(newTheme));
  };

  return (
    <Navbar
      color={isDarkTheme ? "dark" : "light"}
      dark={isDarkTheme}
      light={!isDarkTheme}
      className="justify-content-between px-3"
    >
      <NavbarBrand href="/" className="d-flex align-items-center">
        <img
          alt="logo"
          src={isDarkTheme ? logoDark : logoLight}
          style={{
            height: 40,
          }}
          className="me-3"
        />
        Hackerrank Tests
      </NavbarBrand>
      <div className="d-flex align-items-center">
        <Button
          color={isDarkTheme ? "light" : "dark"}
          size="sm"
          className="me-3"
          onClick={toggleTheme}
          title={isDarkTheme ? "Açık Tema" : "Koyu Tema"}
        >
          <i className={`fa-solid fa-${isDarkTheme ? "sun" : "moon"} me-2`}></i>
        </Button>
        <NavbarText>
          <UserInfo />
        </NavbarText>
      </div>
    </Navbar>
  );
};

export default Header;

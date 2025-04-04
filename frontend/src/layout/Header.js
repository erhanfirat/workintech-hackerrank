import { Navbar, NavbarBrand, NavbarText, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import logoDark from "../logo-dark.svg";
import logoLight from "../logo-light.svg";
import UserInfo from "../components/UserInfo";
import { setThemeAction } from "../store/reducers/userReducer";

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.user);

  const isDarkTheme = theme === "dark";

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

import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

const activeNavLink = {
  backgroundColor: "#fffff !important",
  color: "rgb(13,110,253) !important",
};

const SideBar = () => {
  return (
    <div className="side-bar">
      <Nav vertical>
        <NavItem>
          <NavLink to={"/"} className={`nav-link`} exact>
            A<span className="hide-on-mouseout">na Sayfa</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={"/tests"} className={`nav-link`} exact>
            T<span className="hide-on-mouseout">ests</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={"/groups"} className={`nav-link`} exact>
            G<span className="hide-on-mouseout">roups</span>
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SideBar;

import { NavLink } from "react-router-dom";

const activeNavLink = {
  backgroundColor: "#fffff !important",
  color: "rgb(13,110,253) !important",
};

const SideBar = () => {
  return (
    <div className="side-bar p-3 bg-primary color-white">
      <nav className="side-bar-nav">
        <ul className="p-0">
          <li>
            <NavLink
              to={"/"}
              className={(isActive) =>
                isActive ? "btn nav-btn-active" : "btn btn-primary"
              }
              exact
            >
              Ana Sayfa
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/tests"}
              className={(isActive) =>
                isActive ? "btn nav-btn-active" : "btn btn-primary"
              }
            >
              Tests
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;

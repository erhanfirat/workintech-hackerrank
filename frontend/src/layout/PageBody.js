import { Switch, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import TestsPage from "../pages/TestsPage";
import TestPage from "../pages/TestPage";
import GroupsPage from "../pages/GroupsPage";
import { LoginPage } from "../pages/LoginPage";
import ProtectedPage from "../pages/ProtectedPage";
import GroupPage from "../pages/GroupPage";

const PageBody = () => {
  return (
    <div className="p-3 flex-grow-1 page-body">
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/tests" exact>
          <ProtectedPage PageComponent={TestsPage} />
        </Route>
        <Route path="/tests/:testId/:groupCode/:sortBy?/:asc?" exact>
          <ProtectedPage PageComponent={TestPage} />
        </Route>
        <Route path="/groups" exact>
          <ProtectedPage PageComponent={GroupsPage} />
        </Route>
        <Route path="/groups/:groupName" exact>
          <ProtectedPage PageComponent={GroupPage} />
        </Route>
        <Route path="/groups/:groupCode/:sortBy?/:asc?" exact>
          <ProtectedPage PageComponent={GroupsPage} />
        </Route>
        <Route path="*">
          <div style={{ color: "red" }}>
            <h1>404 - 4 Kahve 0 Süt 4 Şeker</h1>
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default PageBody;

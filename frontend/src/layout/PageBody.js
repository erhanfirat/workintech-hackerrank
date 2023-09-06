import { Switch, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import TestsPage from "../pages/TestsPage";
import TestPage from "../pages/TestPage";
import GroupsPage from "../pages/GroupsPage";

const PageBody = () => {
  return (
    <div className="p-3 flex-grow-1 page-body">
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/tests" exact>
          <TestsPage />
        </Route>
        <Route path="/groups" exact>
          <GroupsPage />
        </Route>
        <Route path="/tests/:testId/:sortBy?/:asc?" exact>
          <TestPage />
        </Route>
        <Route path="*">
          <div style={{ color: "red" }}>
            <h1>404 - Aradığınız sayfa bulunamadı!</h1>
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default PageBody;

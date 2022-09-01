import { Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import YourCollections from "./pages/YourCollections";
import UsersPage from "./pages/Users";
import Collection from "./pages/Collection/Collection";

const useRoutes = () => {
  return (
    <Switch>
      <Route exact path="/">
        Home
      </Route>
      <Route exact path="/admin">
        <UsersPage />
      </Route>
      <Route exact path="/your-collections">
        <YourCollections />
      </Route>
      <Route exact path="/collection/:id">
        <Collection />
      </Route>
      <Route exact path="/autentification">
        <AuthPage />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default useRoutes;

import { Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import UsersPage from "./pages/Users";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import ItemPage from "./pages/ItemPage/ItemPage";
import YourCollections from "./pages/YourCollections";
import Home from "./pages/HomePage";

const useRoutes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/admin">
        <UsersPage />
      </Route>
      <Route exact path="/your-collections">
        <YourCollections />
      </Route>
      <Route exact path="/collection/:id">
        <CollectionPage />
      </Route>
      <Route exact path="/item/:id">
        <ItemPage />
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

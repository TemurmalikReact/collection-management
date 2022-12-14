import "materialize-css";
import useRoutes from "./routes";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { login, logout, token, userId, loading } = useAuth();

  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated);
  
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token,
        userId,
        loading,
        isAuthenticated,
      }}
    >
      <Router>
        <Switch>
          <div>{routes}</div>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

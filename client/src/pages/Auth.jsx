import { useContext } from "react";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hooks";

function AuthPage() {
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();

  const auth = useContext(AuthContext);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });

      auth.login(data.token, data.userId);
    } catch (e) {
      console.log(e);
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", {
        email: form.email,
        password: form.password,
      });

      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container row" style={{ marginTop: "50px" }}>
      <div className="col s6 offset-s3">
        <div className="card">
          <div className="card-content">
            <span className="card-title">Register</span> <br />
            <div className="row">
              <div className="col s12">
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      onChange={changeHandler}
                      name="userName"
                      id="userName"
                      type="text"
                    />
                    <label htmlFor="userName">User Name</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      onChange={changeHandler}
                      name="email"
                      type="email"
                      id="email"
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      onChange={changeHandler}
                      name="password"
                      type="password"
                      id="password"
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>
              </div>
            </div>
            <button
              style={{ marginRight: "10px" }}
              disabled={loading}
              onClick={loginHandler}
              className="btn"
            >
              Login
            </button>
            <button
              disabled={loading}
              onClick={registerHandler}
              className="btn blue"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

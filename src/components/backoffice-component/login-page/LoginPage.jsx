import "./LoginPage.css";
import axiosInstance from "utils/axios";

export default function LoginPage({ setAuthenticated }) {
  return (
    <div className="filldb-container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          const data = {};
          data["email"] = e.target.email.value;
          data["password"] = e.target.password.value;
          axiosInstance
            .post("users/login", data)
            .then((res) => {
              console.log(res);
              // add cookie
              document.cookie = `jwt=${res.token}`;
              localStorage.setItem("jwt", res.token);
              setAuthenticated(true);
            })
            .catch((err) => {
              setAuthenticated(false);
            });
        }}
      >
        <h1 className="login-title">Login</h1>
        <input
          className="login-input"
          type="text"
          name="email"
          placeholder="email"
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="password"
        />
        <input type="submit" className="login-submit" value="Submit" />
      </form>
    </div>
  );
}

import "./LoginPage.css";
import axiosInstance from "utils/axios";

export default function LoginPage({ setAuthenticated }) {
  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          const data = {
            email: e.target.email.value,
            password: e.target.password.value,
          };
          axiosInstance
            .post("users/login", data)
            .then((res) => {
              document.cookie = `jwt=${res.token}`;
              localStorage.removeItem("jwt");
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
          placeholder="Email"
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
        />
        <input type="submit" className="login-submit" value="Submit" />
      </form>
    </div>
  );
}

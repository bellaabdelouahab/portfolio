import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";

export default function Root() {
  const toggleMenu = (id) => {
    const el = document.getElementById(id);
    if (el.classList.contains("hidden")) {
      document.querySelectorAll(".inner-menu").forEach((item) => {
        item.classList.add("hidden");
        item.setAttribute("aria-hidden", "true");
      });
      el.classList.remove("hidden");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.classList.add("hidden");
      el.setAttribute("aria-hidden", "true");
    }
    !el.classList.contains("hidden") && el.focus();
  };

  return (
    <>
      <NavLink id="top" />
      <header id="header" className="header header-sticky">
        <nav className="navbar at-top" id="navbar" role="navigation">
          <div className="navbar__header">
            <NavLink className="navbar__header__logolink" to="/"></NavLink>
            <div className="navbar__menu">
              <button
                htmlFor="f-toggle"
                tabIndex="0"
                id="hamburger"
                className="hamburger"
                aria-label="Toggle navigation"
                onClick={(e) => toggleMenu("hamburger-menu")}
              >
                <span></span>
              </button>
              <ul
                className="navbar__menu__list menu hidden"
                id="hamburger-menu"
                role="menu"
                aria-describedby="hamburger"
                tabIndex="0"
                aria-hidden="true"
              >
                <li>
                  <NavLink to="/" target="">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/resume" target="">
                    Resume
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/projects" target="">
                    All Projects
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/skills">Skills</NavLink>
                </li>
                <li>
                  <NavLink to="/certificates">Certificates</NavLink>
                </li>
                <li>
                  <NavLink to="/articles">Articles</NavLink>
                </li>
                <li>
                  <NavLink to="/reports">Reports</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

{
  /* <form onSubmit={ 
    e => {
        e.preventDefault();
        const imageinput = document.querySelector('input[name="file"]');
        const image = imageinput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            // axios.interceptors.request.use((req) => {
            //   // add Bearer token to all requests
            //     req.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzY2QzYWVmN2RhOWQwYzEzMGM0NWYyZiIsImlhdCI6MTY3NDQyOTI1NywiZXhwIjoxNjc3MDIxMjU3fQ.1luJjs_f9N8ZgafXApNCxBT2gw0s9VDtMQ3GVsCZXek`;
            //     // add cancel token to all requests
            //     req.cancelToken = new axios.CancelToken((cancel) => {
            //       // save cancel function to be called when component unmounts
            //     //   this.cancelRequest = cancel;

            //     });
            //     return req;
            // });
            console.log("====>", "about to send");
            const jsonPayload = {
              title: "first",
              githubLink: "bella",
              image: reader.result,
              description: "dvfvbnxcvxcv",

            };
            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();
            axios
              .post(
                "http://localhost:5000/api/projects",
                jsonPayload,
                {
                  cancelToken: source.token,
                }
              )
              .then((response) => response.json())
              .then((result) => {
                console.log("Success:", result);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
        });
        reader.readAsDataURL(image);
}}>
    <input type="text" name="name" placeholder="Name" />
    <input type="file" name="file" />
    <input type="submit" value="Send" />
</form> */
}

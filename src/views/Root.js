import { NavLink, Outlet } from "react-router-dom";
import Navbar from "components/navbar/Navbar"

export default function Root() {
  return (
    <>
      <NavLink id="top" />
      <header id="header" className="header header-sticky">
        <Navbar />
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
function createSocialLink({ href, src, alt }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-networks__link"
    >
      <img
        src={src}
        alt={alt}
        className="social-networks__link__img"
        height="20px"
        width="20px"
        style={{ margin: "0 auto", marginTop: "1rem" }}
      />
    </a>
  );
}

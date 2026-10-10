import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import { useEffect, useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageSkeleton, { variantForPath } from "../../shared/ui/PageSkeleton";
import WhatsAppFloatingButton from "../../shared/ui/WhatsAppFloatingButton";

export default function Root() {
  // createBrowserRouter keeps rendering the CURRENT route until the next route's
  // loader resolves. Without reading that state the UI simply freezes on the old
  // page and then jumps. navigation.location is the route being navigated TO.
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  const target = navigation.location?.pathname ?? "";
  const skeletonVariant = variantForPath(target);

  // Every page change starts at the top. On desktop the scrolling element is
  // `.main`; on phones it is the document itself, so both are reset (the old
  // code only reset `.main` and only on menu clicks, which left phone visitors in
  // the middle or at the end of the next page).
  const { pathname } = useLocation();
  const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useIsoLayoutEffect(() => {
    const main = document.querySelector(".main");
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Helmet>
        
      <header id="header" className="header header-sticky">
        <Navbar />
      </header>
        
      <main className="main">
        {isNavigating ? <PageSkeleton variant={skeletonVariant} /> : <Outlet />}
      </main>

      <WhatsAppFloatingButton />
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
      <img loading="lazy" decoding="async"
        src={src}
        alt={alt}
        className="social-networks__link__img"
        height="20px"
        width="20px"
        style={{ margin: "0 auto", marginTop: "0.625rem" }}
      />
    </a>
  );
}

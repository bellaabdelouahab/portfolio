import { NavLink, Outlet } from "react-router-dom";

export default function Root() {
    const toggleMenu = id => {
        const el = document.getElementById(id)
        if (el.classList.contains('hidden')) {
          document
            .querySelectorAll('.inner-menu')
            .forEach(item => {
              item.classList.add('hidden')
              item.setAttribute('aria-hidden', 'true')
            })
          el.classList.remove('hidden')
          el.setAttribute('aria-hidden', 'false')
        } else {
          el.classList.add('hidden')
          el.setAttribute('aria-hidden', 'true')
        }
        !el.classList.contains('hidden') && el.focus()
      }
      
    return (
        <>
            <NavLink id="top"/>
            <header id="header" className="header header-sticky">
                <nav className="navbar at-top" id="navbar" role="navigation">
                    <div className="navbar__header">
                            <NavLink className="navbar__header__logolink" to="/">
                            </NavLink>
                        <div className="navbar__menu">
                            <button htmlFor="f-toggle" tabIndex="0" id="hamburger" className="hamburger" aria-label="Toggle navigation" onClick={e=>{toggleMenu('hamburger-menu')}}>
                                <span></span>
                            </button>
                            <ul className="navbar__menu__list menu hidden" id="hamburger-menu" role="menu" aria-describedby="hamburger" tabIndex="0" aria-hidden="true">
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
                                    <NavLink to="/skills">
                                        Skills
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink to="/certificates">
                                        Certificates
                                    </NavLink>
                                </li> */}
                                <li>
                                    <NavLink to="/articles">
                                        Articles
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/reports">
                                        Reports
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="main">
                <Outlet/>
            </main>
    </>
    )
} 



import React from "react";
import { Link } from "react-router-dom";
import "./nav.styles.scss";
const Nav = () => {
  return (
    // <nav>
    //   <div classNameNameNameName='nav-item-container'>
    //     <Link to='/about'>About</Link>
    //     <Link to='/portfolio'>Portfolio</Link>
    //     <Link to='/contact'>Contact</Link>
    //   </div>
    // </nav>

    // <nav classNameName='level'>
    //   <p classNameName='level-item has-text-centered'>
    //     <Link to='/about'>About</Link>
    //   </p>
    //   <p classNameName='level-item has-text-centered'>
    //     <Link to='/portfolio'>Portfolio</Link>
    //   </p>
    //   <p classNameName='level-item has-text-centered'>
    //     <img
    //       src='https://bulma.io/images/bulma-type.png'
    //       alt=''
    //       style={{ height: 30 }}
    //     />
    //   </p>
    //   <p classNameName='level-item has-text-centered'>
    //     <Link to='/contact'>Contact</Link>
    //   </p>
    // </nav>
    <nav className='navbar is-warning' role='navigation' aria-label='main navigation'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/about'>
            <img
              src='https://bulma.io/images/bulma-logo.png'
              width='112'
              height='28'
              alt="bulma logo"
            />
          </Link>
        </div>

        <div id='navbarBasicExample' className='navbar-menu'></div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='buttons'>
              <Link className='button is-primary' to='/about'>
                About
              </Link>
              <Link className='button is-primary' to='/portfolio'>
                Portfolio
              </Link>
              <Link className='button is-primary' to='/contact'>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

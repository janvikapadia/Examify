import React from "react";


export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top" >
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          {/* <img src="./exam.svg"   alt="Examify Logo" className="App-logo" /> */}

          <a className="navbar-brand page-scroll" href="#">
          Examify
          </a>
          {" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Features
              </a>
            </li>

            <li>
              <a href="#testimonials" className="page-scroll">
                Testimonials
              </a>
            </li>
            
            <li>
              <a href="#about" className="page-scroll">
                About Us
              </a>
            </li>
            
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            {/* <a
              href="#login"
              className="btn btn-custom btn-lg page-scroll"
            >
              Login
            </a> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

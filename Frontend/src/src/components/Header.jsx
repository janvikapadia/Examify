import React from "react";
import heroImg from "./hero.png";

export const Header = (props) => {
  return (
    <header id="header" style={{ marginRight: '40px', marginLeft: '40px' }}>
      <div className="intro" style={{ borderRadius: '20px', marginTop: '120px', textAlign: 'left', backgroundColor: '#fff' , border: "2px solid #f7f7f7", boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)'}}>
        <div className="overlay" style={{ textAlign: "left" }}>
          <div className="container" style={{ textAlign: "left" }}>
            <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="col-md-8 intro-text" style={{ textAlign: 'left', marginTop: '-80px' }}>
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a href="/login" className="btn btn-custom btn-lg page-scroll">
                  Get Started
                </a>
              </div>
              <div className="col-md-4" style={{ textAlign: 'right', marginLeft:"-100px" }}>
                <img src={heroImg} alt="Hero" style={{ maxWidth: '600px', height: '500px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

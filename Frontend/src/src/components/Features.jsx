import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="text-center" style={{margin: '40px' , backgroundColor: '#ffffff', borderRadius: "20px" ,boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)'}}>
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Features</h2>
        </div>
        <div style={{  justifyContent: 'center', alignItems: 'center', marginLeft:"145px" }}>
          <div className="row container">
            {props.data
              ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
                  <i className={d.icon}></i>
                  <h3>{d.title}</h3>
                  <p style={{ color: 'dark grey' }}>{d.text}</p>
                </div>
              ))
              : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};

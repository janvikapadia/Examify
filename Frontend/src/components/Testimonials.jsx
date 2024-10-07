import React from "react";

export const Testimonials = (props) => {
  return (
    <div id="testimonials" style={{margin: '40px' , backgroundColor: '#ffffff', borderRadius: "20px" ,boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)'}}>
      <div className="container">
        <div className="section-title text-center">
          <h2>Don't take our word for it.</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
              <div key={`${d.name}-${i}`} className="col-md-4">
                <div className="testimonial">
                  <div className="testimonial-image">
                    {" "}
                    <img src={d.img} alt="" />{" "}
                  </div>
                  <div className="testimonial-content">
                    <p>"{d.text}"</p>
                    <div className="testimonial-meta"> - {d.name} </div>
                  </div>
                </div>
              </div>
            ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};

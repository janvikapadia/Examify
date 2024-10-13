
import { useState } from "react";
import emailjs from "emailjs-com";
import React from "react";


const initialContactState = {
  name: "",
  email: "",
  message: "",
};

export const Contact = (props) => {
  const [{ name, email, message }, setContactState] = useState(initialContactState);
  const [isThankYouModalOpen, setThankYouModalOpen] = useState(false); // State for modal visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetContactForm = () => setContactState({ ...initialContactState });

  const handleFormSubmission = (e) => {
    e.preventDefault();
    console.log(name, email, message);

    emailjs
      .sendForm("service_j3lzur4", "template_hu76n21", e.target, "I1CqS2fTAQ2L98eNM")
      .then(
        (result) => {
          console.log(result.text);
          resetContactForm(); // Clear form fields
          setThankYouModalOpen(true); // Open modal on success
        },
        (error) => {
          console.log(error.text);
          // Optionally, you can set an error message
        }
      );
  };

  const closeThankYouModal = () => setThankYouModalOpen(false); // Close modal function

  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch</h2>
                <p style={{ color: 'black' }}>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" onSubmit={handleFormSubmission}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        style={{ color: 'black' }}
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        value={name}
                        onChange={handleInputChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        style={{ color: 'black' }}
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={handleInputChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    style={{ color: 'black' }}
                    name="message"
                    id="m essage"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    value={message}
                    onChange={handleInputChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <button type="submit" className="btn btn-custom2 btn-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info" style={{ color: 'black' }}>
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.linkedin : "/"}>
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p style={{ color: 'black' }}>
            &copy; 2024 Examify. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isThankYouModalOpen && (
        <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div className="modal-content" style={{ margin: '15% auto', padding: '20px', background: 'white', width: '80%', maxWidth: '400px', textAlign: 'center' }}>
            <h2>We have received your message!</h2>
            <p>You will be contacted shortly.</p>
            <button onClick={closeThankYouModal} className="btn btn-custom2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

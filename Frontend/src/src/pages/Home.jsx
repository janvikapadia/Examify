import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Features } from "../components/Features";
import { About } from "../components/About";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import JsonData from "../data/data.json";
import SmoothScroll from "smooth-scroll";
import React, { useState, useEffect } from "react";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Home = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <Testimonials data={landingPageData.Testimonials} />
      <About data={landingPageData.About} />
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default Home;

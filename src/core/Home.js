import React from "react";
import SafePlaceLogo from "../img/logo192.png";
import Posts from "../post/Posts";
import HeroImageHomePage from "../img/heroHome.jpg";

const Home = () => (
  <div>
    <div
      className="jumbotron"
      style={{
        height: "450px",
        backgroundImage: `url(${HeroImageHomePage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <img
        src={SafePlaceLogo}
        alt="Safe Place Social Network"
        style={{ width: "60px", borderRadius: "20px", zIndex: "5" }}
      />
      <h2 style={{ fontFamily: "bangee" }}>Your Place</h2>
    </div>
    <div>
      <Posts />
    </div>
  </div>
);

export default Home;

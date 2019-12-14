import React from 'react';
import SafePlaceLogo from "../img/logo192.png";

const Home =() => (
    <div className="jumbotron">
        <img src={SafePlaceLogo} alt="Safe Place Social Network" style={{width: "60px", borderRadius: "0px"}}/>
        <h2>Home</h2>
        <p className="lead">Welcome to SafePlace</p>
    </div>
);

export default Home;

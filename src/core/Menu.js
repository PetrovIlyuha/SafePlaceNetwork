import React from "react";
import { Link, withRouter } from "react-router-dom";
import SafePlaceLogo from "../img/logo192.png";
import { isAuthenticated, signout } from "../auth";
import NavbarWave from "../img/NavWave";
const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#a4fc9f" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul
      className="nav nav-tabs bg-primary nav-fill"
      style={{ height: "65px", fontFamily: "Bungee Inline" }}
    >
      <li className="nav-item">
        <img
          src={SafePlaceLogo}
          alt="Safe Place Social Network"
          style={{
            width: "60px",
            borderRadius: "20px",
            marginRight: "calc(100vw - 600px)",
            marginTop: "2px"
          }}
        />
      </li>
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive(history, "/")}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/users"
          className="nav-link"
          style={isActive(history, "/users")}
        >
          Users
        </Link>
      </li>
      {!isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              to="/signin"
              className="nav-link"
              style={isActive(history, "/signin")}
            >
              Sing In
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/signup"
              className="nav-link"
              style={isActive(history, "/signup")}
            >
              Sign Up
            </Link>
          </li>
        </>
      )}
      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <a
              className="nav-link"
              style={
                (isActive(history, "/signup"),
                { cursor: "pointer", color: "#fff" })
              }
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
        </>
      )}
    </ul>
    <NavbarWave />
  </div>
);

export default withRouter(Menu);

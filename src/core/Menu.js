import React from "react";
import { Link, withRouter } from "react-router-dom";
import SafePlaceLogo from "../img/logo192.png";
import { isAuthenticated, signout } from "../auth";
import NavbarWave from "../img/NavWave";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faJedi,
  faHome,
  faUsers,
  faSignature,
  faBlind,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon
          icon={faJedi}
          style={{
            float: "left",
            color: "white",
            fontSize: "65px",
            padding: "17px 0 0 10px"
          }}
        />
      </li>
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive(history, "/")}>
          <FontAwesomeIcon icon={faHome} />
          {` `}
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/users"
          className="nav-link"
          style={isActive(history, "/users")}
        >
          <FontAwesomeIcon icon={faUsers} />
          {` `}
          Users
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          to={`/post/create`}
          style={isActive(history, `/post/create`)}
        >
          <FontAwesomeIcon icon={faSignature} />
          {` `}
          Create Post
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
              <FontAwesomeIcon icon={faSignInAlt} />
              {` `}
              Sing In
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/signup"
              className="nav-link"
              style={isActive(history, "/signup")}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              {` `}
              Sign Up
            </Link>
          </li>
        </>
      )}
      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/findpeople`}
              style={isActive(history, `/findpeople`)}
            >
              <FontAwesomeIcon icon={faBlind} />
              {` `}
              Find People
            </Link>
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

          <li className="nav-item">
            <a
              className="nav-link"
              style={
                (isActive(history, "/signup"),
                { cursor: "pointer", color: "#fff" })
              }
              onClick={() => signout(() => history.push("/"))}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              {` `}
              Sign Out
            </a>
          </li>
        </>
      )}
    </ul>
    <NavbarWave />
  </div>
);

export default withRouter(Menu);

import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import { Link } from "react-router-dom";
import userAvatar from "../img/userAvatar.jpg";
import { isAuthenticated } from "../auth";
import SpinnerCircles from "../shared/SpinnerCircles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStreetView, faLaughWink } from "@fortawesome/free-solid-svg-icons";

class FindPeople extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      error: "",
      open: false,
      followMessage: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  clickFollow = (user, index) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(index, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  renderUsers = users => (
    <div className="row">
      {users.map((user, index) => (
        <div className="card col-md-4 mr-2 mt-2" key={index}>
          <img
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            alt={user.name}
            onError={img => (img.target.src = `${userAvatar}`)}
            style={{ height: "250px", width: "auto" }}
            className="mt-2"
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-sm btn-primary"
            >
              <FontAwesomeIcon
                icon={faStreetView}
                style={{ fontSize: "20px" }}
              />
              {` `}
              View Profile
            </Link>

            <button
              onClick={() => this.clickFollow(user, index)}
              className="btn btn-raised btn-info float-right btn-sm"
            >
              <FontAwesomeIcon icon={faLaughWink} />
              {` `}
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, loading, followMessage, open } = this.state;
    return (
      <div className="container" style={{ fontFamily: "Righteous" }}>
        {loading ? <SpinnerCircles /> : ""}
        <h2 className="mb-5">Find People</h2>
        {open && (
          <div className="alert alert-success">
            <p>{followMessage}</p>
          </div>
        )}
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;

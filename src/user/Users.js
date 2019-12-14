import React, { Component } from "react";
import { listUsers } from "./apiUser";
import { Link } from "react-router-dom";
import userAvatar from "../img/userAvatar.jpg";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    listUsers().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = users => (
    <div className="row">
      {users.map((user, index) => (
        <div className="card col-md-4 mr-2 mt-2" key={index}>
          <img
            className="card-img-top"
            src={userAvatar}
            alt="User Profile"
            style={{ width: "100%", height: "60%", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-small btn-primary"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container" style={{ fontFamily: "Righteous" }}>
        <h2 className="mt-5 mb-5">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;

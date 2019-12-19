import React, { Component } from "react";
import { listUsers } from "./apiUser";
import { Link } from "react-router-dom";
import userAvatar from "../img/userAvatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCardAlt } from "@fortawesome/free-solid-svg-icons";

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
              className="btn btn-raised btn-small btn-primary"
            >
              <FontAwesomeIcon icon={faIdCardAlt} />
              {`  `}
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
        <h2 className="mb-5">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;

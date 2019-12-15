import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { read } from "./apiUser";
import userAvatar from "../img/userAvatar.jpg";
import DeleteUser from "./DeleteUser";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      redirectToSignin: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      const userId = this.props.match.params.userId;
      this.init(userId);
    }
  }

  render() {
    const { redirectToSignin, user } = this.state;
    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${
          new Date().getTime
        }`
      : userAvatar;

    if (redirectToSignin) return <Redirect to="/signin" />;
    return (
      <div className="container" style={{ fontFamily: "Righteous" }}>
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <img
              src={photoUrl}
              alt={user.name}
              style={{ height: "200px", width: "auto" }}
              onError={img => (img.target.src = `${userAvatar}`)}
            />
          </div>
          <div className="col-md-6">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

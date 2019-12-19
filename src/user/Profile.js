import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { read } from "./apiUser";
import userAvatar from "../img/userAvatar.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faUsersCog,
  faGrinTongueSquint
} from "@fortawesome/free-solid-svg-icons";
class Profile extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    };
  }

  // check if followed
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  clickFollowButton = callAPI => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callAPI(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  componentDidMount() {
    this._isMounted = true;
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
    const { redirectToSignin, user, posts } = this.state;
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
          <div className="col-md-4">
            <img
              src={photoUrl}
              alt={user.name}
              style={{ height: "200px", width: "auto", borderRadius: "20px" }}
              onError={img => (img.target.src = `${userAvatar}`)}
            />
          </div>
          <div className="col-md-8">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-dark mr-5"
                  to={`/post/create`}
                >
                  <FontAwesomeIcon icon={faSignature} />
                  {` `}
                  Create Post
                </Link>
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  <FontAwesomeIcon icon={faUsersCog} />
                  {` `}
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

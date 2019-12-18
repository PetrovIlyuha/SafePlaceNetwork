import React, { Component } from "react";
import { Link } from "react-router-dom";
import userAvatar from "../img/userAvatar.jpg";
import Spinner from "../shared/SpinnerCircles";

export default class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3> <hr />
            {followers.map((person, index) => (
              <div key={index}>
                <div className="row">
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <img
                        className="float-left mr-2"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                        alt={person.name}
                        style={{
                          height: "100px",
                          width: "auto",
                          borderRadius: "50%",
                          border: "1px solid black"
                        }}
                        onError={img => (img.target.src = `${userAvatar}`)}
                      />
                      <p style={{ fontSize: "1rem" }}>{person.name}</p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Following</h3> <hr />
            {following.map((person, index) => (
              <div key={index}>
                <div className="row">
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <div>
                        <img
                          className="float-left mr-2"
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                          style={{
                            height: "100px",
                            width: "auto",
                            borderRadius: "50%",
                            border: "1px solid black"
                          }}
                          onError={img => (img.target.src = `${userAvatar}`)}
                        />
                      </div>
                      <div>
                        <p style={{ fontSize: "1rem" }}>{person.name}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
            {!posts.length ? (
              <Spinner />
            ) : (
              posts.map((post, index) => (
                <div key={index}>
                  <div className="row">
                    <div>
                      <Link to={`/post/${post._id}`}>
                        <div>
                          <p className="lead">{post.title}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import { singlePost, deletePost } from "./apiPost";
import defaultPostImage from "../img/defaultPostImage.jpg";
import { Link } from "react-router-dom";
import SpinnerCircles from "../shared/SpinnerCircles";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      redirectToHome: false
    };
  }

  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
  }

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    deletePost(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete this Post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.name}
          onError={img => (img.target.src = `${defaultPostImage}`)}
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thumbnail mb-3"
        />
        <p className="card-text" style={{ fontFamily: "Poppins" }}>
          {post.body}
        </p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName}</Link> on{" "}
          {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={"/"} className="btn btn-raised btn-primary btn-sm">
            Back to Posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-dark btn-sm mr-5 ml-2"
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome } = this.state;
    if (redirectToHome) {
      return <Redirect to={"/"} />;
    }
    return (
      <div className="container mt-5 ml-5">
        <h2 className="display-2 ml-3" style={{ fontFamily: "Poppins" }}>
          {post.title}
        </h2>
        {!post ? <SpinnerCircles /> : this.renderPost(post)}
      </div>
    );
  }
}

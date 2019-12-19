import React, { Component } from "react";
import { singlePost, deletePost, likePost, unlikePost } from "./apiPost";
import defaultPostImage from "../img/defaultPostImage.jpg";
import { Link } from "react-router-dom";
import SpinnerCircles from "../shared/SpinnerCircles";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChevronCircleLeft,
  faHighlighter,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      like: false,
      likes: 0,
      redirectToHome: false,
      redirectToSignIn: false
    };
  }

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.includes(userId);
    return match;
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes)
        });
      }
    });
  }

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignIn: true });
      return false;
    }
    let callApi = this.state.like ? unlikePost : likePost;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

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
    const { like, likes } = this.state;
    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.name}
          onError={img => (img.target.src = `${defaultPostImage}`)}
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thumbnail mb-3"
        />
        <div className="block">
          <button className="btn btn-secondary" onClick={this.likeToggle}>
            {like ? (
              <FontAwesomeIcon
                icon={faThumbsDown}
                style={{
                  fontSize: "40px",
                  color: "green",
                  backgroundColor: "brown",
                  padding: "10px",
                  borderRadius: "50%",
                  border: "1px solid black"
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faThumbsUp}
                size="lg"
                style={{
                  fontSize: "40px",
                  color: "blue",
                  backgroundColor: "lightblue",
                  padding: "10px",
                  borderRadius: "50%",
                  border: "1px solid black"
                }}
              />
            )}
          </button>
          <h3 style={{ fontFamily: "Poppins" }}>
            {likes > 1 ? `${likes} Likes` : `${likes} Like`}
          </h3>
        </div>
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
            <FontAwesomeIcon icon={faChevronCircleLeft} />
            {` `}
            Back to Posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-dark btn-sm mr-5 ml-2"
                >
                  <FontAwesomeIcon icon={faHighlighter} />
                  {` `}
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                  {` `}
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignIn } = this.state;
    if (redirectToHome) {
      return <Redirect to={"/"} />;
    } else if (redirectToSignIn) {
      return <Redirect to={"/signin"} />;
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

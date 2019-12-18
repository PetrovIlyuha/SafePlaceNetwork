import React, { Component } from "react";
import { singlePost } from "./apiPost";
import defaultPostImage from "../img/defaultPostImage.jpg";
import { Link } from "react-router-dom";
import SpinnerCircles from "../shared/SpinnerCircles";

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: ""
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
        <Link to={"/"} className="btn btn-raised btn-primary btn-sm">
          Back to Posts
        </Link>
      </div>
    );
  };

  render() {
    const { post } = this.state;
    return (
      <div className="container mt-5 ml-5">
        <h2 className="display-2 ml-3" style={{ fontFamily: "Righteous" }}>
          {post.title}
        </h2>
        {!post ? <SpinnerCircles /> : this.renderPost(post)}
      </div>
    );
  }
}

import React, { Component } from "react";
import { listPosts } from "./apiPost";
import { Link } from "react-router-dom";
import defaultPostImage from "../img/defaultPostImage.jpg";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    listPosts().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
        console.log(data);
      }
    });
  }

  renderPosts = posts => {
    return (
      <div className="row">
        {posts.map((post, index) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          return (
            <div className="card col-md-4 mr-2 mt-2" key={index}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.name}
                  onError={img => (img.target.src = `${defaultPostImage}`)}
                  style={{ height: "200px", width: "auto" }}
                  className="img-thumbnail mb-3"
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substr(0, 100)}</p>
                <br />
                <p className="font-italic mark">
                  Posted by <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                  {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className="btn btn-raised btn-sm btn-primary"
                >
                  Read Post
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="container" style={{ fontFamily: "Righteous" }}>
        <h2 className="mb-5">Recent Posts</h2>
        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;

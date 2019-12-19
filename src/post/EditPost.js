import React, { Component } from "react";
import { singlePost, updatePost } from "../post/apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import defaultPostImage from "../img/defaultPostImage.jpg";
import SpinnerAudio from "../shared/SpinnerAudio";

export default class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false
    };
  }

  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          fileSize: 0,
          loading: false
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 500000) {
      this.setState({
        error: "FileSize of the photo is limited with 500Kb...",
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({
        error: "Title and body of the post must contain something...",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      updatePost(postId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label htmlFor="photo" className="text-muted">
          Post Photo
        </label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name" className="text-muted">
          Title
        </label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="text-muted">
          Body
        </label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  render() {
    const { id, title, body, redirectToProfile, loading, error } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
          className="img-thumbnail"
        >
          {error}
        </div>
        {loading ? <SpinnerAudio /> : ""}
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`}
          className="img-thumbnail"
          alt={title}
          style={{ height: "200px", width: "auto" }}
          onError={img => (img.target.src = `${defaultPostImage}`)}
        />

        {this.editPostForm(title, body)}
      </div>
    );
  }
}

import React, { PureComponent } from "react";
import { isAuthenticated } from "../auth";
import { createPost } from "./apiPost";
import { Redirect } from "react-router-dom";
import SpinnerAudio from "../shared/SpinnerAudio";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
class NewPost extends PureComponent {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      fileSize: 0,
      user: {},
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000000) {
      this.setState({
        error: "FileSize of the photo is limited with 1Mb...",
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
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      createPost(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label htmlFor="photo" className="text-muted">
          Profile Photo
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
        <FontAwesomeIcon icon={faSignature} />
        {` `}
        Create Post
      </button>
    </form>
  );

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create New Post</h2>
        {loading ? <SpinnerAudio /> : ""}
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
          className="img-thumbnail"
        >
          {error}
        </div>
        {/*<img
          src={photoUrl}
          alt={name}
          style={{ height: "200px", width: "auto" }}
          onError={img => (img.target.src = `${userAvatar}`)}
        />*/}
        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;

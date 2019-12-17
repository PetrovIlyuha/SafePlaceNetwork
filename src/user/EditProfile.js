import React, { PureComponent } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import SpinnerAudio from "../shared/SpinnerAudio";
import userAvatar from "../img/userAvatar.jpg";

class EditProfile extends PureComponent {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      about: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000000) {
      this.setState({
        error: "FileSize of the photo is limited with 1Mb...",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({
        error: "Name must contain something...",
        loading: false
      });
      return false;
    }
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      this.setState({
        error: "Email must have appropriate format...",
        loading: false
      });
      return false;
    }
    if (
      (password.length >= 1 && password.length <= 5) ||
      !/\d/.test(password)
    ) {
      this.setState({
        error:
          "Password must be at least 6 characters long and contain at least one digit...",
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
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signUpForm = (name, email, password, about) => (
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
          Name
        </label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="text-muted">
          Email
        </label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label htmlFor="about" className="text-muted">
          About Me
        </label>
        <textarea
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="text-muted">
          Password
        </label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${
          new Date().getTime
        }`
      : userAvatar;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        {loading ? <SpinnerAudio /> : ""}
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
          className="img-thumbnail"
        >
          {error}
        </div>
        <img
          src={photoUrl}
          alt={name}
          style={{ height: "200px", width: "auto" }}
          onError={img => (img.target.src = `${userAvatar}`)}
        />
        {this.signUpForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;

// Comment to test git diff

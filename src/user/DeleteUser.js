import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { removeAccount } from "./apiUser";
import { signout } from "../auth";
import { Redirect } from "react-router-dom";

class DeleteUser extends Component {
  state = {
    redirect: false
  };
  deleteAccount = () => {
    const token = isAuthenticated().token;
    const { userId } = this.props;
    removeAccount(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // signout user and redirect
        signout(() => {
          console.log("User was deleted from DB...");
        });
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your Account?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        className="btn btn-raised btn-danger mr-5"
        onClick={this.deleteConfirmed}
      >
        Delete
      </button>
    );
  }
}

export default DeleteUser;

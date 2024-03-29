import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import SignUp from "./user/SignUp";
import SignIn from "./user/SignIn";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import FindPeople from "./user/FindPeople";
import SinglePost from "./post/SinglePost";
import NewPost from "./post/NewPost";
import EditPost from "./post/EditPost";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/post/create" component={NewPost} />
      <Route exact path="/post/:postId" component={SinglePost} />
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/signin" component={SignIn} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
      <PrivateRoute exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/findpeople" component={FindPeople} />
      <Route exact path="/users" component={Users} />
    </Switch>
  </div>
);

export default MainRouter;

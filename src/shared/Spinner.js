import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Loader from "react-loader-spinner";
export default class Spinner extends React.Component {
  //other logic
  render() {
    return (
      <Loader
        type="Audio"
        color="#49917f"
        height={100}
        width={100}
        timeout={3000} //3 secs
      />
    );
  }
}

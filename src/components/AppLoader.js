import React, { Component } from "react";
import { Loading } from "./SpectreCSS";

class AppLoader extends Component {
  componentDidMount() {
    document.querySelector("body").style.background =
      "linear-gradient(to right, #1b282d, #184846)";
  }

  componentWillUnmount() {
    document.querySelector("body").style.background = null;
  }

  render = () => (
    <div style={{ margin: "120px 0px", textAlign: "center", color: "white" }}>
      <h1>The Sound Pursuit 2</h1>
      <Loading
        large
        style={{
          marginTop: 50,
          transform: "scale(2)"
        }}
      />
    </div>
  );
}

export default AppLoader;

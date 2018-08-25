import React from "react";
import { Loading } from "./SpectreCSS";

const AppLoader = () => (
  <div style={{ margin: 50, textAlign: "center" }}>
    Loading...
    <Loading large />
  </div>
);

export default AppLoader;

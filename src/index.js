import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import "stylecraft/dist/stylecraft.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./css/index.css";
import "./css/fonts.css";
import "./css/input-range.css";
import "./css/hacks.css";
import "./css/mapbox-hacks.css";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

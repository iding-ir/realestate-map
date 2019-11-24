import React from "react";
import ReactDOM from "react-dom";
import "./framework/vars.css";
import "./framework/reset.css";
import "./framework/fonts.css";
import "./framework/framework.css";
import "./index.css";
import "./hacks.css";
import App from "./components/app";
import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

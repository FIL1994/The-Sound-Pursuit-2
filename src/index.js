/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { startSession, getDateTime, initSession } from "./ng/NG_Connect";
import { NG } from "./ng/UnlockMedals";

import App from "./components/App";
import reducers from "./reducers";
import "./setupSoundJS";
import "./helpers/setupTweenJS";

import "fg-select-css/src/select-css.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-image-lightbox/style.css';
import "spectre.css/dist/spectre-exp.css";
// import "./styles/spectre-dark.min.css";
import "./index.scss";

import fa from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faSolid from "@fortawesome/fontawesome-free-solid";
import { faCircle } from "@fortawesome/fontawesome-free-regular";

fa.library.add(faSolid, faCircle);

const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// NG Start Session
initSession();
startSession(() => {
  NG.fetchedUser = true;
  NG.executeQueue();
});
getDateTime();


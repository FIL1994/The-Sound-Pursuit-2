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
import AppLoader from "./components/AppLoader";

import reducers from "./reducers";
import "./setupSoundJS";
import "./helpers/setupTweenJS";

import "spectre.css/dist/spectre-exp.css";
// import "./styles/spectre-dark.min.css";
import "./index.scss";
import Loadable from "react-loadable";

const store = createStore(reducers, applyMiddleware(ReduxThunk));

const App = Loadable({
  loader: () => import("./components/App"),
  loading: AppLoader
});

ReactDOM.render(
  <Provider store={store}>
    {/* <AppLoader /> */}
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

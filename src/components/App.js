/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import _ from "lodash";
import { getScore } from "../actions/index";

import HasStarted from "./HasStarted";
import HeaderNav from "./HeaderNav";
import Dashboard from "./pages/Dashboard";
import Start from "./pages/Start";
import Songs from "./pages/Songs";
import Records from "./pages/Records";
import MainMenu from "./pages/MainMenu";
import Settings from "./pages/Settings";
import ReleaseRecord_DragAndDrop from "./pages/DragAndDrop";
import Single from "./pages/Single";
import Album from "./pages/Album";
import Tour from "./pages/Tour";
import Charts from "./pages/Charts";
import numeral from "numeral";

import "fg-select-css/src/select-css.css";
import "react-toastify/dist/ReactToastify.css";
import "react-image-lightbox/style.css";

import fa from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faSolid from "@fortawesome/fontawesome-free-solid";
import { faCircle } from "@fortawesome/fontawesome-free-regular";
fa.library.add(faSolid, faCircle);

let ROOT_URL =
  process.env.NODE_ENV === "production" ? "assets/bg/" : "/assets/bg/";

const backgroundImage = `${ROOT_URL}dust_scratches.jpg`;
// "https://www.toptal.com/designers/subtlepatterns/patterns/dust_scratches.png";
/*
  /assets/bg/

  vintage-concrete.jpg
  cork-wallet.jpg
  ep_naturalwhite.jpg
  crossword.jpg
  dust_scratches.jpg
  */

class App extends Component {
  state = {
    modalActive: true
  };

  lastScore = {};

  hideModalScore = () => {
    this.setState({ modalActive: false });
  };

  renderModalScore = () => {
    if (this.lastScore === this.props.score) {
      return;
    }

    this.lastScore = this.props.score;
    const { years, score } = this.lastScore;

    return (
      <div id="modal-score" className={`modal modal-sm active`}>
        <a
          href="#site"
          className="modal-overlay"
          aria-label="Close"
          onClick={this.hideModalScore}
        />
        <div className="modal-container">
          <div className="modal-header">
            <a
              href="#site"
              className="btn btn-clear float-right"
              aria-label="Close"
              onClick={this.hideModalScore}
            />
            <div className="modal-title h5 text-center">
              Been Around for {years} Years
            </div>
            <div className="modal-body">
              <div className="content">
                You band has lasted {years} years! <br />
                Your score of {numeral(score).format()} has been submitted.
              </div>
            </div>
            <div className="modal-footer">
              <a
                href="#site"
                className="btn btn-link"
                onClick={this.hideModalScore}
              >
                Okay
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { score } = this.props;

    return (
      <BrowserRouter>
        <div
          id="site"
          className="site"
          style={{ background: `url(${backgroundImage})` }}
        >
          <HasStarted />
          <HeaderNav />
          <Switch>
            <Route exact path="/" component={MainMenu} />
            <Route path="/start/" component={Start} />
            <Route path="/dashboard/" component={Dashboard} />
            <Route path="/songs/" component={Songs} />
            <Route exact path="/records/" component={Records} />
            <Route
              path="/records/release/"
              component={ReleaseRecord_DragAndDrop}
            />
            <Route path="/settings/" component={Settings} />
            <Route path="/single/:id" component={Single} />
            <Route path="/album/:id" component={Album} />
            <Route path="/tour/" component={Tour} />
            <Route path="/charts/" component={Charts} />
            <Redirect to="/" />
          </Switch>
          {_.isEmpty(score) ? null : this.renderModalScore()}
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    score: state.score
  };
}

export default connect(
  mapStateToProps,
  { getScore }
)(App);

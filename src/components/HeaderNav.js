/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink, matchPath, withRouter } from "react-router-dom";
import _ from "lodash";
import { getFans, getCash, getWeek } from "../actions";
import localForage, { DATA_BAND } from "../data/localForage";
import { weeksToYearsAndWeeks , formatNumber} from "../data/util";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/fontawesome-free-regular";
import numeral from "numeral";

const MyNavLink = props => {
  return (
    <NavLink
      {...props}
      className={`btn btn-lg ${props.className || ""}`}
      activeClassName="btn-primary"
    />
  );
};

class HeaderNav extends Component {
  state = {
    hasStarted: false
  };

  componentDidMount() {
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  componentDidUpdate() {
    setTimeout(() => {
      localForage.getItem(DATA_BAND, (err, value) => {
        const hasStarted = _.isEmpty(err) && !_.isEmpty(value);

        if (this.state.hasStarted !== hasStarted) {
          this.setState({
            hasStarted
          });
        }
      });
    });
  }

  isLinkActive = match => {
    if (!match) {
      return false;
    }
    return !(match.url === "/" && !match.isExact);
  };

  renderLinks() {
    return (
      <Fragment>
        <MyNavLink
          to="/dashboard"
          isActive={this.isLinkActive}
          className="tooltip tooltip-bottom"
          data-tooltip="Home"
        >
          <FontAwesomeIcon icon="home" />
        </MyNavLink>
        <MyNavLink
          to="/songs"
          isActive={this.isLinkActive}
          className="tooltip tooltip-bottom"
          data-tooltip="Songs"
        >
          <FontAwesomeIcon icon="music" />
        </MyNavLink>
        <MyNavLink
          to="/records"
          isActive={this.isLinkActive}
          className="tooltip tooltip-bottom"
          data-tooltip="Records"
        >
          <FontAwesomeIcon icon={faCircle} />
        </MyNavLink>
        <MyNavLink
          to="/tour"
          isActive={this.isLinkActive}
          className="tooltip tooltip-bottom"
          data-tooltip="Tour"
        >
          <FontAwesomeIcon icon="globe" />
        </MyNavLink>
        <MyNavLink
          to="/charts"
          isActive={this.isLinkActive}
          className="tooltip tooltip-bottom"
          data-tooltip="Charts"
        >
          <FontAwesomeIcon icon="list-ol" />
        </MyNavLink>
      </Fragment>
    );
  }

  getParamHasStarted = () => {
    const { search } = this.props.location;
    let paramHasStarted = "";

    if (!_.isEmpty(search)) {
      // get the param by decoding the uri to remove strings such as '%20' and split the string on 'hasStarted=' and '&'
      try {
        paramHasStarted = decodeURI(search)
          .split("hasStarted=")[1]
          .split("&")[0]
          .trim();
      } catch (e) {
        return true;
      }
    }

    return paramHasStarted === "true";
  };

  render() {
    let hasStarted = this.getParamHasStarted();
    if (!hasStarted) {
      hasStarted = this.state.hasStarted;
    }

    const isStart = matchPath(this.props.location.pathname, {
      path: "/start",
      strict: false,
      isExact: true
    });

    if (this.props.location.pathname === "/") {
      return null;
    }
    return (
      <header className="navbar bg-dark">
        <section className="navbar-section">
          {!_.isEmpty(isStart) || !hasStarted ? (
            <NavLink to="/" className="btn btn-lg">
              Back to Main Menu
            </NavLink>
          ) : (
            this.renderLinks()
          )}
        </section>
        <section className="navbar section text-light">
          <h6
            className="centered p-2 tooltip tooltip-bottom"
            data-tooltip={`${numeral(this.props.fans).format()} Fans`}
          >
            <i className="icon icon-people" />
            <span className="left-space-1">
              {_.isNumber(this.props.fans) ? (
                formatNumber(this.props.fans, false)
              ) : (
                <div className="loading" />
              )}
            </span>
          </h6>
          <h6
            className="centered p-2 tooltip tooltip-bottom"
            data-tooltip={numeral(this.props.cash).format("$0,0.00")}
          >
            {_.isNumber(this.props.cash) ? (
              `$${formatNumber(this.props.cash, true)}`
            ) : (
              <div className="loading" />
            )}
          </h6>
          <h6 className="centered p-2">
            {_.isNumber(this.props.week) ? (
              weeksToYearsAndWeeks(this.props.week)
            ) : (
              <div className="loading" />
            )}
          </h6>
          <NavLink
            to={{
              pathname: "/settings",
              search: `?hasStarted=${hasStarted.toString()}`
            }}
            className="text-light centered p-2 tooltip tooltip-bottom"
            data-tooltip="Settings"
          >
            <FontAwesomeIcon icon="cog" className="my-icon" />
          </NavLink>
        </section>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    week: state.week,
    cash: state.cash,
    fans: state.fans
  };
}

export default withRouter(
  connect(mapStateToProps, { getFans, getCash, getWeek })(HeaderNav)
);

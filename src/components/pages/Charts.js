/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Page, Loading, Button } from "../SpectreCSS";
import _ from "lodash";
import numeral from "numeral";
import { Trail, animated } from "react-spring";
import { LazyImage } from "react-lazy-images";
import ReactLoading from "react-loading";

import { getCharts, getBand } from "../../actions";
import { checkNA, weeksToYearsAndWeeks } from "../../data/util";
import { springConfig } from "../../helpers";

class Charts extends Component {
  state = {
    showSingles: true
  };

  componentDidMount() {
    this.props.getCharts();
    this.props.getBand();
  }

  render() {
    const { charts, userBand } = this.props;
    const { showSingles } = this.state;
    let songsOnChart =
      _.isEmpty(charts) || _.isEmpty(userBand)
        ? 0
        : showSingles
          ? _.take(charts.singles, 40).filter(c => c.band === "USER").length
          : _.take(charts.albums, 40).filter(c => c.band === "USER").length;

    const chartItems = _.take(showSingles ? charts.singles : charts.albums, 40);

    return (
      <Page centered>
        {_.isEmpty(charts) || _.isEmpty(userBand) ? (
          <Fragment>
            Loading Charts
            <Loading large />
          </Fragment>
        ) : (
          <Fragment>
            <div>
              {songsOnChart} of your {showSingles ? "singles" : "albums"}{" "}
              charted
            </div>
            <div className="btn-group btn-group-block centered col-4">
              <Button
                primary={showSingles}
                onClick={() => {
                  this.setState({ showSingles: true });
                  document.querySelector(".scrollable").scroll(0, 0);
                }}
              >
                Singles
              </Button>
              <Button
                primary={!showSingles}
                onClick={() => {
                  this.setState({ showSingles: false });
                  document.querySelector(".scrollable").scroll(0, 0);
                }}
              >
                Albums
              </Button>
            </div>
            <ul className="scrollable" style={{ overflowX: "hidden" }}>
              <Trail
                native
                from={{ opacity: 0, x: -100 }}
                to={{ opacity: 1, x: 0 }}
                keys={chartItems.map(i => `${showSingles ? "s" : "a"}-${i.id}`)}
                config={springConfig}
              >
                {chartItems.map(
                  (
                    {
                      id,
                      band,
                      title,
                      salesLastWeek,
                      charts: { peak, lastWeek, firstCharted },
                      imgURL
                    },
                    index
                  ) => ({ x, opacity }) => {
                    const isUser = band === "USER";
                    if (isUser) {
                      band = userBand.name;
                    }

                    return (
                      <animated.li
                        className={`tile ${isUser ? "bg-dark" : "bg-other"}`}
                        style={{
                          opacity,
                          transform: x.interpolate(
                            x => `translate3d(${x}%,0,0)`
                          ),
                          height: 100
                        }}
                      >
                        <div className="tile-icon">
                          <LazyImage
                            className="img-fit-contain"
                            src={imgURL}
                            actual={({ imageProps }) => (
                              <img
                                {...imageProps}
                                alt={title}
                                height={100}
                                width={100}
                              />
                            )}
                            placeholder={({ imageProps, ref }) => {
                              return (
                                <div
                                  ref={ref}
                                  style={{ width: 100, height: 100 }}
                                >
                                  <div
                                    style={{ marginLeft: 18, marginTop: 16 }}
                                  >
                                    <ReactLoading
                                      type="spinningBubbles"
                                      color="#ffffff"
                                      delay={300}
                                    />
                                  </div>
                                </div>
                              );
                            }}
                          />
                        </div>
                        <div className="tile-content">
                          <p className="tile-title">
                            #{index + 1}. {title} - {band}
                          </p>
                          <p className="tile-subtitle text-gray">
                            Peak: {checkNA(peak)} | Last Week:{" "}
                            {checkNA(lastWeek)} | Sales:{" "}
                            {numeral(salesLastWeek).format()}
                            <br />
                            First Charted: {weeksToYearsAndWeeks(firstCharted)}
                          </p>
                        </div>
                      </animated.li>
                    );
                  }
                )}
              </Trail>
            </ul>
          </Fragment>
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    charts: state.charts,
    userBand: state.band
  };
}

export default connect(
  mapStateToProps,
  { getCharts, getBand }
)(Charts);

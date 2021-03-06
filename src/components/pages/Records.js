/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import numeral from "numeral";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { Trail, animated } from "react-spring";
import Select from "rc-select";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";

import { Page, EmptyState, Button, Grid } from "../SpectreCSS";
import { checkNA, weeksToYearsAndWeeks } from "../../data/util";
import { getSongs, getSingles, getAlbums, getWeek } from "../../actions";
import { NumberEase, formatNumber, springConfig } from "../../helpers";

const { Column } = Grid;

const defaultPaginationState = {
  pageSize: 10,
  current: 1
};

class Records extends Component {
  state = {
    showAlbums: false,
    ...defaultPaginationState
  };

  componentDidMount() {
    this.props.getWeek();
    this.props.getSongs();
    this.props.getSingles();
    this.props.getAlbums();

    if (!this.state.showAlbums && _.isEmpty(this.props.singles)) {
      setTimeout(() => this.setState({ showAlbums: true }));
    }
  }

  componentDidUpdate() {
    // fixes bug where window scrolls down
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  getRange = () => {
    const { current, pageSize } = this.state;
    return [(current - 1) * pageSize, current * pageSize];
  };

  renderSinglesOrAlbumsSwitch = () => {
    const { showAlbums } = this.state;
    return (
      <span className="form-group text-right float-right">
        {`Singles `}
        <label className="form-switch">
          <input
            type="checkbox"
            onChange={e => {
              this.setState({
                showAlbums: e.target.checked,
                ...defaultPaginationState
              });
            }}
            checked={showAlbums}
          />
          <i className="form-icon" /> Albums
        </label>
      </span>
    );
  };

  renderSingles = () => {
    let { singles, week } = this.props;
    singles = _.sortBy(singles, ({ released }) => {
      return -released;
    });

    if (_.isEmpty(singles)) {
      return (
        <Fragment>
          {this.renderSinglesOrAlbumsSwitch()}
          <EmptyState
            icon={<FontAwesomeIcon icon="file-audio" size="4x" />}
            title="You haven't released any singles yet"
          />
        </Fragment>
      );
    }

    let totalSingleSales = 0,
      bestSellingSingle = { sales: 0 };
    singles.forEach(({ sales, title, id }) => {
      if (sales > bestSellingSingle.sales) {
        bestSellingSingle = { sales, title, id };
      }
      totalSingleSales += sales;
    });

    return (
      <div>
        <div>
          <span className="float-left">
            Total Single Sales:{" "}
            <NumberEase value={totalSingleSales} format={formatNumber} />
            <br />
            Best Selling Single:{" "}
            <Link to={`/single/${bestSellingSingle.id}`}>
              {bestSellingSingle.title}
            </Link>{" "}
            -{" "}
            <NumberEase value={bestSellingSingle.sales} format={formatNumber} />
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div
          className="scrollable centered full-width"
          style={{ overflowX: "hidden" }}
        >
          <Trail
            native
            from={{ opacity: 0, x: -100 }}
            to={{ opacity: 1, x: 0 }}
            keys={singles.map(s => "s" + s.id)}
            config={springConfig}
          >
            {singles
              .slice(...this.getRange())
              .map(
                ({
                  id,
                  title,
                  quality,
                  released,
                  salesLastWeek,
                  sales,
                  charts: { peak }
                }) => ({ x, opacity }) => {
                  const age = week - released;
                  return (
                    <animated.div
                      className="card bg-dark record"
                      style={{
                        opacity,
                        transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                      }}
                    >
                      <div className="card-header">
                        <div className="card-title h5">
                          <Link to={`/single/${id}`}>{title}</Link>
                        </div>
                        <div className="record-release">
                          {weeksToYearsAndWeeks(released)} (
                          {`${age} ${age === 1 ? "week" : "weeks"}`})
                        </div>
                      </div>
                      <div className="card-body">
                        <Grid>
                          <Column width={4}>
                            Quality: {quality}
                            <br />
                            Peak Chart Position: {checkNA(peak)}
                          </Column>
                          <Column width={4}>
                            Sales Last Week: {numeral(salesLastWeek).format()}
                            <br />
                            Total Sales: {numeral(sales).format()}
                          </Column>
                        </Grid>
                      </div>
                    </animated.div>
                  );
                }
              )}
          </Trail>
        </div>
      </div>
    );
  };

  renderAlbums = () => {
    let { albums, week } = this.props;
    albums = _.sortBy(albums, ({ released }) => {
      return -released;
    });

    if (_.isEmpty(albums)) {
      return (
        <Fragment>
          {this.renderSinglesOrAlbumsSwitch()}
          <EmptyState
            icon={<FontAwesomeIcon icon="file-audio" size="4x" />}
            title="You haven't released any albums yet"
          />
        </Fragment>
      );
    }

    let totalAlbumSales = 0,
      bestSellingAlbum = { sales: 0 };
    albums.forEach(({ sales, title, id }) => {
      if (sales > bestSellingAlbum.sales) {
        bestSellingAlbum = { sales, title, id };
      }
      totalAlbumSales += sales;
    });

    return (
      <div>
        <div>
          <span className="float-left">
            Total Album Sales:{" "}
            <NumberEase value={totalAlbumSales} format={formatNumber} />
            <br />
            Best Selling Album:{" "}
            <Link to={`/album/${bestSellingAlbum.id}`}>
              {bestSellingAlbum.title}
            </Link>{" "}
            -{" "}
            <NumberEase value={bestSellingAlbum.sales} format={formatNumber} />
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div
          className="scrollable centered full-width"
          style={{ overflowX: "hidden" }}
        >
          <Trail
            native
            from={{ opacity: 0, x: 100 }}
            to={{ opacity: 1, x: 0 }}
            keys={albums.map(a => "a" + a.id)}
            config={springConfig}
          >
            {albums
              .slice(...this.getRange())
              .map(
                ({
                  id,
                  title,
                  quality,
                  released,
                  salesLastWeek,
                  sales,
                  charts: { peak }
                }) => ({ x, opacity }) => {
                  const age = week - released;
                  return (
                    <animated.div
                      className="card bg-dark record"
                      style={{
                        opacity,
                        transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                      }}
                    >
                      <div className="card-header">
                        <div className="card-title h5">
                          <Link to={`/album/${id}`}>{title}</Link>
                        </div>
                        <div className="record-release">
                          {weeksToYearsAndWeeks(released)} (
                          {`${age} ${age === 1 ? "week" : "weeks"}`})
                        </div>
                      </div>
                      <div className="card-body">
                        <Grid>
                          <Column width={4}>
                            Quality: {quality}
                            <br />
                            Peak Chart Position: {checkNA(peak)}
                          </Column>
                          <Column width={4}>
                            Sales Last Week: {numeral(salesLastWeek).format()}
                            <br />
                            Total Sales: {numeral(sales).format()}
                          </Column>
                        </Grid>
                      </div>
                    </animated.div>
                  );
                }
              )}
          </Trail>
        </div>
      </div>
    );
  };

  render() {
    const { showAlbums } = this.state;
    const { singles, albums } = this.props;

    return (
      <Page id="page-records">
        <div className="columns">
          <div className="column col-4 col-mx-auto">
            <Button as={Link} to="/records/release" primary block large>
              Release New Record
            </Button>
          </div>
        </div>
        <br />
        <div>
          {_.isEmpty(singles) && _.isEmpty(albums) ? (
            <EmptyState
              icon={<FontAwesomeIcon icon="file-audio" size="4x" />}
              title="You haven't released any records yet"
            />
          ) : (
            <div className="record-group">
              {showAlbums ? this.renderAlbums() : this.renderSingles()}{" "}
              <Pagination
                selectComponentClass={Select}
                showSizeChanger
                pageSize={this.state.pageSize}
                current={this.state.current}
                onChange={(current, pageSize) => {
                  this.setState({ current, pageSize });
                }}
                onShowSizeChange={(current, pageSize) => {
                  this.setState({ current, pageSize });
                }}
                total={
                  showAlbums
                    ? this.props.albums.length
                    : this.props.singles.length
                }
                locale={localeInfo}
                pageSizeOptions={["10", "25", "50", "100"]}
              />
            </div>
          )}
        </div>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    songs: state.songs,
    singles: state.singles,
    albums: state.albums,
    week: state.week
  };
}

export default connect(
  mapStateToProps,
  {
    getSongs,
    getSingles,
    getAlbums,
    getWeek
  }
)(Records);

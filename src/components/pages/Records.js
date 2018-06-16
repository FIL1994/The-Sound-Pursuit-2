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
import { Page, EmptyState, Button } from "../SpectreCSS";
import { checkNA, weeksToYearsAndWeeks } from "../../data/util";

import { getSongs, getSingles, getAlbums, getWeek } from "../../actions";

class Records extends Component {
  state = {
    showAlbums: false
  };

  componentDidMount() {
    this.props.getWeek();
    this.props.getSongs();
    this.props.getSingles();
    this.props.getAlbums();
  }

  componentDidUpdate() {
    // fixes bug where window scrolls down
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  renderSinglesOrAlbumsSwitch = () => {
    const { showAlbums } = this.state;
    return (
      <span className="form-group text-right float-right">
        {`Singles `}
        <label className="form-switch">
          <input
            type="checkbox"
            onChange={e => {
              this.setState({ showAlbums: e.target.checked });
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
        <EmptyState
          icon={<FontAwesomeIcon icon="file-audio" size="4x" />}
          title="You haven't released any singles yet"
        />
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
            Total Single Sales: {numeral(totalSingleSales).format()} <br />
            Best Selling Single:{" "}
            <Link to={`/single/${bestSellingSingle.id}`}>
              {bestSellingSingle.title}
            </Link>{" "}
            - {numeral(bestSellingSingle.sales).format()}
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div className="scrollable centered full-width">
          {singles.map(
            ({
              id,
              title,
              quality,
              released,
              salesLastWeek,
              sales,
              charts: { peak }
            }) => {
              const age = week - released;
              return (
                <div className="card bg-dark" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">
                      <Link to={`/single/${id}`}>{title}</Link>
                    </div>
                  </div>
                  <div className="card-body">
                    Released: {weeksToYearsAndWeeks(released)} | Age:{" "}
                    {`${age} ${age === 1 ? "week" : "weeks"}`}
                    <br />
                    Quality: {quality}
                    <br />
                    Sales Last Week: {numeral(salesLastWeek).format()}
                    <br />
                    Total Sales: {numeral(sales).format()}
                    <br />
                    Peak Chart Position: {checkNA(peak)}
                  </div>
                </div>
              );
            }
          )}
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
        <EmptyState
          icon={<FontAwesomeIcon icon="file-audio" size="4x" />}
          title="You haven't released any albums yet"
        />
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
            Total Album Sales: {numeral(totalAlbumSales).format()} <br />
            Best Selling Album:{" "}
            <Link to={`/album/${bestSellingAlbum.id}`}>
              {bestSellingAlbum.title}
            </Link>{" "}
            - {numeral(bestSellingAlbum.sales).format()}
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div className="scrollable centered full-width">
          {albums.map(
            ({
              id,
              title,
              quality,
              released,
              salesLastWeek,
              sales,
              charts: { peak }
            }) => {
              const age = week - released;
              return (
                <div className="card bg-dark" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">
                      <Link to={`/album/${id}`}>{title}</Link>
                    </div>
                  </div>
                  <div className="card-body">
                    Released: {weeksToYearsAndWeeks(released)} | Age:{" "}
                    {`${age} ${age === 1 ? "week" : "weeks"}`}
                    <br />
                    Quality: {quality}
                    <br />
                    Sales Last Week: {numeral(salesLastWeek).format()}
                    <br />
                    Total Sales: {numeral(sales).format()}
                    <br />
                    Peak Chart Position: {checkNA(peak)}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  };

  render() {
    const { showAlbums } = this.state;
    const { singles, albums } = this.props;

    if (!showAlbums && _.isEmpty(singles)) {
      setTimeout(() => this.setState({ showAlbums: true }));
    }

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
            <div>{showAlbums ? this.renderAlbums() : this.renderSingles()}</div>
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

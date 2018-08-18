/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Loading, Page, ControlledTab, Grid, Panel } from "../SpectreCSS";
import _ from "lodash";
import numeral from "numeral";
import {
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTooltip,
  createContainer
} from "victory";
import Lightbox from "react-image-lightbox";
import { checkNA, weeksToYearsAndWeeks, formatNumber } from "../../data/util";

import { getSongs, getSingles } from "../../actions";

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");
const { Column } = Grid;

class Single extends Component {
  state = {
    single: undefined,
    salesHistory: [],
    isLightboxOpen: false
  };

  componentDidMount() {
    this.props.getSongs();
    this.props.getSingles();
  }

  componentDidUpdate() {
    const { songs, singles } = this.props;
    const { single } = this.state;

    if (single === undefined && !_.isEmpty(singles) && !_.isEmpty(songs)) {
      this.findSingle(songs, singles);
    }
  }

  findSingle(songs, singles) {
    const id = parseInt(this.props.match.params.id);

    let single = singles.find(s => s.id === id);

    if (single === undefined) {
      single = null;
    } else {
      single.songs = single.songs.map(si => songs.find(s => s.id === si));
    }

    console.log("single", single);

    const salesHistory = single.salesHistory.map(s => {
      return {
        y: s.sales,
        x: s.week,
        label: s.sales
      };
    });

    this.setState({
      single,
      salesHistory
    });
  }

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
    const { single } = this.state;

    if (single === undefined) {
      return (
        <Page centered>
          <Loading large />
        </Page>
      );
    } else if (single === null) {
      return (
        <Page centered>
          <p>That single could not be found</p>
        </Page>
      );
    }

    const {
      quality,
      released,
      sales,
      salesLastWeek,
      songs,
      title,
      charts: { peak, lastWeek, thisWeek },
      imgURL
    } = single;

    return (
      <Page centered>
        <Panel
          style={{
            padding: "5px 0px"
          }}
        >
          <Grid>
            <Column width={4}>
              <img
                src={imgURL}
                height={160}
                width={160}
                onClick={() => this.setState({ isLightboxOpen: true })}
              />
              {this.state.isLightboxOpen && (
                <Lightbox
                  imageTitle={title}
                  mainSrc={imgURL}
                  onCloseRequest={() =>
                    this.setState({ isLightboxOpen: false })
                  }
                />
              )}
            </Column>
            <Column width={8} style={{ textAlign: "left" }}>
              <h3>{title}</h3>
              <p>
                Released: {weeksToYearsAndWeeks(released)} <br />
                Quality: {quality} <br />
                Sales: {numeral(sales).format()} <br />
                Sales Last Week: {numeral(salesLastWeek).format()}
              </p>
            </Column>
          </Grid>
        </Panel>
        <ControlledTab
          options={[
            {
              label: "Tracklist",
              value: "tracklist",
              render: () => (
                <div className="scrollable-small" style={{ height: 330, overflowX: "hidden" }}>
                  {songs.map(({ id, title }, index) => (
                    <Grid key={id}>
                      <Column width={5} style={{ textAlign: "right" }}>
                        {index + 1}.
                      </Column>
                      <Column width={7} style={{ textAlign: "left" }}>
                        {title}
                      </Column>
                    </Grid>
                  ))}
                </div>
              )
            },
            {
              label: "Chart Details",
              value: "chart-details",
              render: () => (
                <p>
                  Peak: {checkNA(peak)} | Last Week: {checkNA(lastWeek)} | This
                  Week: {checkNA(thisWeek)}
                </p>
              )
            },
            {
              label: "Sales History",
              value: "sales-history",
              render: () => (
                <Fragment>
                  <VictoryChart
                    width={750}
                    height={200}
                    containerComponent={
                      <VictoryZoomVoronoiContainer
                        responsive //={false}
                        zoomDimension="x"
                        zoomDomain={this.state.zoomDomain}
                        onZoomDomainChange={this.handleZoom.bind(this)}
                      />
                    }
                  >
                    <VictoryAxis
                      fixLabelOverlap
                      tickFormat={weeksToYearsAndWeeks}
                    />
                    <VictoryAxis
                      dependentAxis
                      fixLabelOverlap
                      tickFormat={y => formatNumber(y, false, true)}
                    />
                    <VictoryLine
                      labelComponent={
                        <VictoryTooltip
                          cornerRadius={2}
                          text={data => numeral(data.y).format("0,0")}
                        />
                      }
                      style={{
                        data: { stroke: "#2d948a" }
                      }}
                      data={this.state.salesHistory}
                    />
                  </VictoryChart>

                  <VictoryChart
                    padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                    width={650}
                    height={60}
                    containerComponent={
                      <VictoryBrushContainer
                        responsive //={false}
                        brushDimension="x"
                        brushDomain={this.state.selectedDomain}
                        onBrushDomainChange={this.handleBrush.bind(this)}
                      />
                    }
                  >
                    <VictoryAxis tickFormat={weeksToYearsAndWeeks} />
                    <VictoryLine
                      style={{
                        data: { stroke: "#2d948a" }
                      }}
                      data={this.state.salesHistory}
                      labelComponent={<VictoryTooltip />}
                    />
                  </VictoryChart>
                </Fragment>
              )
            }
          ]}
        />
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    songs: state.songs,
    singles: state.singles
  };
}

export default connect(
  mapStateToProps,
  { getSongs, getSingles }
)(Single);

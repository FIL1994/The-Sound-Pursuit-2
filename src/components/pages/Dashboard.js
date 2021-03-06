/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Page, Button, Toast, Divider, Grid } from "../SpectreCSS";
import Avatar from "react-avatar";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";

import {
  getBand,
  saveBand,
  getFans,
  addFans,
  getCash,
  addCash,
  getWeek,
  nextWeek
} from "../../actions";
import {
  unlock100NewFans,
  unlock200NewFans,
  unlockFirstPractice,
  unlockFirstShow,
  unlockSkills25,
  unlockSkills50,
  unlockSkills75
} from "../../ng/UnlockMedals";
import { doPractice } from "../../data/bandMember";
import {
  NumberEase,
  formatDecimal,
  formatMoney,
  formatNumber
} from "../../helpers";

const { Column } = Grid;

window.toast = toast;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.playShow = _.throttle(this.playShow, 18);
    this.practice = _.throttle(this.practice, 18);
  }

  state = {
    newFans: null,
    newCash: null,
    practiceToast: null,
    lastPractice: 0,
    lastShow: 0
  };

  componentDidMount() {
    this.props.getBand();
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  playShow = () => {
    const { leadMember, members: m } = this.props.band;
    const members = [leadMember, ...m];

    let maxSkill = 0,
      sumSkill = 0,
      avgSkill;

    members.forEach(({ skills: { live, musicianship } }) => {
      const skill = live * 3 + musicianship;
      if (skill > maxSkill) {
        maxSkill = skill;
      }
      sumSkill += skill;
    });
    avgSkill = sumSkill / members.length;

    const performance = Math.ceil(
      _.random(avgSkill, maxSkill) * _.random(0.8, 1.2)
    );

    const newFans = Math.ceil(performance * 0.75);
    const newCash = performance * 1.05;
    this.props.addFans(newFans);
    this.props.addCash(newCash);
    this.props.nextWeek();

    const lastShow = Date.now() / 1000;

    // check show medals
    let unlocks = [unlockFirstShow];
    if (newFans > 100) {
      unlocks.push(unlock100NewFans);
      if (newFans > 200) {
        unlocks.push(unlock200NewFans);
      }
    }
    Promise.all(unlocks.map(unlockFunction => new Promise(unlockFunction)));

    this.setState({
      newFans,
      newCash,
      lastShow
    });

    const toastContent = (
      <Fragment>
        New Fans: <NumberEase value={newFans} format={formatNumber} />
        <br />
        Cash: <NumberEase value={newCash} format={formatMoney} />
      </Fragment>
    );

    if (toast.isActive(this.toastShowID)) {
      toast.update(this.toastShowID, { render: toastContent });
    } else {
      this.toastShowID = toast.info(toastContent);
    }
  };

  practice = () => {
    let { leadMember, members } = this.props.band;
    let practiceToast,
      unlocks = [unlockFirstPractice];

    // Increase members' and lead member's skills
    members = members.map(m => {
      let {
        skills: { live, musicianship, songwriting, studio },
        baseSkills: {
          live: bLive,
          musicianship: bMusicianship,
          songwriting: bSongwriting,
          studio: bStudio
        }
      } = m;

      live = doPractice(live, bLive);
      musicianship = doPractice(musicianship, bMusicianship);
      songwriting = doPractice(songwriting, bSongwriting);
      studio = doPractice(studio, bStudio);

      return { ...m, skills: { live, musicianship, songwriting, studio } };
    });
    leadMember.skills.live = doPractice(
      leadMember.skills.live,
      leadMember.baseSkills.live
    );
    leadMember.skills.musicianship = doPractice(
      leadMember.skills.musicianship,
      leadMember.baseSkills.musicianship
    );
    leadMember.skills.songwriting = doPractice(
      leadMember.skills.songwriting,
      leadMember.baseSkills.musicianship
    );
    leadMember.skills.studio = doPractice(
      leadMember.skills.studio,
      leadMember.baseSkills.musicianship
    );

    // check skill medals
    let liveSkills = [],
      musicianshipSkills = [],
      songwritingSkills = [],
      studioSkills = [];
    [leadMember, ...members].forEach(
      ({ skills: { live, musicianship, songwriting, studio } }) => {
        liveSkills.push(live);
        musicianshipSkills.push(musicianship);
        songwritingSkills.push(songwriting);
        studioSkills.push(studio);
      }
    );

    if (
      Math.min(...liveSkills) >= 25 &&
      Math.min(...musicianshipSkills) >= 25 &&
      Math.min(...songwritingSkills) >= 25 &&
      Math.min(...studioSkills) >= 25
    ) {
      unlocks.push(unlockSkills25);
      if (
        Math.min(...liveSkills) >= 50 &&
        Math.min(...musicianshipSkills) >= 50 &&
        Math.min(...songwritingSkills) >= 50 &&
        Math.min(...studioSkills) >= 50
      ) {
        unlocks.push(unlockSkills50);
        if (
          Math.min(...liveSkills) >= 75 &&
          Math.min(...musicianshipSkills) >= 75 &&
          Math.min(...songwritingSkills) >= 75 &&
          Math.min(...studioSkills) >= 75
        ) {
          unlocks.push(unlockSkills75);
        }
      }
    }

    practiceToast = <span>Practiced!</span>;
    if (toast.isActive(this.toastPracticeID)) {
      toast.update(this.toastPracticeID);
    } else {
      this.toastPracticeID = toast.info("Practiced!");
    }

    this.props.saveBand({ ...this.props.band, leadMember, members });
    this.props.nextWeek();

    const lastPractice = Date.now() / 1000;

    // unlock medals
    Promise.all(unlocks.map(unlockFunction => new Promise(unlockFunction)));

    this.setState({
      practiceToast,
      lastPractice
    });
  };

  renderMembers = () => {
    const { leadMember, members } = this.props.band;

    return (
      <div className="container">
        <div className="columns">
          {[leadMember, ...members].map((m, index) => {
            return (
              <div key={index} className="tile column col-6 member-card">
                <div className="tile-icon">
                  <Avatar
                    className="avatar"
                    round
                    name={m.name}
                    maxInitials={2}
                    size={50}
                  />
                </div>
                <div className="tile-content" style={{ textAlign: "left" }}>
                  <strong
                    className="tile-title"
                    style={{ marginLeft: 15, fontSize: "0.82rem" }}
                  >
                    {m.name} -{" "}
                    <span className="text-capitalize">{m.instrument}</span>
                  </strong>
                  <div
                    className="tile-subtitle"
                    style={{ marginLeft: 20, marginTop: 5 }}
                  >
                    <Grid>
                      <Column width={6}>Live:</Column>
                      <Column width={4}>{formatDecimal(m.skills.live)}</Column>

                      <Column width={6}>Musicianship:</Column>
                      <Column width={4}>
                        {formatDecimal(m.skills.musicianship)}
                      </Column>

                      <Column width={6}>Songwriting:</Column>
                      <Column width={4}>
                        {formatDecimal(m.skills.songwriting)}
                      </Column>

                      <Column width={6}>Studio:</Column>
                      <Column width={4}>
                        {formatDecimal(m.skills.studio)}
                      </Column>
                    </Grid>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const { band } = this.props;
    const { newFans, newCash, practiceToast } = this.state;

    return (
      <Page className="text-center">
        {_.isEmpty(band) ? null : (
          <Fragment>
            <h3>{band.name}</h3>
            <Divider size={9} />
            <div className="centered text-center">
              <Button size={4} large onClick={this.playShow}>
                Play Show
              </Button>
              <Button size={4} large onClick={this.practice}>
                Practice
              </Button>
            </div>
            <br />
            {this.renderMembers()}
          </Fragment>
        )}
        <ToastContainer autoClose={2000} position="bottom-center" />
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    band: state.band,
    songs: state.songs,
    week: state.week,
    cash: state.cash,
    fans: state.fans
  };
}

export default connect(
  mapStateToProps,
  {
    getBand,
    saveBand,
    getFans,
    getCash,
    getWeek,
    addFans,
    addCash,
    nextWeek
  }
)(Dashboard);

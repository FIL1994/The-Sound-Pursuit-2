/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Page, Button, Toast, Divider } from "../SpectreCSS";
import Avatar from "react-avatar";

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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.playShow = _.throttle(this.playShow, 18);
    this.practice = _.throttle(this.practice, 18);
  }

  state = {
    showShow: false,
    newFans: null,
    newCash: null,
    showPractice: false,
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
      showShow: true,
      newFans,
      newCash,
      lastShow
    });

    setTimeout(() => {
      const now = Date.now() / 1000;
      if (now > this.state.lastShow + 2.9) {
        this.setState({
          showShow: false,
          newFans: null,
          newCash: null,
          lastShow: Date.now() / 1000
        });
      }
    }, 3000);
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

    this.props.saveBand({ ...this.props.band, leadMember, members });
    this.props.nextWeek();

    const lastPractice = Date.now() / 1000;

    // unlock medals
    Promise.all(unlocks.map(unlockFunction => new Promise(unlockFunction)));

    this.setState({
      showPractice: true,
      practiceToast,
      lastPractice
    });

    // in 3 seconds (from the last practice) hide practice toast
    setTimeout(() => {
      const now = Date.now() / 1000;
      if (now > this.state.lastPractice + 2.9) {
        this.setState({
          showPractice: false,
          practiceToast: null,
          lastPractice: Date.now() / 1000
        });
      }
    }, 3000);
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
                <div className="tile-content">
                  <strong className="tile-title">
                    {m.name} -{" "}
                    <span className="text-capitalize">{m.instrument}</span>
                  </strong>
                  <p className="tile-subtitle">
                    Live: {m.skills.live} | Musicianship:{" "}
                    {m.skills.musicianship} | Songwriting:{" "}
                    {m.skills.songwriting} | Studio: {m.skills.studio}
                  </p>
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
    const {
      showShow,
      showPractice,
      newFans,
      newCash,
      practiceToast
    } = this.state;

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
              <div className="centered col-3">
                {!showShow ? null : (
                  <Toast centered>
                    <span>
                      New Fans: {newFans.toLocaleString()}
                      <br />Cash: ${newCash.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </Toast>
                )}
                {!showPractice ? null : <Toast centered>{practiceToast}</Toast>}
              </div>
            </div>
            <br />
            {this.renderMembers()}
          </Fragment>
        )}
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

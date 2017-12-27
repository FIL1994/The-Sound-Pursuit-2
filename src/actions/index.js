/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from 'lodash';
import {
  SAVE_BAND, GET_BAND, ERROR_BAND, GET_SONGS, ERROR_SONG, SAVE_SONGS,
  SAVE_CASH, GET_CASH, ERROR_CASH, SAVE_WEEK, GET_WEEK, ERROR_WEEK, GET_FANS, SAVE_FANS, ERROR_FANS, GET_SINGLES,
  ERROR_SINGLES, ERROR_ALBUMS, GET_ALBUMS, SAVE_SINGLES, SAVE_ALBUMS, GET_SCORE, SET_SCORE, GET_IMAGE, GET_TOUR_RESULTS,
  ERROR_CHARTS, GET_CHARTS, SAVE_CHARTS, ERROR_IMAGE
} from './types';
import localForage, {DATA_BAND, DATA_SONGS, DATA_CASH, DATA_WEEK, DATA_FANS, DATA_ALBUMS, DATA_SINGLES, DATA_CHARTS}
  from '../data/localForage';
import {
  unlock100kFans, unlock100kSoldSingles, unlock10kFans, unlock10kSoldSingles, unlock10Years, unlock1kFans, unlock1mFans,
  unlock1mSoldSingles, unlock25Years, unlock5Years, unlock10kSoldAlbums, unlock100kSoldAlbums, unlock1mSoldAlbums,
  unlock100kTotalSoldSingles, unlock1mTotalSoldSingles, unlock10mTotalSoldSingles, unlock100kTotalSoldAlbums,
  unlock1mTotalSoldAlbums, unlock10mTotalSoldAlbums
} from '../ng/UnlockMedals';
import {postScore} from '../ng/NG_Connect';
import {fiveYearScoreboardID, tenYearScoreboardID, bestSellingAlbumsScoreboardID, bestSellingSinglesScoreboardID,
  totalAlbumSalesScoreboardID, totalSingleSalesScoreboardID} from '../config/keys';
import getRandomBandName from '../data/randomBandName';
import getRandomSongName from '../data/randomSongName';
import getRandomName from '../data/names';
import {ImageURL} from '../data/util';

const DEFAULT_CASH = 250;
const SINGLE_SALES_LAST = 16; //weeks singles sell for
const ALBUM_SALES_LAST = 41; // weeks albums sell for

function sendReturn({type, payload, error}) {
  return {
    type,
    payload,
    error
  };
}

// region Band
export function saveBand(band) {
  return dispatch => {
    return localForage.setItem(DATA_BAND, band).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_BAND, error}));
        } else {
          dispatch(sendReturn({type: SAVE_BAND, payload: val}));
        }
      }
    );
  };
}

export function getBand() {
  return dispatch => {
    return localForage.getItem(DATA_BAND).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_BAND, error}));
        } else {
          dispatch(sendReturn({type: GET_BAND, payload: val}));
          return val;
        }
      }
    );
  };
}
// endregion

// region Songs
export function getSongs() {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          dispatch(sendReturn({type: GET_SONGS, payload: val}));
          return val;
        }
      }
    );
  };
}

export function saveSongs(songs) {
  return dispatch => {
    return localForage.setItem(DATA_SONGS, songs).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          dispatch(sendReturn({type: SAVE_SONGS, payload: val}));
        }
      }
    );
  };
}

export function writeSong(song) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          // if songs is empty make songs an array and set the id of the song to 0
          if(_.isEmpty(songs)) {
            songs = [];
            song.id = 0;
          } else {
            // if songs exist then find the maxID to keep IDs unique
            let maxID = 0;
            try {
              maxID = _.maxBy(songs, (s) => {
                return s.id;
              }).id;
            } catch(e) {
              songs.forEach((s, index) => {
                s.id = index;
              });
              maxID = songs.length - 1;
            }

            song.id = maxID + 1;
            // set single and album to null since the song has not been released yet
            song.single = null;
            song.album = null;
          }
          songs.push(song);

          dispatch(saveSongs(songs));
        }
      }
    )
  }
}

export function deleteSong(id) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        }
        else {
          _.remove(songs, (s) => {
            return s.id === id;
          });
          dispatch(saveSongs(songs));
        }
      }
    )
  }
}

export function updateSong(song) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        }
        else {
          songs.forEach((s, index) => {
            if(s.id === song.id) {
              songs[index] = song;
            }
          });
          dispatch(saveSongs(songs));
        }
      }
    )
  }
}
// endregion

// region Week
export function getWeek() {
  return dispatch => {
    return localForage.getItem(DATA_WEEK).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          dispatch(sendReturn({type: GET_WEEK, payload: val}));
          return val;
        }
      }
    );
  };
}

export function saveWeek(week) {
  return dispatch => {
    return localForage.setItem(DATA_WEEK, week).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_WEEK, payload: val}));
        }
      }
    );
  };
}

export function nextWeek(weeks, tourDetails = {}) {
  return dispatch => {
    return localForage.getItem(DATA_WEEK).then(
      (week, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        } else {
          let years5 = false, years10 = false, tourResults = {newFans: 0, newCash: 0};
          const onTour = !_.isEmpty(tourDetails);
          // current week
          week = _.defaultTo(Number(week), 0);
          // weeks to go forward
          weeks = _.isFinite(weeks) ? weeks : 1;

          Promise.all([
            dispatch(getAlbums()),
            dispatch(getSingles()),
            dispatch(getFans()),
            dispatch(getBand()),
            dispatch(getCharts())
          ]).then((values) => {
            let [albums, singles, fans, band, charts] = values;

            // if no albums or singles are released there is no need to calculate sales
            // if(_.isEmpty(albums) && _.isEmpty(singles)) {
            //   week += weeks;
            //   localForage.setItem(DATA_WEEK, week);
            //   dispatch(sendReturn({type: GET_WEEK, payload: week}));
            //   return;
            // }

            // albums or singles have been released. for every week calculate sales
            for (let i = 0; i < weeks; i++) {
              week++;
              let tourFans = 0, tourCash = 0;
              if(onTour) {
                const {newCashFromTour, newFansFromTour} = calcTourResults({fans, band, tourDetails});
                tourFans = newFansFromTour;
                tourCash = newCashFromTour;

                tourResults.newFans += tourFans;
                tourResults.newCash += tourCash;
              }
              const newData = calculateSales({albums, singles, week: week, fans, charts, dispatch});
              albums = newData.albums;
              singles = newData.singles;
              fans = newData.fans + tourFans;

              if(parseInt(week) === parseInt(52 * 5)) {
                years5 = true;
                setTimeout( () => dispatch(calculateScore( {years: 5, albums, singles, fans} )) );
              } else if(parseInt(week) === parseInt(52 * 10)) {
                years10 = true;
                setTimeout( () => dispatch(calculateScore( {years: 10, albums, singles, fans} )) );
              }
            }

            if(onTour) {
              dispatch(saveTourResults(tourResults));
              dispatch(addCash(tourResults.newCash));
            }

            // check years medals
            let unlocks = [];
            if(week >= 52 * 5) {
              unlocks.push(unlock5Years);
              if(week >= 52 * 10) {
                unlocks.push(unlock10Years);
                if(week >= 52 * 25) {
                  unlocks.push(unlock25Years);
                }
              }
            }
            // unlock medals
            Promise.all( unlocks.map( (unlockFunction) => new Promise(unlockFunction) ) );
            localForage.setItem(DATA_WEEK, week).then(
              () => dispatch(sendReturn({type: GET_WEEK, payload: week, years5, years10}))
            );

          });
        }
      }
    );
  };

  function calculateSales({albums, singles, week, fans, charts, dispatch}) {
    let newCash = 0, totalSingleSales = 0, totalAlbumSales = 0;
    let unlocks = []; // unlocks medals for NG

    // remove user singles and albums
    _.remove(charts.singles, s => s.band === "USER");
    _.remove(charts.albums, s => s.band === "USER");
    charts = calcChartSales(charts, week, dispatch);

    singles.forEach(({released, quality, salesLastWeek}, index) => {
      const age = week - released;
      if(age < SINGLE_SALES_LAST) {
        let sales = Math.ceil(
          ((fans * (quality / 125)) *
          (((SINGLE_SALES_LAST - age)/(SINGLE_SALES_LAST - 1))) + 1) *
          _.random(0.158, 0.191)
        );

        // save sales
        singles[index].salesLastWeek = sales;
        singles[index].sales += sales;
        charts.singles.push(singles[index]);

        // calculate cash
        newCash += sales * .12; // $0.12 for each single sold

        // calculate new fans
        let multiplier = 0.005;
        if(fans < Math.pow(10, 5)) {
          // less than 100 thousand
          multiplier = .45;
        } else if(fans < Math.pow(10, 6)) {
          // less than 1 million
          multiplier = .25;
        } else if(fans < Math.pow(10, 7)) {
          multiplier = .03;
        }
        fans += _.ceil(sales * multiplier);

        // check single sales medals
        const singleSales = singles[index].sales;
        if(singleSales > 10000) {
          unlocks.push(unlock10kSoldSingles);
          if(singleSales > 100000) {
            unlocks.push(unlock100kSoldSingles);
            if(singleSales > 1000000) {
              unlocks.push(unlock1mSoldSingles);
            }
          }
        }

        setTimeout(
          () => postScore(singleSales, bestSellingSinglesScoreboardID)
        );
      } else if(salesLastWeek !== 0) {
        singles[index].salesLastWeek = 0;
        singles[index].charts.lastWeek = -1;
        singles[index].charts.thisWeek = -1;

        setTimeout(
          () => postScore(singles[index].sales, bestSellingSinglesScoreboardID)
        );
      }
      totalSingleSales += singles[index].sales;
    });

    // check total single sales medals
    if(totalSingleSales > 100000) {
      unlocks.push(unlock100kTotalSoldSingles);
      if(totalSingleSales > 1000000) {
        unlocks.push(unlock1mTotalSoldSingles);
        if(totalSingleSales > 10000000){
          unlocks.push(unlock10mTotalSoldSingles);
        }
      }
    }

    setTimeout(
      () => postScore(totalSingleSales, totalSingleSalesScoreboardID)
    );

    albums.forEach(({released, quality, salesLastWeek}, index) => {
      const age = week - released;
      if(age < ALBUM_SALES_LAST) {
        let sales = Math.ceil(
          ((fans * (quality / 180)) *
            (((ALBUM_SALES_LAST - age)/(ALBUM_SALES_LAST - 1))) + 1) *
          _.random(.135, .193)
        );

        // save sales
        albums[index].salesLastWeek = sales;
        albums[index].sales += sales;
        charts.albums.push(albums[index]);

        // calculate cash
        newCash += sales * 0.85; // $0.85 for each album sold

        const albumSales = albums[index].sales;
        if(albumSales > 10000) {
          unlocks.push(unlock10kSoldAlbums);
          if(albumSales > 100000) {
            unlocks.push(unlock100kSoldAlbums);
            if(albumSales > 1000000) {
              unlocks.push(unlock1mSoldAlbums);
            }
          }
        }

        setTimeout(
          () => postScore(albumSales, bestSellingAlbumsScoreboardID)
        );
      } else if(salesLastWeek !== 0) {
        albums[index].salesLastWeek = 0;
        albums[index].charts.lastWeek = -1;
        albums[index].charts.thisWeek = -1;

        setTimeout(
          () => postScore(albums[index].sales, bestSellingAlbumsScoreboardID)
        );
      }
      totalAlbumSales += albums[index].sales;
    });

    // check total album sales medals
    if(totalAlbumSales > 100000) {
      unlocks.push(unlock100kTotalSoldAlbums);
      if(totalAlbumSales > 1000000) {
        unlocks.push(unlock1mTotalSoldAlbums);
        if(totalAlbumSales > 10000000){
          unlocks.push(unlock10mTotalSoldAlbums);
        }
      }
    }
    // unlock medals
    Promise.all( unlocks.map( (unlockFunction) => new Promise(unlockFunction) ) );

    setTimeout(
      () => postScore(totalAlbumSales, totalAlbumSalesScoreboardID)
    );

    // HANDLE CHARTS
    charts = sortCharts(charts);

    // set chart positions
    charts.singles = charts.singles.map(setChartPositions);
    charts.albums = charts.albums.map(setChartPositions);
    function setChartPositions(s, index) {
      // if not in top 40 don't make any changes
      if(index > 39) {
        return s;
      }
      const {peak} = s.charts;
      const position = index + 1;
      s.charts.lastWeek = s.charts.thisWeek;
      s.charts.thisWeek = position;
      if(peak > position || peak === -1) {
        s.charts.peak = position;
      }
      if(!_.isFinite(s.charts.firstCharted)) {
        s.charts.firstCharted = week;
      }
      return s;
    }

    dispatch(saveCharts(charts));

    if(!_.isEmpty(singles)) {
      const userSingles = charts.singles.filter(s => s.band === "USER");

      userSingles.map(us => {
        const index = singles.findIndex(s => s.id === us.id);
        singles.splice(index, 1, us);
      });

      dispatch(saveSingles(singles));
    }
    if(!_.isEmpty(albums)) {
      const userAlbums = charts.albums.filter(s => s.band === "USER");

      userAlbums.map(ua => {
        const index = albums.findIndex(a => a.id === ua.id);
        albums.splice(index, 1, ua);
      });

      dispatch(saveAlbums(albums));
    }
    dispatch(saveFans(fans));
    dispatch(addCash(newCash));

    dispatch(sendReturn({type: GET_WEEK, payload: week}));

    return {
      albums, singles, fans
    };
  }

  function calcTourResults({fans, band, tourDetails, /*tourResults*/}) {
    const {continents, venueSize} = tourDetails;

    const {leadMember, members: m} = band;
    const members = [leadMember, ...m];

    let maxSkill = 0, sumSkill = 0, avgSkill;

    members.forEach(({skills: {live, musicianship}}) => {
      const skill = (live * 3) + musicianship;
      if(skill > maxSkill) {
        maxSkill = skill;
      }
      sumSkill += skill;
    });
    avgSkill = sumSkill / members.length;

    const performance = Math.ceil(_.random(avgSkill, maxSkill) * _.random(0.8, 1.2));

    // get more fans if touring more continents
    const newFansFromTour = _.ceil((performance * 0.78) * (1 + continents.length / 10)) * (1 + (venueSize / 5));
    const newCashFromTour = performance * (1 + (venueSize / 9)) * _.max([(1 + (fans / 1000000)), 3]);

    return {newCashFromTour, newFansFromTour};
  }
}
// endregion

// region Tour
export function goOnTour({weeksToTour, continents, venueSize}) {
  return dispatch => {
    dispatch(nextWeek(weeksToTour, {continents, venueSize}));
  };
}

function saveTourResults(tourResults) {
  return dispatch => {
    dispatch(sendReturn({type: GET_TOUR_RESULTS, payload: tourResults}))
  };
}
// endregion

// region Fans
export function getFans() {
  return dispatch => {
    return localForage.getItem(DATA_FANS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          dispatch(sendReturn({type: GET_FANS, payload: val}));
          return val;
        }
      }
    );
  };
}

export function saveFans(fans) {
  return dispatch => {
    return localForage.setItem(DATA_FANS, fans).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_FANS, payload: val}));
        }
      }
    );
  };
}

export function addFans(newFans) {
  return dispatch => {
    return localForage.getItem(DATA_FANS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          newFans = _.ceil(val + _.defaultTo(Number(newFans), 1));

          let unlocks = [];
          if(newFans > 1000) {
            unlocks.push(unlock1kFans);
            if(newFans > 10000) {
              unlocks.push(unlock10kFans);
              if(newFans > 100000) {
                unlocks.push(unlock100kFans);
                if(newFans > 1000000) {
                  unlocks.push(unlock1mFans);
                }
              }
            }
          }
          // unlock medals
          Promise.all( unlocks.map( (unlockFunction) => new Promise(unlockFunction) ) );

          dispatch(saveFans(newFans));
        }
      }
    );
  }
}
// endregion

// region Cash
export function getCash() {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          let originalVal = _.clone(val);
          // if val is NaN set val to default cash
          val = !_.isNaN(val) ? val : DEFAULT_CASH;
          // if val (as a string) is not more than 0 character set val to default cash
          val = _.toString(val).length > 0 ? val : DEFAULT_CASH;
          // if val is not a finite number set val to default cash
          val = _.isFinite(val) ? val : DEFAULT_CASH;

          if(originalVal !== val) {
            localForage.setItem(DATA_CASH, val);
          }

          dispatch(sendReturn({type: GET_CASH, payload: val}));
          return val;
        }
      }
    );
  };
}

export function saveCash(cash) {
  return dispatch => {
    cash = Number(cash.toFixed(2));

    cash = _.isFinite(cash) ? cash : DEFAULT_CASH;

    return localForage.setItem(DATA_CASH, cash).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_CASH, payload: val}));
        }
      }
    );
  };
}

export function addCash(amount) {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (cash, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          // if val is NaN set val to default cash
          cash = !_.isNaN(cash) ? cash : DEFAULT_CASH;
          // if val (as a string) is not more than 0 character set val to default cash
          cash = _.toString(cash).length > 0 ? cash : DEFAULT_CASH;
          // if val is not a finite number set val to default cash
          cash = _.isFinite(cash) ? cash : DEFAULT_CASH;

          amount = Number(amount);
          cash = Number((cash + amount).toFixed(2));

          dispatch(saveCash(cash));
        }
      }
    );
  };
}

export function removeCash(amount) {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (cash, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          // if val is NaN set val to default cash
          cash = !_.isNaN(cash) ? cash : DEFAULT_CASH;
          // if val (as a string) is not more than 0 character set val to default cash
          cash = _.toString(cash).length > 0 ? cash : DEFAULT_CASH;
          // if val is not a finite number set val to default cash
          cash = _.isFinite(cash) ? cash : DEFAULT_CASH;

          amount = Number(amount);
          cash = Number((cash - amount).toFixed(2));

          dispatch(saveCash(cash));
        }
      }
    );
  };
}
// endregion

// region Charts
export function getCharts() {
  return dispatch => {
    return localForage.getItem(DATA_CHARTS).then(
      (charts, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CHARTS, error}));
        } else {
          if (_.isEmpty(charts)) {
            return localForage.getItem(DATA_WEEK).then(
              (week) => {
                return createCharts(week, dispatch).then(charts => {
                  charts = sortCharts(charts);
                  dispatch(saveCharts(charts));
                  return charts;
                });
              }
            );
          } else {
            charts = sortCharts(charts);
            dispatch(sendReturn({type: GET_CHARTS, payload: charts}));
            return charts;
          }
        }
      }
    );
  }
}

export function saveCharts(charts) {
  return dispatch => {
    if(_.isEmpty(charts)) {
      dispatch(sendReturn({type: ERROR_CHARTS, error: new Error("SAVE CHARTS - charts was empty")}))
    } else {
      localForage.setItem(DATA_CHARTS, charts).then(() => {
        dispatch(sendReturn({type: SAVE_CHARTS, payload: charts}));
      });
    }
  }
}

function sortCharts(charts) {
  charts.singles = _.sortBy(charts.singles, s => -s.salesLastWeek);
  charts.albums = _.sortBy(charts.albums, a => -a.salesLastWeek);
  return charts;
}

function newSingle(index, week, imgURL) {
  return {
    id: `${index}-single-cpu`,
    band: _.random(0, 10) % 2 === 0 ? getRandomBandName() : getRandomName(),
    title: getRandomSongName(),
    quality: _.random(50, 180),
    released: week,
    sales: 0,
    salesLastWeek: 0,
    songs: [],
    imgURL,
    charts: {
      peak: -1,
      firstCharted: "N/A",
      lastWeek: -1,
      thisWeek: -1
    }
  };
}

function newAlbum(index, week, imgURL) {
  return {
    id: `${index}-album-cpu`,
    band: _.random(0, 10) % 2 === 0 ? getRandomBandName() : getRandomName(),
    title: getRandomSongName(),
    quality: _.random(50, 180),
    released: week,
    sales: 0,
    salesLastWeek: 0,
    songs: [],
    imgURL,
    charts: {
      peak: -1,
      firstCharted: "N/A",
      lastWeek: -1,
      thisWeek: -1
    }
  };
}

function calcChartSales(charts, week, dispatch) {
  let singleIndexesAdded = [], albumIndexesAdded = [];
  for(let i = 0; i < charts.singles.length; i++) {
    let s = charts.singles[i];
    const age = week - s.released;
    // if single is no longer selling swap it with a new single
    if(age >= SINGLE_SALES_LAST) {
      let index = _.max([
        ...singleIndexesAdded,
        ...charts.singles.map(c => {
            return Number(_.toString(c.id).split('-')[0]);
          }
        )]) + 1;
      singleIndexesAdded.push(index);
      s = newSingle(index, week, ImageURL.getURL());
    }
    const {quality} = s;

    const sales = Math.ceil(
      (((SINGLE_SALES_LAST - age)/(SINGLE_SALES_LAST-1)) + 1) * quality * 100000 * _.random(0.0058, 0.0065)
    );
    s.salesLastWeek = sales;
    s.sales += sales;
    charts.singles[i] = s;
  }

  for(let i = 0; i < charts.albums.length; i++) {
    let a = charts.albums[i];
    const age = week - a.released;
    // if album is no longer selling swap it with a new album
    if(age >= ALBUM_SALES_LAST) {
      let index = _.max([
        ...albumIndexesAdded,
        ...charts.albums.map(c => {
            let i = Number(_.toString(c.id).split('-')[0]);
            return i;
          }
        )]) + 1;
      albumIndexesAdded.push(index);
      a = newAlbum(index, week, ImageURL.getURL());
    }
    const {quality} = a;

    const sales = Math.ceil(
      (((ALBUM_SALES_LAST - age)/(ALBUM_SALES_LAST-1)) + 1) * quality * 98000 * _.random(0.004, 0.005)
    );
    a.salesLastWeek = sales;
    a.sales += sales;
    charts.albums[i] = a;
  }

  return charts;
}

async function createCharts(week, dispatch) {
  let charts = {singles: [], albums: []};

  charts.singles = new Array(100);
  for(let i = 0; i < charts.singles.length; i++) {
    charts.singles[i] = newSingle(i, week - _.random(1, 10),
      await getAsyncImage(dispatch));
  }

  charts.albums = new Array(100);
  for(let i = 0; i < charts.albums.length; i++) {
    charts.albums[i] = newAlbum(i, week - _.random(1, 20),
      await getAsyncImage(dispatch));
  }

  charts = calcChartSales(charts, week);

  return charts;
}
// endregion

// region Singles
export function getSingles() {
  return dispatch => {
    return localForage.getItem(DATA_SINGLES).then(
      (singles, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        } else {
          if(_.isEmpty(singles)) {
            singles = [];
          }
          dispatch(sendReturn({type: GET_SINGLES, payload: singles}));
          return singles;
        }
      }
    );
  };
}

export function saveSingles(singles) {
  return dispatch => {
    return localForage.setItem(DATA_SINGLES, singles).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_SINGLES, payload: val}));
        }
      }
    );
  };
}

export function addSingle(single) {
  return dispatch => {
    return localForage.getItem(DATA_SINGLES).then(
      (singles, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        }
        else {
          if (_.isEmpty(singles)) {
            singles = [];
            single.id = 0;
          } else {
            let maxID = 0;
            try {
              maxID = _.maxBy(singles, (s) => {
                return s.id;
              }).id;
            } catch (e) {
              singles.forEach((s, index) => {
                s.id = index;
              });
              maxID = singles.length - 1;
            }
            single.id = maxID + 1;
          }
          singles.push(single);
          dispatch(saveSingles(singles));
        }
      }
    );
  }
}
// endregion

// region Albums
export function getAlbums() {
  return dispatch => {
    return localForage.getItem(DATA_ALBUMS).then(
      (albums, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        } else {
          if(_.isEmpty(albums)) {
            albums = [];
          }
          dispatch(sendReturn({type: GET_ALBUMS, payload: albums}));
          return albums;
        }
      }
    );
  };
}

export function saveAlbums(albums) {
  return dispatch => {
    return localForage.setItem(DATA_ALBUMS, albums).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_ALBUMS, payload: albums}));
        }
      }
    );
  };
}

export function addAlbum(album) {
  return dispatch => {
    return localForage.getItem(DATA_ALBUMS).then(
      (albums, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        } else {
          if(_.isEmpty(albums)) {
           albums = [];
           album.id = 0;
          } else {
            let maxID = 0;
            try {
              maxID = _.maxBy(albums, (a) => {
                return a.id;
              }).id;
            } catch(e) {
              albums.forEach((a, index) => {
                a.id = index;
              });
              maxID = albums.length -1;
            }
            album.id = maxID + 1;
          }
          albums.push(album);
          dispatch(saveAlbums(albums));
        }
      }
    );
  }
}
// endregion

// region Score
function calculateScore({years, albums, singles, fans}) {
  let albumSales = 0, singleSales = 0, bestSellingAlbum = 0, bestSellingSingle = 0;

  // total single sales
  singles.forEach(({sales}) => {
    singleSales += sales;
    if(sales > bestSellingSingle) {
      bestSellingSingle = sales;
    }
  });

  // total albums sales
  albums.forEach(({sales}) => {
    albumSales += sales;
    if(sales > bestSellingAlbum) {
      bestSellingAlbum = sales;
    }
  });

  let score = singleSales + albumSales;
  score += bestSellingSingle * 4; // best selling single added 5 times
  score += bestSellingAlbum * 9; // best selling album added 10 times
  score += fans * 5;

  const scoreboardID = (years === 5) ? fiveYearScoreboardID : tenYearScoreboardID;
  setTimeout(
    () => postScore(score, scoreboardID)
  );

  return {
    type: SET_SCORE,
    payload: {years, score}
  }
}

export function getScore() {
  return {
    type: GET_SCORE
  };
}

// endregion

// region Image
function fetchRandomImage() {
  return fetch("https://picsum.photos/200/?random");
}

export function getRandomImage() {
  return dispatch => fetchRandomImage().then(
    ({url}) => { dispatch(sendReturn({type: GET_IMAGE, payload: url})); return url; },
    error => {
      console.log(error);
      dispatch(sendReturn({type: ERROR_IMAGE, error}));
      return ImageURL.getURL();
    }
  );
}

async function getAsyncImage(dispatch) {
  let imgURL = ImageURL.getURL();
  return !_.isError(imgURL) ? imgURL : await dispatch(getRandomImage());
}
// endregion
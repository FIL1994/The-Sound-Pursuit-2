/**
 * @author Philip Van Raalte
 * @date 2017-10-09.
 */
import getRandomName from './names';
import _ from 'lodash';
import {Chance} from 'chance';
const CHANCE = new Chance(new Date().getTime());

export function doPractice(val, base) {
  let practiceIncrease = ((base + _.random(5.1, 5.5)) / 20) * (1 + ((90 - val) / 100));
  return Number(_.min([val + practiceIncrease, 100]).toFixed(2));
}

export default (level) => {
  let baseSkills = {
    songwriting: 0,
    musicianship: 0,
    live: 0,
    studio: 0
  };

  for(let i = 0; i < 10; i++) {
    switch(
      CHANCE.weighted(
        ['songwriting', 'musicianship', 'live', 'studio'],
        // lower skills have a higher chance of being incremented, this increases likelihood of a balanced member
        [10 - baseSkills.songwriting, 10 - baseSkills.musicianship, 10 - baseSkills.live, 10 - baseSkills.studio])
      ) {
      case 'songwriting':
        baseSkills.songwriting++;
        continue;
      case 'musicianship':
        baseSkills.musicianship++;
        continue;
      case 'live':
        baseSkills.live++;
        continue;
      case 'studio':
        baseSkills.studio++;
        continue;
      default:
        throw new Error("Invalid skill chosen in bandMember.js");
    }
  }

  let skills = {...baseSkills};

  if(level > 3) {
    const timesToPractice = Math.pow(level, 3);
    for(let i = 0; i < timesToPractice; i++) {
      skills.songwriting = doPractice(skills.songwriting, baseSkills.songwriting);
      skills.musicianship = doPractice(skills.songwriting, baseSkills.musicianship);
      skills.live = doPractice(skills.songwriting, baseSkills.live);
      skills.studio = doPractice(skills.songwriting, baseSkills.studio);
    }
  }

  return {
    name: getRandomName(),
    skills,
    baseSkills
  };
};
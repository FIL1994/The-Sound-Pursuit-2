/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import _ from 'lodash';

export function weeksToYearsAndWeeks(weeks) {
  if(!_.isFinite(weeks)) {
    return "N/A";
  }
  const year = Math.floor(weeks / 52);
  const leftoverWeeks = weeks % 52;
  return `Y${year} W${leftoverWeeks}`;
}

// check if not available
export function checkNA(num) {
  return num === -1 ? "N/A" : num;
}

export class ImageURL {
  static urls = [];
  static getURL() {
    if(this.urls.length < 1) {
      return new Error("urls is empty");
    }
    return this.urls[_.random(0, this.urls.length-1)];
  }
  static putURL(url) {
    this.urls.push(url);
    this.urls = _.uniq(this.urls);
  }
}

// split so some will finish
getImagesForImageURL(3);
getImagesForImageURL(5);
getImagesForImageURL(50);
getImagesForImageURL(70);

function getImagesForImageURL(num) {
  Promise.all(Array.from(new Array(num), () =>
    getImage()
  )).then(values => {
    values = values.filter(v => v !== '');
    ImageURL.urls.push(...values);
  });
}

async function getImage() {
  try {
    return (await fetch("https://picsum.photos/200/?random")).url;
  } catch(e) {
    return '';
  }
}
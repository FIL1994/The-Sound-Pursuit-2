/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */

export function weeksToYearsAndWeeks(weeks) {
  const year = Math.floor(weeks / 52);
  const leftoverWeeks = weeks % 52;
  return `Y${year} W${leftoverWeeks}`;
}

// check if not available
export function checkNA(num) {
  return num === -1 ? "N/A" : num;
}
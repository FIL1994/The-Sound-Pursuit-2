/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import {GET_TOUR_RESULTS} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_TOUR_RESULTS:
      return action.payload;
    default:
      return state;
  }
}
/**
 * @author Philip Van Raalte
 * @date 2017-12-20
 */
import {GET_CHARTS, SAVE_CHARTS, ERROR_CHARTS} from '../actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_CHARTS:
      return action.payload;
    case SAVE_CHARTS:
      return action.payload;
    case ERROR_CHARTS:
      console.log("CHARTS ERROR", action.error);
      return state;
    default:
      return state;
  }
}
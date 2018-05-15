/**
 * @author Philip Van Raalte
 * @date 2017-12-16
 */
import { GET_IMAGE, ERROR_IMAGE } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case GET_IMAGE:
      return action.payload;
    case ERROR_IMAGE:
      console.log("DATA_IMAGE ERROR", action.error);
      return state;
    default:
      return state;
  }
}

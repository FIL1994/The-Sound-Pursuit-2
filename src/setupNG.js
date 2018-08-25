import { startSession, getDateTime, initSession } from "./ng/NG_Connect";
import { NG } from "./ng/UnlockMedals";

// NG Start Session
initSession();
startSession(() => {
  NG.fetchedUser = true;
  NG.executeQueue();
});
getDateTime();

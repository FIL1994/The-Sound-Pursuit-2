import { Howl } from "howler";

let Song1 = new Howl({
  src: ["assets/song1.ogg"],
  volume: 1,
  loop: true,
  preload: true,
  rate: 1,
  pool: 1,
  name: "song 1"
});

Song1.title = "A Perilous Journey - FIL1994";

let Song2 = new Howl({
  src: ["assets/song2.ogg"],
  volume: 1,
  loop: true,
  preload: true,
  rate: 1,
  pool: 1
});

Song2.title = "Something Else - FIL1994";

export default {
  Song1,
  Song2
};

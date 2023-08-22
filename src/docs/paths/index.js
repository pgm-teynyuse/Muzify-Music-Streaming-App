/* eslint-disable prettier/prettier */
import Users from "./users.js";
import Album from "./album.js";
import Playlist from "./playlist.js";
import Song from "./song.js";


export default {
  ...Users,
  ...Album,
  ...Playlist,
  ...Song,
};
import { define, ALL, NONE, a, C, R, G, D, mirror, type Entry } from "./_lib.ts";

const skipF: Entry = ["skip-forward", "next track media", ["M5 5.5v13a1 1 0 0 0 1.55.83l9.5-6.5a1 1 0 0 0 0-1.66l-9.5-6.5A1 1 0 0 0 5 5.5z", a("M19.5 5v14")], { v: NONE }];
const ff: Entry = ["fast-forward", "speed skip media", [G(3, 6, 11, 12, 3, 18), a(G(12, 6, 20, 12, 12, 18))], { v: NONE }];

export default define("media", ALL, [
  ["play", "start video audio media", ["M7.5 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.03 4.35A1 1 0 0 0 7.5 5.2z"], { v: NONE }],
  ["pause", "hold stop media", [R(6, 4.5, 4, 15, 1.5), a(R(14, 4.5, 4, 15, 1.5))], { v: NONE }],
  ["stop", "end halt media", [R(5, 5, 14, 14, 3)], { v: NONE }],
  ["record", "rec capture live", [C(12, 12, 9), a(C(12, 12, 4))], { v: NONE }],
  skipF,
  mirror(skipF, "skip-back", "previous track media"),
  ff,
  mirror(ff, "rewind", "back media reverse"),
  ["volume", "sound audio speaker loud", ["M4.5 9h3L12 5v14l-4.5-4h-3A1.5 1.5 0 0 1 3 13.5v-3A1.5 1.5 0 0 1 4.5 9z", a("M16 9a4 4 0 0 1 0 6"), "M18.5 6.5a7.5 7.5 0 0 1 0 11"]],
  ["volume-low", "sound audio quiet", ["M4.5 9h3L12 5v14l-4.5-4h-3A1.5 1.5 0 0 1 3 13.5v-3A1.5 1.5 0 0 1 4.5 9z", a("M16 9a4 4 0 0 1 0 6")]],
  ["volume-mute", "sound silent muted", ["M4.5 9h3L12 5v14l-4.5-4h-3A1.5 1.5 0 0 1 3 13.5v-3A1.5 1.5 0 0 1 4.5 9z", a("m16 9.5 5 5M21 9.5l-5 5")], { v: NONE }],
  ["music", "song note audio track", ["M9 18V5.5l11-2V16", C(6.5, 18, 2.5), a(C(17.5, 16, 2.5))]],
  ["film", "movie video cinema reel", [R(3, 3.5, 18, 17, 3), "M7.5 3.5v17M16.5 3.5v17", a("M3 12h18"), "M3 7.75h4.5M3 16.25h4.5M16.5 7.75H21M16.5 16.25H21"]],
  ["image", "picture photo gallery", [R(3, 3.5, 18, 17, 3), a(C(9, 9, 2)), "m3.5 17.5 5-5 4 4 2.5-2.5 5.5 5"]],
  ["images", "pictures photos gallery album", [R(7.5, 7.5, 13, 13, 2.5), "m8 18 3.5-3.5 2.5 2.5 2-2 4 4", a("M4.5 16.5V6A2.5 2.5 0 0 1 7 3.5h10.5")]],
  ["video", "camera movie record", [R(2.5, 6, 13, 12, 3), a("m15.5 10.5 5-3v9l-5-3")]],
  ["radio", "fm broadcast tuner", [R(3, 8, 18, 12.5, 3), a(C(15.5, 14.25, 2.5)), "M7 12h3M7 16.5h3", "M7.5 8l9-4.5"]],
  ["podcast", "audio show broadcast", [C(12, 10, 2), a("M12 15v6"), "M7.75 14.25a6 6 0 1 1 8.5 0", "M5.7 16.6a8.5 8.5 0 1 1 12.6 0"]],
  ["playlist", "queue songs list", ["M3.5 6.5h12", "M3.5 11.5h12", "M3.5 16.5h7", a("m15 13.5 5.5 3.5-5.5 3.5z")]],
  ["clapperboard", "movie film director scene", ["M3.5 10.5h17V18a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18z", a("m3.6 10.4-.5-3a2 2 0 0 1 1.6-2.3l12.8-2.3a2 2 0 0 1 2.3 1.6l.5 2.6z")]],
  ["picture-in-picture", "pip mini player window", [R(2.5, 4.5, 19, 15, 3), a(R(12, 12, 6, 4.5, 1))]],
  ["equalizer", "audio levels mixer sound", ["M5 20v-7", "M5 9V4", a("M3 11h4"), "M12 20v-4", "M12 12V4", "M10 14h4", "M19 20v-9", "M19 7V4", "M17 9h4"]],
  ["aperture", "camera lens shutter", [C(12, 12, 9), a("M14.3 3.3 9 12.5"), "M20.2 9.4H9.6", "M17.9 18.4 12.5 9.2", "M9.7 20.7 15 11.5", "M3.8 14.6h10.6", "M6.1 5.6l5.4 9.2"]],
  ["subtitles", "captions closed caption cc", [R(2.5, 4.5, 19, 15, 3), a("M6.5 13h4"), "M13 13h4.5", "M6.5 16h8"]],
  ["vinyl", "record album music lp", [C(12, 12, 9), C(12, 12, 1.5), a("M12 6.5A5.5 5.5 0 0 1 17.5 12")]],
  ["shuffle-play", "random mix music", [R(3, 3.5, 18, 17, 3), "M7 9h1.5c1.5 0 2.5 1 3.5 3s2 3 3.5 3H17", a("M7 15h1.5c.8 0 1.4-.3 1.9-.8"), "M13.6 9.8c.5-.5 1.1-.8 1.9-.8H17"]],
]);

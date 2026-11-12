import { define, ALL, a, C, D, G } from "./_lib.ts";

const CLOUD = "M7 19a4.5 4.5 0 0 1-.7-8.95 6 6 0 0 1 11.3-.85A4.9 4.9 0 0 1 17.5 19z";
const CLOUD_S = "M7.5 15.5a4 4 0 0 1-.55-7.96A5.5 5.5 0 0 1 17.4 6.9a4.3 4.3 0 0 1-.4 8.6z";
const RAYS = "M12 2.5V4M12 20v1.5M2.5 12H4M20 12h1.5M5.28 5.28l1.06 1.06M17.66 17.66l1.06 1.06M5.28 18.72l1.06-1.06M17.66 6.34l1.06-1.06";
const wave = (y: number) => `M3 ${y}c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5`;

export default define("weather", ALL, [
  ["sun", "day light brightness weather", [a(C(12, 12, 4)), RAYS]],
  ["moon", "night dark sleep mode", ["M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z", a(D(16, 6.5))]],
  ["cloud", "weather sky storage", [CLOUD, a("M9 15h6")]],
  ["cloud-rain", "weather rainy precipitation", [CLOUD_S, a("M8 18.5l-1 2M12 18.5l-1 2M16 18.5l-1 2")]],
  ["cloud-snow", "weather snowy winter", [CLOUD_S, a(D(8, 19) + D(12, 20.5) + D(16, 19))]],
  ["cloud-lightning", "weather storm thunder", [CLOUD_S, a("m12.5 15.5-2 3h3l-2 3")]],
  ["cloud-fog", "weather mist haze", [CLOUD_S, a("M6 18.5h12"), "M8 21h8"]],
  ["cloud-sun", "weather partly cloudy", ["M8.5 20.5a3.5 3.5 0 0 1-.5-6.96 4.5 4.5 0 0 1 8.6-.7 3.6 3.6 0 0 1-.1 7.66z", a("M9.5 9.1A4 4 0 0 1 16 7.5"), "M12 2.5V4", "M5.6 5.6l1.05 1.05", "M3 12h1.5", "M18.4 5.6l-1.05 1.05"]],
  ["wind", "air breeze weather", ["M3 9h11a2.5 2.5 0 1 0-2.5-2.5", a("M3 13h15a2.5 2.5 0 1 1-2.5 2.5"), "M3 17h7"]],
  ["snowflake", "winter cold freeze", ["M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9", a("m9.5 4.5 2.5 2 2.5-2"), "m9.5 19.5 2.5-2 2.5 2"]],
  ["umbrella", "rain protection insurance", ["M3 12a9 9 0 0 1 18 0z", a("M12 12v6.5a2 2 0 0 1-4 0")]],
  ["thermometer", "temperature heat weather", ["M14.5 14.6V5a2.5 2.5 0 0 0-5 0v9.6a4 4 0 1 0 5 0z", a("M12 9v8")]],
  ["droplet", "water drop liquid humidity", ["M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z", a("M9.5 15a2.5 2.5 0 0 0 2.5 2.5")]],
  ["flame", "fire hot burn trending", ["M12 21a6.5 6.5 0 0 0 6.5-6.5c0-4-3-6-4.5-11-3 2-4 4.5-4 6.5-1-.5-2-1.5-2.5-3C6 9 5.5 11 5.5 14.5A6.5 6.5 0 0 0 12 21z", a("M12 21a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1-2.5 2.5-4 1.5 1.5 2.5 2.5 2.5 4A2.5 2.5 0 0 1 12 21z")]],
  ["leaf", "plant nature eco green", ["M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19z", a("m5 19 8-8")]],
  ["tree", "forest nature park", ["M12 3 6.5 10.5h3L5.5 16h13l-4-5.5h3z", a("M12 16v5")]],
  ["sprout", "grow plant seedling", ["M12 20.5V11", a("M12 11c0-3.5-2.5-6-7-6 0 4 2.5 6 7 6z"), "M12 13.5c0-3 2-5 6-5 0 3.5-2 5-6 5z"]],
  ["mountain", "peak hill landscape nature", [G(2.5, 19.5, 9, 8.5, 12.2, 13.9, 15, 9.5, 21.5, 19.5), a("M7.5 11 9 8.5l1.5 2.5")]],
  ["waves", "water sea ocean", [wave(7.5), a(wave(12.5)), wave(17.5)]],
  ["rainbow", "colours arc weather", ["M3 18a9 9 0 0 1 18 0", a("M6.5 18a5.5 5.5 0 0 1 11 0"), "M10 18a2 2 0 0 1 4 0"]],
  ["sunrise", "morning dawn sun", ["M3 19h18", "M7 15.5a5 5 0 0 1 10 0", a("M12 3.5v5M9.5 6 12 3.5 14.5 6"), "M4.6 9.6l1.4 1.4M19.4 9.6 18 11"]],
  ["sunset", "evening dusk sun", ["M3 19h18", "M7 15.5a5 5 0 0 1 10 0", a("M12 8.5v-5M9.5 6 12 8.5 14.5 6"), "M4.6 9.6l1.4 1.4M19.4 9.6 18 11"]],
  ["sparkles", "magic ai shine new", ["M10 3.5c.6 3.5 2 4.9 5.5 5.5-3.5.6-4.9 2-5.5 5.5-.6-3.5-2-4.9-5.5-5.5 3.5-.6 4.9-2 5.5-5.5z", a("M17.5 13.5c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z")]],
  ["planet", "space saturn orbit", [C(12, 12, 5.5), a("M6.6 15.8c-2.8 2.1-4 3.9-3.4 4.6 1 1.2 6.4-1.1 11.3-5S22 6.6 21 5.4c-.6-.7-2.4-.3-4.6.9")]],
  ["globe", "world earth internet web", [C(12, 12, 9), "M3 12h18", a("M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18z")]],
  ["flower", "nature bloom spring", [a(C(12, 9.5, 2.25)), "M12 7.25a2.75 2.75 0 1 1 2.6 3.6", "M14.6 10.85a2.75 2.75 0 1 1-1.4 4", "M10.8 14.85a2.75 2.75 0 1 1-1.4-4", "M9.4 10.85A2.75 2.75 0 1 1 12 7.25", "M12 16v4.5"]],
  ["star-shooting", "wish comet meteor", ["M14.5 4.5l1.3 2.8 3 .4-2.2 2.1.6 3-2.7-1.5-2.7 1.5.5-3-2.2-2.1 3-.4z", a("M9.5 13 3.5 19M11.5 17l-3 3M5 11l-2 2")]],
  ["lightning", "bolt storm power energy", ["M13.5 3 5 13.5h6.5L10.5 21 19 10.5h-6.5z"]],
  ["night", "moon stars sleep dark mode", ["M18.5 15.5A7.5 7.5 0 1 1 8.5 5.5a6 6 0 0 0 10 10z", a("M17 3.5v3M15.5 5h3")]],
]);

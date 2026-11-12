import { define, ALL, a, C, R, D, rot } from "./_lib.ts";

export default define("health", ALL, [
  ["heart-pulse", "health heartbeat cardio vital", ["M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z", a("M7 12.5h2.5l1.5-2 2 4 1.5-2H17")]],
  ["activity", "pulse heartbeat monitor fitness", ["M3 12h4l2.5-6 5 12 2.5-6h4"]],
  ["pill", "medicine drug capsule tablet", ["M4.5 14.2 13.8 4.8a4.24 4.24 0 0 1 6 6l-9.3 9.4a4.24 4.24 0 0 1-6-6z", a("m9.15 9.5 5.35 5.35")]],
  ["syringe", "vaccine injection shot medicine", ["m17 3.5 3.5 3.5", "M18.75 5.25 15.5 8.5", "M16.5 9.5 8 18H6v-2l8.5-8.5z", a("m11 11.5 1.5 1.5"), "M6 18l-2.5 2.5"]],
  ["bandage", "plaster first aid wound", [rot(R(2.5, 8.25, 19, 7.5, 3.75), -45), a(D(10.6, 12) + D(13.4, 12) + D(12, 10.6) + D(12, 13.4))]],
  ["hospital", "clinic medical building", [R(4, 4, 16, 17, 2.5), a("M12 8v5M9.5 10.5h5"), "M10 21v-3.5h4V21"]],
  ["first-aid", "medical kit emergency", [R(3, 6.5, 18, 13, 3), "M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5", a("M12 10v6M9 13h6")]],
  ["dna", "genetics biology science helix", ["M7 3.5c0 6 10 11 10 17", "M17 3.5c0 2.5-1.7 4.6-3.9 6.4", "M10.9 14.1C8.7 15.9 7 18 7 20.5", a("M8.5 7.5h7M8.5 16.5h7")]],
  ["apple", "fruit food nutrition health", ["M12 7.5c-1.5-1-5.5-1.5-7 2s.5 9.5 3.5 10.5c1.3.4 2.3-.5 3.5-.5s2.2.9 3.5.5c3-1 5-7 3.5-10.5s-5.5-3-7-2z", a("M12 7.5c0-2 1-3.5 3-4")]],
  ["dumbbell", "fitness gym workout weight", ["M6.5 7v10M17.5 7v10", "M3.5 9.5v5M20.5 9.5v5", a("M6.5 12h11")]],
  ["stethoscope", "doctor medical checkup", ["M5 3.5H4.5v5a4.5 4.5 0 0 0 9 0v-5H13", "M9 13v1.5a5 5 0 0 0 10 0V12", a(C(19, 10, 2))]],
  ["thermometer-medical", "fever temperature sick", [rot("M10 3.5h4v13a2 2 0 0 1-4 0z", 45), a(rot("M12 11v5", 45))]],
  ["tooth", "dental dentist teeth", ["M12 6c-1.5-1.5-3-2-4.5-2C5 4 4 6 4 8.5c0 3 1.5 5 2 8 .3 2 .8 4 2 4 1.5 0 1.5-5 4-5s2.5 5 4 5c1.2 0 1.7-2 2-4 .5-3 2-5 2-8C20 6 19 4 16.5 4 15 4 13.5 4.5 12 6z", a("M9 7.5c1 0 2 .5 3 1.5")]],
  ["brain", "mind think ai intelligence", ["M12 5.5v13", "M12 5.5A3 3 0 0 0 6.5 7 3 3 0 0 0 4.5 11a3 3 0 0 0 1 4.5 3 3 0 0 0 3 3.5 3 3 0 0 0 3.5-.5", a("M12 5.5A3 3 0 0 1 17.5 7a3 3 0 0 1 2 4 3 3 0 0 1-1 4.5 3 3 0 0 1-3 3.5 3 3 0 0 1-3.5-.5")]],
  ["eye-medical", "vision optometry sight", [C(12, 12, 9), "M6 12s2.5-3.5 6-3.5 6 3.5 6 3.5-2.5 3.5-6 3.5S6 12 6 12z", a(D(12, 12))]],
  ["wheelchair", "accessible disability mobility", [C(11, 4.5, 1.75), "M11 8v6h5l2.5 5", a("M8 10.5a5.5 5.5 0 1 0 7.5 7"), "M11 11h4"]],
]);

import { define, ALL, a, C, R, D } from "./_lib.ts";

export default define("time", ALL, [
  ["clock", "time hour watch", [C(12, 12, 9), a("M12 7v5l3.5 2")]],
  ["alarm-clock", "wake alarm reminder", [C(12, 13, 7.5), a("M12 9.5V13l2.5 1.5"), "M4 5.5 6.5 3", "M20 5.5 17.5 3"]],
  ["timer", "countdown stopwatch duration", [C(12, 13.5, 7.5), a("M12 13.5 15 10.5"), "M10 2.5h4"]],
  ["stopwatch", "timer lap sport", [C(12, 13.5, 7.5), a("M12 9.5v4"), "M10 2.5h4", "M12 2.5V6", "M18.5 6.5l1 1"]],
  ["hourglass", "wait loading sand time", ["M6.5 3.5h11", "M6.5 20.5h11", "M7.5 3.5v2.3a3 3 0 0 0 1 2.2L12 12l3.5-4a3 3 0 0 0 1-2.2V3.5", "M7.5 20.5v-2.3a3 3 0 0 1 1-2.2L12 12l3.5 4a3 3 0 0 1 1 2.2v2.3", a("M10 18h4")]],
  ["calendar", "date schedule event month", [R(3.5, 5, 17, 15.5, 3), "M3.5 10h17", a("M8 3v4M16 3v4")]],
  ["calendar-days", "date month grid schedule", [R(3.5, 5, 17, 15.5, 3), "M3.5 10h17", "M8 3v4M16 3v4", a(D(8, 13.5) + D(12, 13.5) + D(16, 13.5) + D(8, 17) + D(12, 17))]],
  ["calendar-event", "date appointment meeting", [R(3.5, 5, 17, 15.5, 3), "M3.5 10h17", "M8 3v4M16 3v4", a(R(7.5, 13, 4, 4, 1))]],
  ["history", "recent past back time", ["M3.5 12A8.5 8.5 0 1 0 6 6", "M3.5 4v4.5H8", a("M12 7.5V12l3 2")]],
  ["calendar-range", "dates period span", [R(3.5, 5, 17, 15.5, 3), "M3.5 10h17", "M8 3v4M16 3v4", a("M7.5 14.5h9"), "M7.5 17h4"]],
  ["clock-circle-arrow", "update schedule sync time", ["M20.5 12A8.5 8.5 0 1 1 18 6", "M20.5 4v4.5H16", a("M12 7.5V12l3 2")]],
  ["sand-timer", "deadline wait duration", [R(6, 3, 12, 18, 3), a("M9 7.5h6l-3 4z"), "M9 17h6"]],
]);

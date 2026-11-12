import { define, ALL, a, C, R, D } from "./_lib.ts";

const BUBBLE = "M3.5 6.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8L5 21v-3.6a3 3 0 0 1-1.5-2.6z";
const ROUND = "M20.5 12a8.5 8.5 0 0 1-12.4 7.55L3.5 20.5l1-4.45A8.5 8.5 0 1 1 20.5 12z";

export default define("communication", ALL, [
  ["mail", "email envelope inbox letter", [R(3, 5, 18, 14, 3), a("m3.5 7.5 8.5 6 8.5-6")]],
  ["mail-open", "email read opened letter", ["M3.5 10l8.5-6 8.5 6v8a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18z", a("m3.5 10.5 8.5 5.5 8.5-5.5")]],
  ["send", "paper plane message submit", ["M21 3l-6.5 18-4-7.5-7.5-4z", a("M21 3 10.5 13.5")]],
  ["message", "chat comment bubble conversation", [BUBBLE, a("M8 8.5h8"), "M8 12h5"]],
  ["message-dots", "chat typing bubble", [BUBBLE, a(D(8.5, 10.5) + D(12, 10.5) + D(15.5, 10.5))]],
  ["message-circle", "chat bubble round talk", [ROUND, a(D(8.5, 12) + D(12, 12) + D(15.5, 12))]],
  ["messages", "chats conversation thread", ["M7.5 9a2.5 2.5 0 0 1 2.5-2.5h8A2.5 2.5 0 0 1 20.5 9v5.5a2.5 2.5 0 0 1-2.5 2.5h-1v3l-4-3h-3a2.5 2.5 0 0 1-2.5-2.5z", a("M4.5 14.5A2 2 0 0 1 3.5 12.8V5.5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 1.75 1")]],
  ["phone", "call telephone contact", ["M8 3.5H5.5a2 2 0 0 0-2 2.2A16 16 0 0 0 18.3 20.5a2 2 0 0 0 2.2-2V16a1.5 1.5 0 0 0-1.1-1.45l-3-.9a1.5 1.5 0 0 0-1.6.5l-.9 1.15a12 12 0 0 1-5.7-5.7l1.15-.9a1.5 1.5 0 0 0 .5-1.6l-.9-3A1.5 1.5 0 0 0 8 3.5z"]],
  ["phone-call", "calling ringing telephone", ["M8 3.5H5.5a2 2 0 0 0-2 2.2A16 16 0 0 0 18.3 20.5a2 2 0 0 0 2.2-2V16a1.5 1.5 0 0 0-1.1-1.45l-3-.9a1.5 1.5 0 0 0-1.6.5l-.9 1.15a12 12 0 0 1-5.7-5.7l1.15-.9a1.5 1.5 0 0 0 .5-1.6l-.9-3A1.5 1.5 0 0 0 8 3.5z", a("M14.5 3.5a6 6 0 0 1 6 6"), "M14.5 7A2.5 2.5 0 0 1 17 9.5"]],
  ["at-sign", "email mention address", [a(C(12, 12, 3.5)), "M15.5 8.5v4.75a2.25 2.25 0 0 0 4.5 0V12a8 8 0 1 0-3.13 6.35"]],
  ["megaphone", "announce broadcast marketing", ["M3.5 10v4A1.5 1.5 0 0 0 5 15.5h2L14 20V4L7 8.5H5A1.5 1.5 0 0 0 3.5 10z", a("M17.5 9a4 4 0 0 1 0 6"), "M7 15.5l1.5 5"]],
  ["rss", "feed subscribe blog", [a(C(5.5, 18.5, 1)), "M4.5 11.5a8 8 0 0 1 8 8", "M4.5 4.5a15 15 0 0 1 15 15"]],
  ["video-call", "camera meeting conference", [R(2.5, 6, 13, 12, 3), a("m15.5 10.5 5-3v9l-5-3")]],
  ["voicemail", "message recording tape", [C(6.5, 12, 3.5), C(17.5, 12, 3.5), a("M6.5 15.5h11")]],
  ["bell", "notification alert ring", ["M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z", a("M10 20.5a2 2 0 0 0 4 0")]],
  ["bell-ring", "notification ringing alarm", ["M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z", a("M10 20.5a2 2 0 0 0 4 0"), "M3.5 9a8 8 0 0 1 2-5", "M20.5 9a8 8 0 0 0-2-5"]],
  ["contact-book", "address book contacts phonebook", [R(5.5, 3, 13, 18, 2.5), C(12, 10, 2.5), "M8.75 16.5a3.25 3.25 0 0 1 6.5 0", a("M3.5 7.5h3M3.5 12h3M3.5 16.5h3")]],
  ["broadcast", "signal live stream radio", [a(C(12, 12, 1.75)), "M8.5 8.5a5 5 0 0 0 0 7", "M15.5 8.5a5 5 0 0 1 0 7", "M5.6 5.6a9 9 0 0 0 0 12.8", "M18.4 5.6a9 9 0 0 1 0 12.8"]],
  ["comment-square", "feedback review note", [R(3.5, 3.5, 17, 13.5, 3), a("M8 17v4l4.5-4")]],
  ["mailbox", "letterbox post delivery", ["M6.5 7a4 4 0 0 1 4 4v8.5H3.5V11a3 3 0 0 1 3-4z", "M10.5 19.5h10V11a4 4 0 0 0-4-4h-10", a("M14.5 7V3.5h3"), "M6.5 12.5h1"]],
  ["translate", "language localisation words", ["M3.5 5.5h9", "M8 3.5v2", "M5.5 5.5c.5 3.5 2.5 6 6 7.5", "M10.5 5.5c-.5 3.5-2.5 6-6 7.5", a("m12.5 20.5 4-9 4 9"), "M13.8 17.5h5.4"]],
  ["share-square", "share export send out", ["M8 9H6.5a3 3 0 0 0-3 3v5.5a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3H16", a("M12 14.5V3"), "m8.5 6.5 3.5-3.5 3.5 3.5"]],
  ["newspaper", "news article press blog", ["M17 20.5H6A2.5 2.5 0 0 1 3.5 18V5.5a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2V18a2.5 2.5 0 0 0 2.5 2.5 1.5 1.5 0 0 0 1.5-1.5v-9h-4", a(R(7, 7, 6, 4, 1)), "M7 14.5h6", "M7 17.5h4"]],
]);

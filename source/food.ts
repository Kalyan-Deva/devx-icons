import { define, ALL, a, D } from "./_lib.ts";

export default define("food", ALL, [
  ["utensils", "restaurant dining fork knife", ["M7 3.5v17", "M4.5 3.5V8a2.5 2.5 0 0 0 5 0V3.5", a("M17 20.5V3.5c-2 1-3.5 3.5-3.5 7H17")]],
  ["cake", "birthday celebration dessert", ["M4 20.5h16", "M5 20.5v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6", a("M12 12.5V9"), "M12 6.5a1.25 1.25 0 0 1-1.25-1.25C10.75 4.5 12 3.5 12 3.5s1.25 1 1.25 1.75A1.25 1.25 0 0 1 12 6.5z", "M5 16c1.2 0 1.8-1 3.5-1s1.8 1 3.5 1 1.8-1 3.5-1 2.3 1 3.5 1"]],
  ["pizza", "food slice fast food", ["M12 21 3.5 6.5a14 14 0 0 1 17 0z", a(D(10, 10) + D(14, 11) + D(12, 15))]],
  ["ice-cream", "dessert sweet cone summer", ["M8 10.5l4 10 4-10", a("M7 10.5a5 5 0 0 1 10 0z")]],
  ["chef-hat", "cook kitchen recipe", ["M7 16.5V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.5", "M7 16.5a4 4 0 0 1-.2-7.9 5.5 5.5 0 0 1 10.4 0 4 4 0 0 1-.2 7.9z", a("M10 13.5V16.5M14 13.5V16.5")]],
  ["glass-water", "drink hydrate cup", ["M5.5 3.5h13l-1.6 15.2a2 2 0 0 1-2 1.8H9.1a2 2 0 0 1-2-1.8z", a("M6.3 10.5c2-1 4-1 5.7 0s3.7 1 5.7 0")]],
  ["bottle", "drink water beverage", ["M10 3.5h4", "M10.5 3.5v3L8 9.5A2 2 0 0 0 7.5 11v8a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-8a2 2 0 0 0-.5-1.5l-2.5-3v-3", a("M7.5 13h9")]],
  ["burger", "fast food hamburger meal", ["M4 10.5a8 7 0 0 1 16 0z", a("M3.5 14h17"), "M4.5 17.5h15a1 1 0 0 1-1 2h-13a1 1 0 0 1-1-2z"]],
  ["carrot", "vegetable food healthy", ["M15.5 8.5 4 20l1.5-6.5 6-6.5a2.8 2.8 0 0 1 4 1.5z", a("M15.5 8.5 20 4M16 3.5l-1 4M20.5 9l-4-1")]],
  ["egg", "breakfast food protein", ["M12 3.5c-3.5 0-6.5 5.5-6.5 10a6.5 6.5 0 0 0 13 0c0-4.5-3-10-6.5-10z", a("M9 14.5a3 3 0 0 0 3 3")]],
]);

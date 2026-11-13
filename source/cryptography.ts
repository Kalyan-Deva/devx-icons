import { define, ALL, a, C, R, D, E, ngon, rot, star } from "./_lib.ts";

const SHIELD = "M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z";
const DOC = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z";
const FOLD = "M14 3v4a1 1 0 0 0 1 1h4";
const CHIP = R(5, 5, 14, 14, 2.5);
const PINS = "M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5";
const t = (s: string) => `security crypto ${s}`;

let latticeDots = "";
for (const x of [4.5, 9.5, 14.5, 19.5]) for (const y of [4.5, 9.5, 14.5, 19.5]) latticeDots += D(x, y);

export default define("cryptography", ALL, [
  ["encryption", t("encrypt lock file protect"), [DOC, FOLD, a(R(9, 13, 6, 5, 1)), "M10 13v-1.5a2 2 0 0 1 4 0V13"]],
  ["decryption", t("decrypt unlock file open"), [DOC, FOLD, a(R(9, 13, 6, 5, 1)), "M10 13v-1.5a2 2 0 0 1 3.9-.6"]],
  ["cipher", t("cipher wheel caesar code"), [C(12, 12, 9), C(12, 12, 5), a("M12 3v2M21 12h-2M12 21v-2M3 12h2"), D(12, 12)]],
  ["key-exchange", t("diffie hellman kem handshake share"), [C(6, 7, 2.5), "M8.5 7H14M12 7v1.5", C(18, 17, 2.5), "M15.5 17H10M12 17v-1.5", a("m14.5 4 3 3-3 3"), "m9.5 20-3-3 3-3"]],
  ["digital-signature", t("sign signing verify pen"), ["M16 3.5 20.5 8 12 16.5 6.5 18 8 12.5z", "M8 12.5l3.5 3.5", a("M3.5 21h7")]],
  ["hash-function", t("hash digest sha checksum"), [ngon(12, 12, 9, 6), a("M10.5 8.5 9.5 15.5M14.5 8.5l-1 7M8.5 10.5h7M8 13.5h7")]],
  ["certificate-chain", t("pki chain of trust ca x509"), [R(3, 3.5, 7, 5, 1.5), R(8.5, 9.5, 7, 5, 1.5), a(R(14, 15.5, 7, 5, 1.5)), "M6.5 8.5V12h2", "M12 14.5V18h2"]],
  ["seal", t("wax seal stamp verified trust"), [star(12, 10, 7.5, 6.5, 12), a(C(12, 10, 3)), "m8 15.5-1.5 5 2.5-1 2 1.5", "m16 15.5 1.5 5-2.5-1-2 1.5"]],
  ["lattice", t("post quantum lattice basis vectors pqc ml-kem"), [latticeDots, a("M4.5 19.5 9.5 9.5M4.5 19.5l10-5")], { v: ["plus", "minus", "check", "x", "alert", "lock", "star", "heart", "bolt"] }],
  ["post-quantum", t("quantum pqc atom future"), [E(12, 12, 9, 3.5), rot(E(12, 12, 9, 3.5), 60), rot(E(12, 12, 9, 3.5), -60), a(C(12, 12, 1.5))]],
  ["quantum-shield", t("quantum safe protection pqc"), [SHIELD, a(E(12, 11.5, 4, 1.75)), rot(E(12, 11.5, 4, 1.75), 60)]],
  ["hsm", t("hardware security module key chip"), [CHIP, PINS, a(C(10, 12, 2)), "M12 12h4M14.5 12v1.5"]],
  ["tpm", t("trusted platform module chip lock"), [CHIP, PINS, a(R(9, 11.5, 6, 4.5, 1)), "M10 11.5v-1a2 2 0 0 1 4 0v1"]],
  ["secure-boot", t("boot chain trust startup power"), [SHIELD, a("M9.5 9.2a3.5 3.5 0 1 0 5 0"), "M12 7.5V11"]],
  ["firmware", t("embedded code chip microcontroller"), [CHIP, PINS, a("m10.5 10-2 2 2 2M13.5 10l2 2-2 2")]],
  ["secret", t("secret credential private key asterisk"), [C(7, 15.5, 3.5), "M9.5 13 18 4.5", "M15.5 7l1.5 1.5", a("M17 13v6M14.4 14.5l5.2 3M19.6 14.5l-5.2 3")]],
  ["one-time-code", t("otp mfa 2fa code phone"), [R(6, 2.5, 12, 19, 3), a("M9 11.5v2M8.1 12l1.8 1M9.9 12l-1.8 1M12 11.5v2M11.1 12l1.8 1M12.9 12l-1.8 1M15 11.5v2M14.1 12l1.8 1M15.9 12l-1.8 1")]],
  ["api-token", t("token jwt bearer access key"), [ngon(12, 12, 9, 6, 0), a(C(10.5, 12, 2)), "M12.5 12H16M15 12v1.5"]],
]);

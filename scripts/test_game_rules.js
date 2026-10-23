import { buildAll59Rules, CAMPAIGN_LEVELS, getDigitSum } from "../src/utils/gameRules.js";

console.log("════════════════════════════════════════════════════════════════");
console.log("🧪 RUNNING COMPREHENSIVE TEST SUITE FOR VICE CITY HEIST RULES");
console.log("════════════════════════════════════════════════════════════════\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

const rules = buildAll59Rules();

// 1. Total rule count and distribution
console.log("▶ TEST 1: Rule Counts and Campaign Distribution");
assert(rules.length === 59, `Total rules must be exactly 59 (received: ${rules.length})`);
const level1Rules = rules.filter((r) => r.level === 1);
const level2Rules = rules.filter((r) => r.level === 2);
const level3Rules = rules.filter((r) => r.level === 3);
const level4Rules = rules.filter((r) => r.level === 4);

assert(level1Rules.length === 10, `Level 1 must have 10 rules (received: ${level1Rules.length})`);
assert(level2Rules.length === 13, `Level 2 must have 13 rules (received: ${level2Rules.length})`);
assert(level3Rules.length === 16, `Level 3 must have 16 rules (received: ${level3Rules.length})`);
assert(level4Rules.length === 20, `Level 4 must have 20 rules (received: ${level4Rules.length})`);

// 2. Verify ZERO maze references across all 59 rules
console.log("\n▶ TEST 2: Verification of Zero Maze Mentions");
let mazeFound = false;
rules.forEach((r) => {
  const serialized = JSON.stringify(r);
  if (/\b(?:maze|airlock|ducts?|shaft)\b/i.test(serialized)) {
    mazeFound = true;
    console.error(`  Found maze reference in Rule #${r.id}: ${r.text}`);
  }
});
assert(!mazeFound, "Zero occurrences of maze/ducts found in any of the 59 rules");

// 3. Verify Exact Level 1 Sequence Requested by User
console.log("\n▶ TEST 3: Level 1 Requested Sequence (Rules 1 - 10)");
assert(rules[0].category.includes("Length"), `Rule 1 is Length check: "${rules[0].text}"`);
assert(rules[1].text.toLowerCase().includes("capital") || rules[1].text.toLowerCase().includes("uppercase"), `Rule 2 is Uppercase check: "${rules[1].text}"`);
assert(rules[2].text.toLowerCase().includes("lowercase"), `Rule 3 is Lowercase check: "${rules[2].text}"`);
assert(rules[3].text.toLowerCase().includes("digit"), `Rule 4 is Numeric digit check: "${rules[3].text}"`);
assert(rules[4].text.toLowerCase().includes("special"), `Rule 5 is Special character check: "${rules[4].text}"`);
assert(rules[5].text.toLowerCase().includes("whitespace"), `Rule 6 is No whitespace check: "${rules[5].text}"`);
assert(rules[6].text.includes("EXACTLY 25"), `Rule 7 is Digit Sum = 25: "${rules[6].text}"`);
assert(rules[7].text.toLowerCase().includes("ipv4"), `Rule 8 is IPv4 address: "${rules[7].text}"`);
assert(rules[7].category === "Network Address", `Rule 8 category is Network Address`);
assert(rules[8].text.includes("DD-MM-YYYY"), `Rule 9 is Calendar Date (DD-MM-YYYY): "${rules[8].text}"`);
assert(rules[9].text.includes("DIRECTION REASONING"), `Rule 10 is Direction Reasoning: "${rules[9].text}"`);

// 4. Verify Level 1 Compass Direction Support
console.log("\n▶ TEST 4: Compass Direction Verification");
assert(rules[9].check("E"), "Rule 10 accepts short form 'E'");
assert(rules[9].check("EAST"), "Rule 10 accepts full word 'EAST'");

// 5. Test Live Password Validation on Level 1 (with Digit Sum = 25)
console.log("\n▶ TEST 5: Level 1 Master Key Solving & Digit Sum Dynamics");
const testPasswordLvl1 = "Va!E10.0.0.1_01-01-2000_991";
console.log(`  Evaluating Test Password: "${testPasswordLvl1}"`);
console.log(`  Password Digit Sum: ${getDigitSum(testPasswordLvl1)}`);

assert(getDigitSum(testPasswordLvl1) === 25, `Password digit sum equals exactly 25`);
level1Rules.forEach((r) => {
  const passed = r.check(testPasswordLvl1);
  assert(passed, `Rule #${r.id} (${r.category}) -> ${passed ? "PASS" : "FAIL"}`);
});

// 6. Test Digit Sum Sensitivity (The Constraint Puzzle)
console.log("\n▶ TEST 6: Digit Sum Constraint Enforced");
const overSumPw = "Va!E10.0.0.1_01-01-2000_992";
assert(!rules[6].check(overSumPw), "Rule 7 correctly FAILS when digit sum is 26 instead of 25");

const underSumPw = "Va!E10.0.0.1_01-01-2000_990";
assert(!rules[6].check(underSumPw), "Rule 7 correctly FAILS when digit sum is 24 instead of 25");

// 7. Verify Modern Generation & Aptitude Questions Across Levels 2, 3, 4
console.log("\n▶ TEST 7: Modern Generation & Aptitude Questions Validation");

// Level 2 (rules[10] to rules[22])
// Rule 11: Length >= 12
assert(rules[10].check("123456789012"), "Rule 11 (Length 12) passes with 12 characters");

// Rule 12: Dual Uppercase
assert(rules[11].check("AB"), "Rule 12 (Dual uppercase) passes with 'AB'");

// Rule 13: Manager's Tip - Meta AI (Instagram/WhatsApp)
assert(rules[12].check("META"), "Rule 13 (Instagram/WhatsApp AI) passes with 'META'");
assert(rules[12].text.includes("MANAGER'S TIP"), "Rule 13 framed as Manager's Tip");

// Rule 14: Distance 3m East, 4m North -> 5
assert(rules[13].check("5m"), "Rule 14 (Distance) passes with '5m'");
assert(rules[13].check("5"), "Rule 14 (Distance) passes with '5'");

// Rule 15: Zero Tumbler Quorum (at least four 0s) - replacing old SON riddle
assert(rules[14].check("0000"), "Rule 15 (4 zeros) passes with '0000'");
assert(!rules[14].check("000"), "Rule 15 (4 zeros) fails with only 3 zeros '000'");

// Rule 16: Alphabet sequence DW
assert(rules[15].check("DW"), "Rule 16 (Alphabet sequence) passes with 'DW'");

// Rule 17: Ranking 16
assert(rules[16].check("16"), "Rule 17 (Ranking) passes with '16'");

// Rule 18: Roman XIX
assert(rules[17].check("XIX"), "Rule 18 (Roman XIX) passes with 'XIX'");

// Rule 19: Prime 11
assert(rules[18].check("11"), "Rule 19 (Prime reasoning) passes with '11'");

// Rule 20: Work & time 3
assert(rules[19].check("3"), "Rule 20 (Work & Time) passes with '3'");

// Rule 21: Syllogism HEAVY
assert(rules[20].check("HEAVY"), "Rule 21 (Syllogism) passes with 'HEAVY'");

// Rule 22: Clock 90 deg
assert(rules[21].check("90"), "Rule 22 (Clock hand angle) passes with '90'");

// Rule 23: Cipher LFZ
assert(rules[22].check("LFZ"), "Rule 23 (Cipher) passes with 'LFZ'");

// Level 3 (rules[23] to rules[38])
// Rule 24: Length >= 15
assert(rules[23].check("123456789012345"), "Rule 24 (Length 15) passes with 15 characters");

// Rule 25: Encapsulation {...}
assert(rules[24].check("{VAULT}"), "Rule 25 (Encapsulation) passes with '{VAULT}'");

// Rule 27: Manager's Tip - ChatGPT
assert(rules[26].check("CHATGPT"), "Rule 27 (ChatGPT AI) passes with 'CHATGPT'");
assert(rules[26].check("GPT"), "Rule 27 (ChatGPT AI) passes with 'GPT'");

// Rule 28: Speed 60 km/h
assert(rules[27].check("60"), "Rule 28 (Speed) passes with '60'");

// Rule 29: Manager's Tip - Netflix Ta-Dum
assert(rules[28].check("NETFLIX"), "Rule 29 (Netflix) passes with 'NETFLIX'");

// Rule 30: Squares 36
assert(rules[29].check("36"), "Rule 30 (Squares series) passes with '36'");

// Rule 31: Truth-teller YES
assert(rules[30].check("YES"), "Rule 31 (Truth-teller) passes with 'YES'");

// Rule 32: Age 10
assert(rules[31].check("10"), "Rule 32 (Age problem) passes with '10'");

// Rule 33: Lateral riddle HOLE or PIT
assert(rules[32].check("HOLE"), "Rule 33 (Lateral riddle) passes with 'HOLE'");
assert(rules[32].check("PIT"), "Rule 33 (Lateral riddle) passes with 'PIT'");

// Rule 34: Clock mirror 9
assert(rules[33].check("9"), "Rule 34 (Mirror clock) passes with '9'");

// Rule 35: Odd one out CUBE
assert(rules[34].check("CUBE"), "Rule 35 (Odd one out) passes with 'CUBE'");

// Rule 36: Set logic 2
assert(rules[35].check("2"), "Rule 36 (Set logic) passes with '2'");

// Rule 37: Caesar shift VDIH
assert(rules[36].check("VDIH"), "Rule 37 (Caesar VDIH) passes with 'VDIH'");

// Rule 38: Seating D
assert(rules[37].check("D"), "Rule 38 (Seating D) passes with 'D'");

// Rule 39: ROT13 YBPX
assert(rules[38].check("YBPX"), "Rule 39 (ROT13 YBPX) passes with 'YBPX'");

// Level 4 (rules[39] to rules[58])
// Rule 40: Length >= 18
assert(rules[39].check("123456789012345678"), "Rule 40 (Length 18) passes with 18 characters");

// Rule 41: Manager's Tip - Google Gemini AI
assert(rules[40].check("GEMINI"), "Rule 41 (Google Gemini AI) passes with 'GEMINI'");

// Rule 42: Fibonacci 21
assert(rules[41].check("21"), "Rule 42 (Fibonacci) passes with '21'");

// Rule 43: Manager's Tip - Spotify Wrapped
assert(rules[42].check("SPOTIFY"), "Rule 43 (Spotify Wrapped) passes with 'SPOTIFY'");

// Rule 44: Arithmetic Mean 30
assert(rules[43].check("30"), "Rule 44 (Arithmetic Mean) passes with '30'");

// Rule 45: River crossing GOAT
assert(rules[44].check("GOAT"), "Rule 45 (River crossing) passes with 'GOAT'");

// Rule 46: Handshakes 10
assert(rules[45].check("10"), "Rule 46 (Handshakes) passes with '10'");

// Rule 47: Anagram SILENT
assert(rules[46].check("SILENT"), "Rule 47 (Anagram LISTEN) passes with 'SILENT'");

// Rule 48: Probability 25%
assert(rules[47].check("25"), "Rule 48 (Coin probability) passes with '25'");

// Rule 49: Deductive elimination BOB
assert(rules[48].check("BOB"), "Rule 49 (Race elimination) passes with 'BOB'");

// Rule 50: Loop displacement 0
assert(rules[49].check("0"), "Rule 50 (Loop displacement) passes with '0'");

// Rule 51: Calendar MONDAY
assert(rules[50].check("MONDAY"), "Rule 51 (70 days calendar) passes with 'MONDAY'");

// Rule 52: Ratio 25
assert(rules[51].check("25"), "Rule 52 (Ratio) passes with '25'");

// Rule 53: Palindrome RADAR
assert(rules[52].check("RADAR"), "Rule 53 (5-letter palindrome) passes with 'RADAR'");

// Rule 54: Midpoint M
assert(rules[53].check("M"), "Rule 54 (Alphabet midpoint) passes with 'M'");

// Rule 55: Reflection symmetry MOM
assert(rules[54].check("MOM"), "Rule 55 (Mirror symmetry) passes with 'MOM'");

// Rule 56: Keyboard riddle
assert(rules[55].check("KEYBOARD"), "Rule 56 (Keys riddle) passes with 'KEYBOARD'");

// Rule 57: Even parity
assert(rules[56].check("EVENSTRING12"), "Rule 57 (Even parity) passes with even length");

// Rule 58: Grand equilibrium
assert(rules[57].category === "Master Equilibrium", "Rule 58 is Grand Equilibrium (Digit sum = 25)");

// Rule 59: Final lock
assert(rules[58].check("LOCK"), "Rule 59 (Final lockdown) passes with 'LOCK'");

console.log("\n════════════════════════════════════════════════════════════════");
console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("════════════════════════════════════════════════════════════════\n");

if (passedTests === totalTests) {
  console.log("🎉 ALL TESTS PASSED WITH 100% SUCCESS!");
  process.exit(0);
} else {
  console.error(`💥 ${totalTests - passedTests} TEST(S) FAILED!`);
  process.exit(1);
}

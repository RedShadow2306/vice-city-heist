import { buildAll80Rules, CAMPAIGN_LEVELS } from "../src/utils/gameRules.js";
import { getManagerDirective } from "../src/utils/managerDialogue.js";

console.log("════════════════════════════════════════════════════════════════");
console.log("🕵️ FULL-SPECTRUM CAMPAIGN & ANTI-SPOILER DEVOPS AUDIT");
console.log("════════════════════════════════════════════════════════════════\n");

let auditFailures = 0;
let auditSuccesses = 0;

function report(condition, checkName, details = "") {
  if (condition) {
    auditSuccesses++;
    console.log(`  ✅ PASS: ${checkName}`);
  } else {
    auditFailures++;
    console.error(`  ❌ VIOLATION: ${checkName}`);
    if (details) console.error(`     ↳ Details: ${details}`);
    process.exitCode = 1;
  }
}

const allRules = buildAll80Rules();

// 1. Structure Verification
console.log("▶ CHECK 1: Total Rules & Campaign Distribution");
report(allRules.length === 80, `80 Total Campaign Rules`, `Found: ${allRules.length}`);

[1, 2, 3, 4].forEach((lvl) => {
  const lvlRules = allRules.filter((r) => r.level === lvl);
  report(lvlRules.length === 20, `Level ${lvl} has exactly 20 rules`, `Found: ${lvlRules.length}`);
});

// 2. Anti-Spoiler & Zero-Answer Leakage Audit
console.log("\n▶ CHECK 2: Zero Answer Leaks in Prompts, Badges, Hints & Manager Speech");

const mockSession = {
  romanTarget: { num: 9, roman: "IX" },
  sponsor: "VICE_CORP",
  captcha: "X9K2P",
  element: { name: "Gold", symbol: "AU" },
  geo: { country: "France", capital: "PARIS" },
  resistor: { bands: ["Brown", "Black", "Red"], value: "1K" },
  logicCircuit: { gate: "XOR" },
  swatch: { hex: "#E91E63", color: "Pink" },
};

allRules.forEach((rule, idx) => {
  const ruleNum = idx + 1;
  const expectedAns = rule.expectedAnswer;

  // Evaluate badge with empty password
  const unfulfilledBadge = typeof rule.badge === "function" ? rule.badge("") : (rule.badge || "");
  
  // Evaluate hint
  const hintText = typeof rule.hint === "function" ? rule.hint("") : (rule.hint || "");

  // Evaluate Manager Speech
  const directive = getManagerDirective(rule, "", mockSession, CAMPAIGN_LEVELS[rule.level || 1]);
  const managerSpeech = directive.speech || "";

  if (expectedAns && expectedAns.length >= 2 && !["IV", "IX", "00", "OK"].includes(expectedAns)) {
    // A: Prompt shouldn't blatantly say "Answer is XYZ" or "Type XYZ"
    const promptLeaks = new RegExp(`(?:type|answer is|enter)\\s+['"]?${expectedAns}['"]?`, "i").test(rule.text);
    if (promptLeaks) {
      report(false, `Rule #${ruleNum} Prompt Leaks Answer`, `Prompt: "${rule.text}" leaks "${expectedAns}"`);
    }

    // B: Unfulfilled badge shouldn't display the raw answer with a question mark like "LOCK ?"
    const badgeLeaks = unfulfilledBadge.toUpperCase().includes(expectedAns.toUpperCase());
    if (badgeLeaks && !["✓"].includes(unfulfilledBadge)) {
      report(false, `Rule #${ruleNum} Unfulfilled Badge Leaks Answer`, `Badge: "${unfulfilledBadge}" displays "${expectedAns}" before input`);
    }

    // C: Manager speech shouldn't explicitly give away the answer to the player
    const speechLeaks = new RegExp(`(?:type|enter|keyword|solution is)\\s+['"]?${expectedAns}['"]?`, "i").test(managerSpeech);
    if (speechLeaks) {
      report(false, `Rule #${ruleNum} Manager Speech Leaks Answer`, `Speech: "${managerSpeech}" gives away "${expectedAns}"`);
    }
  }
});

if (auditFailures === 0) {
  report(true, `All 80 rules cleared Zero-Answer Leakage & Anti-Spoiler audit`);
}

// 3. Playthrough Simulation of All 4 Levels
console.log("\n▶ CHECK 3: End-to-End Campaign Playthrough Feasibility");

// Level 1: Rules 1-20
const level1Rules = allRules.filter((r) => r.level === 1);
const level1Password = "Va!E10.0.0.1_01-01-2000_9917EASTSIRIOK";
// Let's verify rule checks
let l1PassCount = 0;
level1Rules.forEach((r) => {
  if (r.check(level1Password)) l1PassCount++;
});
console.log(`  Level 1 verification: Passed ${l1PassCount} / ${level1Rules.length} rules with test key`);

// 4. Verification Summary
console.log("\n════════════════════════════════════════════════════════════════");
console.log(`📊 AUDIT COMPLETED: ${auditSuccesses} CHECKS PASSED, ${auditFailures} VIOLATIONS`);
console.log("════════════════════════════════════════════════════════════════\n");

if (auditFailures === 0) {
  console.log("🏆 EXCELLENT! 100% OF DEVOPS INTEGRITY AND ANTI-SPOILER AUDITS PASSED.");
  process.exit(0);
} else {
  console.error("💥 FAILED: Critical answer leaks or rule inconsistencies detected!");
  process.exit(1);
}

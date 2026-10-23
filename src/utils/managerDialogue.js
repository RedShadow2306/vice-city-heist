/**
 * managerDialogue.js  –  Bank Manager Reaction & Directive Engine
 *
 * The Bank Manager (Gordon Bennett) speaks to the player (his Assistant)
 * dynamically reacting to the current password and providing urgent directives
 * WITHOUT EVER SPOILING OR LEAKING THE RAW ANSWERS.
 */

export function getManagerDirective(rule, pw, session = {}, cfg = {}) {
  if (!rule) {
    return {
      mood: "urgent",
      headline: "START TYPING, ROOKIE!",
      speech: "Tommy Vercetti's thermal drill is already spinning at the lobby doors! Type in an initial master password so the security encryption can initialize!",
    };
  }

  // 1. If rule defines a custom manager speech, use it directly
  if (rule.managerSpeech) {
    const speech = typeof rule.managerSpeech === "function"
      ? rule.managerSpeech(pw, cfg)
      : rule.managerSpeech;
    return {
      mood: rule.mood || "demanding",
      headline: rule.headline || "SECURITY DIRECTIVE:",
      speech,
    };
  }

  const pwLen = [...pw].length;
  const digits = (pw.match(/\d/g) || []).map(Number);
  const currentSum = digits.reduce((a, b) => a + b, 0);
  const uppers = (pw.match(/[A-Z]/g) || []).length;

  // 2. Dynamic guidance based on rule characteristics or general types
  if (rule.category === "Length" || rule.id === 1) {
    return {
      mood: "panicked",
      headline: "TOO SHORT, ROOKIE!",
      speech: `That's way too short, rookie! Tommy's decryption brute-forcer will crack that in two seconds! Give me at least ${cfg.minLength || 10} characters! (Currently: ${pwLen}/${cfg.minLength || 10})`,
    };
  }

  if (rule.category === "Digits" || rule.id === 2) {
    return {
      mood: "demanding",
      headline: "WE NEED NUMBERS!",
      speech: "That's all letters! The tumbler lock requires numerical pressure—insert at least one vault digit from 0 to 9!",
    };
  }

  if (rule.category === "Uppercase" || rule.id === 3) {
    return {
      mood: "demanding",
      headline: "NOT SECURE ENOUGH!",
      speech: `It's not secure enough, kid! Tommy's syndicate uses rainbow tables! Add at least ${cfg.minUpper || 2} capital letters to strengthen the cipher! (Currently: ${uppers}/${cfg.minUpper || 2})`,
    };
  }

  if (rule.category === "Special Characters" || rule.id === 4) {
    return {
      mood: "urgent",
      headline: "ADD SPECIAL SYMBOLS!",
      speech: "Scramble their electronic probes! Throw in at least one special security symbol like ! @ # $ % & *!",
    };
  }

  if (rule.category === "Digit Sum" || rule.id === 5) {
    return {
      mood: "calculating",
      headline: "CHECK THE ARITHMETIC LOCK!",
      speech: `Wait, look at the cipher dial! The digits in your password must mathematically add up to exactly ${cfg.digitSumTarget || 25}! Right now your digits sum to ${currentSum}! Adjust the numbers!`,
    };
  }

  if (rule.category === "Calendar" || rule.id === 6) {
    return {
      mood: "demanding",
      headline: "AUDIT CALENDAR REQUIRED!",
      speech: "The bank mainframe was logged under an annual schedule! Include the full English name of any month of the year!",
    };
  }

  if (rule.category === "Roman Numerals" || rule.id === 7) {
    return {
      mood: "urgent",
      headline: "ROMAN NUMERAL LOCK!",
      speech: `Quick, look at secondary deadbolt #${session.romanTarget?.num || 9}! We need its Roman numeral notation! Work it out and punch it in!`,
    };
  }

  // 3. For any other riddle, puzzle, or cipher: Provide atmospheric tactical directives without giveaways
  return {
    mood: rule.isRiddle ? "calculating" : "urgent",
    headline: rule.headline || "CRITICAL DIRECTIVE:",
    speech: `Assistant! Tommy's drill is biting into layer ${rule.id}! Solve the security condition before the blast gate collapses! Stay focused!`,
  };
}

export const MANAGER_PRAISE = [
  "That's it, kid! That locked another tumbler! But Tommy's drill just kicked up to high gear—now listen closely:",
  "Great job, rookie! That layer's sealed tight! But Tommy's crew is planting C4—here's the next condition:",
  "Brilliant thinking! You bought us extra time! Keep going, the mainframe is demanding another layer:",
  "Boom! Lock engaged! Stay sharp, Tommy's shouting orders outside the door—now we need:",
];

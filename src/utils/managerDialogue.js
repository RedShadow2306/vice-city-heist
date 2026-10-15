/**
 * managerDialogue.js  –  Bank Manager Reaction & Directive Engine
 *
 * The Bank Manager (Gordon Bennett) speaks to the player (his Assistant)
 * dynamically reacting to the current password and providing urgent directives.
 */

export function getManagerDirective(rule, pw, session, cfg) {
  if (!rule) {
    return {
      mood: "urgent",
      headline: "START TYPING, KID!",
      speech: "Tommy Vercetti's thermal drill is already spinning at the lobby doors! Type in an initial master password so the security encryption can initialize!",
    };
  }

  const pwLen = [...pw].length;
  const digits = (pw.match(/\d/g) || []).map(Number);
  const currentSum = digits.reduce((a, b) => a + b, 0);
  const uppers = (pw.match(/[A-Z]/g) || []).length;

  switch (rule.id) {
    case 1:
      return {
        mood: "panicked",
        headline: "TOO SHORT, KID!",
        speech: `That's way too short, rookie! Tommy's decryption brute-forcer will crack that in two seconds! Give me at least ${cfg.minLength} characters! (Currently: ${pwLen}/${cfg.minLength})`,
      };

    case 2:
      return {
        mood: "demanding",
        headline: "WE NEED NUMBERS!",
        speech: "That's all letters! The tumbler lock requires numerical pressure—insert at least one vault digit from 0 to 9!",
      };

    case 3:
      return {
        mood: "demanding",
        headline: "NOT SECURE ENOUGH!",
        speech: `It's not secure enough, kid! Tommy's syndicate uses rainbow tables! Add at least ${cfg.minUpper} capital letters to strengthen the cipher! (Currently: ${uppers}/${cfg.minUpper})`,
      };

    case 4:
      return {
        mood: "urgent",
        headline: "ADD SPECIAL SYMBOLS!",
        speech: "Scramble their electronic probes! Throw in at least one special security symbol like ! @ # $ % & *!",
      };

    case 5:
      return {
        mood: "calculating",
        headline: "CHECK THE ARITHMETIC LOCK!",
        speech: `Wait, look at the cipher dial! The digits in your password have to mathematically add up to exactly ${cfg.digitSumTarget}! Right now your digits sum to ${currentSum}! Adjust the numbers!`,
      };

    case 6:
      return {
        mood: "demanding",
        headline: "AUDIT CALENDAR REQUIRED!",
        speech: "The bank mainframe was logged under an annual schedule! Include the full English name of any month (like October, May, or June)!",
      };

    case 7:
      return {
        mood: "urgent",
        headline: "ROMAN NUMERAL LOCK!",
        speech: `Quick, look at secondary deadbolt #${session.romanTarget.num}! We need its Roman numeral: "${session.romanTarget.roman}"! Punch it in!`,
      };

    case 8:
      return {
        mood: "demanding",
        headline: "AUTHORIZE OUR SYNDICATE!",
        speech: `The bank's emergency insurance contractor requires our syndicate keyword! Type "${session.sponsor}" into the passphrase!`,
      };

    case 9:
      return {
        mood: "panicked",
        headline: "BIOMETRIC CAPTCHA VERIFICATION!",
        speech: `Look at the retinal security monitor! The security chip flashes "${session.captcha}"! Enter that 5-letter code in exact uppercase!`,
      };

    case 10:
      return {
        mood: "calculating",
        headline: "PRIME NUMBERS PROTOCOL!",
        speech: `The vault logic circuit needs mathematical primes! Add at least ${cfg.primeCountReq} prime digit(s) (2, 3, 5, or 7)!`,
      };

    case 11:
      return {
        mood: "urgent",
        headline: "BULLION ELEMENT CODE!",
        speech: `Our deep deposit holds ${session.element.name}! Insert its chemical element symbol: "${session.element.sym}"!`,
      };

    case 12:
      return {
        mood: "panicked",
        headline: "WHERE IS THE MASTER KEY?!",
        speech: "Quick, enter our vault master clearance keyword 'KEY' in capital letters! Don't let them bypass it!",
      };

    case 13:
      return {
        mood: "demanding",
        headline: "FESTIVAL EPOCH YEAR!",
        speech: "The central server timestamp needs the current fest year (2026) in Roman numerals: type 'MMXXVI'!",
      };

    case 14:
      return {
        mood: "urgent",
        headline: "COASTAL ESCAPE ROUTE!",
        speech: "Listen, the getaway squad is watching Ocean Drive! Include our coastal boulevard keyword 'OCEAN'!",
      };

    case 15:
      return {
        mood: "panicked",
        headline: "DISPATCH TWIN SURVEILLANCE!",
        speech: "Tommy's squad is advancing through the teller stalls! Station our twin patrol unit code — type two zeros '00'!",
      };

    case 16:
      return {
        mood: "calculating",
        headline: "FOREIGN EXCHANGE ROUTING!",
        speech: `What's the capital of ${session.geo.country}? Quick, type "${session.geo.capital}" into the routing cipher!`,
      };

    case 17:
      return {
        mood: "demanding",
        headline: "PHONETIC SYNTHESIZER VOWELS!",
        speech: `The acoustic voice locks need resonance! Include at least ${cfg.vowelCountReq} uppercase vowels (A, E, I, O, U)!`,
      };

    case 18:
      return {
        mood: "calculating",
        headline: "BINARY SWITCH CODE!",
        speech: "Flip the secondary mainframe relay! What's the number 2 in binary? Type '10'!",
      };

    case 19:
      return {
        mood: "demanding",
        headline: "CHESS GRANDMASTER LOCK!",
        speech: "The old bank president was obsessed with chess! Type a checkmate notation: 'Q#' or 'N#'!",
      };

    case 20:
      return {
        mood: "urgent",
        headline: "PALINDROME ENCRYPTION!",
        speech: "Throw Tommy's code-crackers off! Insert a 4-letter palindrome like 'noon' or 'deed'!",
      };

    case 21:
      return {
        mood: "panicked",
        headline: "THE THERMAL DRILL IS OVERHEATING!",
        speech: "The vault door hinges are glowing red! Inject the vault coolant formula: type 'H2O'!",
      };

    case 22:
      return {
        mood: "urgent",
        headline: "EMERGENCY COLOR SWATCH!",
        speech: `Match the vault strobe sensor! Type the 3-letter hex code "${session.swatch.hex}"!`,
      };

    case 23:
      return {
        mood: "demanding",
        headline: "HALON GAS SUPPRESSION!",
        speech: "Arm the fire suppression tanks! Type the name of a noble gas: 'neon', 'argon', or 'krypton'!",
      };

    case 24:
      return {
        mood: "calculating",
        headline: "ENCAPSULATE IN BRACKETS!",
        speech: "Wrap the encryption payload! Enclose characters between square brackets [ and ]!",
      };

    case 25:
      return {
        mood: "urgent",
        headline: "THIS IS A BANK, ROOKIE!",
        speech: "Put some real currency in there! Add a currency symbol: $, €, £, ¥, or ₹!",
      };

    case 26:
      return {
        mood: "demanding",
        headline: "DIGITAL LOGIC GATE!",
        speech: "Engage the digital gate arrays! Type 'NAND', 'NOR', or 'XOR' in capital letters!",
      };

    case 27:
      return {
        mood: "urgent",
        headline: "VICE CITY SYNTH CHORD!",
        speech: "Tune the acoustic harmonic scanner! Type an 80s synth chord: 'Am' or 'Em'!",
      };

    case 28:
      return {
        mood: "calculating",
        headline: "SATELLITE ORBIT RELAY!",
        speech: "The satellite uplink needs planetary alignment! Type the largest planet: 'jupiter'!",
      };

    case 29:
      return {
        mood: "urgent",
        headline: "SERVER HANDSHAKE OK!",
        speech: "Send the HTTP status acknowledgement! Type 'OK' in capital letters!",
      };

    case 30:
      return {
        mood: "calculating",
        headline: "DNA BIOMETRIC CODON!",
        speech: "The vault's genetic scanner is asking for the universal start codon! Type 'ATG'!",
      };

    case 31:
      return {
        mood: "panicked",
        headline: "SEAL THE CIPHER ARCHIVE!",
        speech: "Tommy's crowbar is at the door! Seal the encrypted vault archive with file extension '.enc'!",
      };

    case 32:
      return {
        mood: "demanding",
        headline: "MATHEMATICAL OPERATORS!",
        speech: "The equation must balance! Include both '+' and '=' operators!",
      };

    case 33:
      return {
        mood: "demanding",
        headline: "NO GAPS IN THE WIRE!",
        speech: "Spaces create vulnerabilities in the protocol! Remove every single space character!",
      };

    case 34:
      return {
        mood: "calculating",
        headline: "BOOKEND SYMMETRY!",
        speech: "Mirror the perimeter! Make sure the very first character and very last character match!",
      };

    case 35:
      return {
        mood: "urgent",
        headline: "FINAL PARITY BALANCE!",
        speech: "This is it, kid! Final layer! The total length of the master password must be an EVEN number!",
      };

    default:
      return {
        mood: "urgent",
        headline: "STRENGTHEN THE CIPHER!",
        speech: "Keep going, kid! Satisfy the mainframe conditions before Tommy burns through the doors!",
      };
  }
}

export const MANAGER_PRAISE = [
  "That's it, kid! That locked another tumbler! But Tommy's drill just kicked up to high gear—now listen closely:",
  "Great job, rookie! That layer's sealed tight! But Tommy's crew is planting C4—here's the next condition:",
  "Brilliant thinking! You bought us extra time! Keep going, the mainframe is demanding another layer:",
  "Boom! Lock engaged! Stay sharp, Tommy's shouting orders outside the door—now we need:",
];

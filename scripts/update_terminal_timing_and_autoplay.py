"""
update_terminal_timing_and_autoplay.py
"""
import os

PLAYER_TERMINAL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "pages", "PlayerTerminal.jsx")
SERVER_CJS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "admin_server", "server.cjs")

with open(PLAYER_TERMINAL_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize CRLF to LF for manipulation
is_crlf = "\r\n" in content
content = content.replace("\r\n", "\n")

# 1. Update INTERMISSION_STORIES using slice
start = content.find('const INTERMISSION_STORIES = {')
end = content.find('};\n\n/* ─── Vault Breach Surveillance Snapshots', start) + 2
assert start != -1 and end != -1, "INTERMISSION_STORIES bounds not found"

stories_new = '''const INTERMISSION_STORIES = {
  1: {
    timeJump: "THREE DAYS LATER IN VICE CITY...",
    timeJumpSub: "TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!",
    headline: "TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!",
    location: "🌴 THREE DAYS LATER IN VICE CITY... 🌴",
    story: "Word on Ocean Beach is Tommy Vercetti trashed the Malibu Club in a blind fury after being repelled at the Tellers Gate! He refused to accept defeat! He regrouped his syndicate, acquired high-yield thermal drills, and is storming the Executive Cash Corridors right now!",
    mood: "ALARMED",
    speech: '"ROOKIE! HE DIDN\\'T ACCEPT HIS LOSS! He\\'s drilling twice as fast—we need to calibrate 18 cipher layers simultaneously in 13 minutes! Move to Level 2 Executive Corridors NOW!"',
    cta: "ENGAGE LEVEL 2 DEFENSE (18 RULES · 13m) ➔",
    targetLevel: 2,
  },
  2: {
    timeJump: "ONE WEEK LATER... STARFISH ISLAND",
    timeJumpSub: "VERCETTI\\'S ALL-OUT ASSAULT ON THE DEEP VAULT!",
    headline: "THE FINAL SIEGE: VERCETTI\\'S ALL-OUT ASSAULT ON THE DEEP VAULT!",
    location: "🌴 ONE WEEK LATER... STARFISH ISLAND 🌴",
    story: "Furious after two failed attempts, Tommy Vercetti deployed an industrial laser drill directly into the Sub-Level Titanium Deep Vault! This is his last, most desperate heist attempt!",
    mood: "DESPERATE",
    speech: '"HOLD THE LINE, ASSISTANT! All 21 security layers must be locked simultaneously in 11 minutes! If you fail, the bank\\'s entire gold reserve is his! SECURE THE TITANIUM VAULT!"',
    cta: "DEPLOY LEVEL 3 MAXIMUM CIPHER (21 RULES · 11m) ➔",
    targetLevel: 3,
  },
  3: {
    timeJump: "FORTY-EIGHT HOURS LATER: OMEGA CORE ALERT",
    timeJumpSub: "CODE RED: OMEGA QUANTUM SANCTUM UNDER ATTACK!",
    headline: "CODE RED: OMEGA QUANTUM CORE UNDER DIRECT ASSAULT!",
    location: "🌴 MIDNIGHT IN VICE CITY... 🌴",
    story: "Repelled from the Titanium Deep Vault, Tommy Vercetti deployed military-grade diamond plasma cutters and cyber-jamming arrays into the subterranean Omega Quantum Sanctum! If this final core breaches, Vice City\\'s entire treasury will be wiped out!",
    mood: "MAXIMUM CRISIS",
    speech: '"OFFICER! HE PENETRATED THE OMEGA QUANTUM CORE! 26 ultra-cryptographic lock tumblers must now be calibrated simultaneously in under 9 minutes! His drill is operating at overdrive! STAND FIRM AND ENGAGE THE OMEGA CIPHER!"',
    cta: "ENGAGE LEVEL 4 OMEGA CIPHER (26 RULES · 9m) ➔",
    targetLevel: 4,
  },
};'''

content = content[:start] + stories_new + content[end:]

# 2. Update Autoplay Effects to prevent premature stop on re-renders
ap_start = content.find('  /* Auto-play Manager Voice upon entering briefing / intermissions / victory / defeat */')
ap_end = content.find('  /* Timer Ref & Fullscreen Helpers */', ap_start)
assert ap_start != -1 and ap_end != -1, "Autoplay bounds not found"

autoplay_new = '''  /* Auto-play Manager Voice upon entering briefing / intermissions / victory / defeat */
  const prevScreenRef = useRef(null);
  useEffect(() => {
    if (prevScreenRef.current === screen) return;
    prevScreenRef.current = screen;

    if (screen === "briefing") {
      playManagerVoice("intro");
    } else if (screen === "end") {
      playManagerVoice("victory");
    } else if (screen === "mission_failed" || screen === "wasted_cinematic" || screen === "wasted_slideshow") {
      playManagerVoice("defeat");
    } else if (screen !== "story_slideshow") {
      stopManagerVoice();
    }
  }, [screen, playManagerVoice, stopManagerVoice]);

  const prevSlideshowKeyRef = useRef(null);
  useEffect(() => {
    if (screen !== "story_slideshow") {
      prevSlideshowKeyRef.current = null;
      return;
    }
    const currentKey = `${storySlideshow.levelCleared}_${storySlideshow.stage}`;
    if (prevSlideshowKeyRef.current === currentKey) return;
    prevSlideshowKeyRef.current = currentKey;

    if (storySlideshow.stage === "briefing") {
      playManagerVoice(`intermission_${storySlideshow.levelCleared}`);
    } else {
      stopManagerVoice();
    }
  }, [screen, storySlideshow.stage, storySlideshow.levelCleared, playManagerVoice, stopManagerVoice]);\n\n'''

content = content[:ap_start] + autoplay_new + content[ap_end:]

# 3. Update timeLeft initial useState from 600 to CAMPAIGN_LEVELS[1].startSeconds (900)
content = content.replace('const [timeLeft, setTimeLeft] = useState(600); // 10:00 minutes', 'const [timeLeft, setTimeLeft] = useState(() => CAMPAIGN_LEVELS[1]?.startSeconds || 900);', 1)

# 4. Update launchStoryMode and handleCutsceneDone to set 900s
launch_target = '''      setCurrentLevel(1);
      setVaultDoorState("locked");'''
launch_replacement = '''      setCurrentLevel(1);
      setTimeLeft(CAMPAIGN_LEVELS[1].startSeconds);
      timeLeftRef.current = CAMPAIGN_LEVELS[1].startSeconds;
      setVaultDoorState("locked");'''
assert launch_target in content, "Launch target not found"
content = content.replace(launch_target, launch_replacement, 1)

done_target = '''  const handleCutsceneDone = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    if (soundEnabled) SoundEngine.playClick();
    setScreen("briefing");'''
done_replacement = '''  const handleCutsceneDone = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    SoundEngine.resume();
    if (soundEnabled) SoundEngine.playClick();
    setTimeLeft(CAMPAIGN_LEVELS[1].startSeconds);
    timeLeftRef.current = CAMPAIGN_LEVELS[1].startSeconds;
    setScreen("briefing");'''
assert done_target in content, "Done target not found"
content = content.replace(done_target, done_replacement, 1)

# 5. Make the briefing param chips and badge dynamic to current floor cfg
chips_start = content.find('                <div className="briefing-param-chips">')
chips_end = content.find('                <div className="gba-prompt-arrow blink">▼</div>', chips_start)
assert chips_start != -1 and chips_end != -1, "Chips bounds not found"

chips_new = '''                <div className="briefing-param-chips">
                  <div className="param-chip">
                    <span className="param-icon">⏱️</span>
                    <div className="param-text">
                      <span className="param-label">TIME LIMIT</span>
                      <span className="param-val">{Math.floor(cfg.startSeconds / 60)} MINUTES</span>
                    </div>
                  </div>
                  <div className="param-chip">
                    <span className="param-icon">🔒</span>
                    <div className="param-text">
                      <span className="param-label">DEFENSE PROTOCOL</span>
                      <span className="param-val">{cfg.rules} CIPHER LAYERS</span>
                    </div>
                  </div>
                  <div className="param-chip">
                    <span className="param-icon">🔥</span>
                    <div className="param-text">
                      <span className="param-label">OPPOSITION</span>
                      <span className="param-val">TOMMY VERCETTI</span>
                    </div>
                  </div>
                </div>\n\n'''

content = content[:chips_start] + chips_new + content[chips_end:]

badge_old = '<span className="time-limit-badge">⏱️ 15:00 TIMER · FLOOR 1</span>'
badge_new = '<span className="time-limit-badge">⏱️ {Math.floor(cfg.startSeconds / 60)}:00 TIMER · FLOOR {currentLevel}</span>'
if badge_old in content:
    content = content.replace(badge_old, badge_new, 1)

if is_crlf:
    content = content.replace("\n", "\r\n")

with open(PLAYER_TERMINAL_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("[OK] PlayerTerminal.jsx updated successfully!")

# Update admin_server/server.cjs
with open(SERVER_CJS_PATH, "r", encoding="utf-8") as f:
    s_content = f.read()

s_content = s_content.replace('timeLeft: 600,', 'timeLeft: 900,', 1)
with open(SERVER_CJS_PATH, "w", encoding="utf-8") as f:
    f.write(s_content)

print("[OK] admin_server/server.cjs updated default timeLeft to 900s!")

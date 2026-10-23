"""
update_terminal_voice.py
Applies Manager Gordon Bennett Voiceover integration to PlayerTerminal.jsx
"""
import os
import re

FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "pages", "PlayerTerminal.jsx")

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add manager voice state and control callbacks
state_target = '  const [soundEnabled, setSoundEnabled] = useState(true);'
state_replacement = '''  const [soundEnabled, setSoundEnabled] = useState(true);

  /* Manager Gordon Bennett AI Neural Voiceover State */
  const [isManagerSpeaking, setIsManagerSpeaking] = useState(false);
  const [activeVoiceKey, setActiveVoiceKey] = useState(null);

  const playManagerVoice = useCallback((key) => {
    if (!soundEnabled) return;
    setActiveVoiceKey(key);
    SoundEngine.playManagerVoice(key, {
      onStart: () => setIsManagerSpeaking(true),
      onEnded: () => {
        setIsManagerSpeaking(false);
        setActiveVoiceKey(null);
      },
      onError: () => {
        setIsManagerSpeaking(false);
        setActiveVoiceKey(null);
      },
    });
  }, [soundEnabled]);

  const stopManagerVoice = useCallback(() => {
    SoundEngine.stopManagerVoice();
    setIsManagerSpeaking(false);
    setActiveVoiceKey(null);
  }, []);

  const toggleManagerVoice = useCallback((key) => {
    if (isManagerSpeaking && activeVoiceKey === key) {
      stopManagerVoice();
    } else {
      playManagerVoice(key);
    }
  }, [isManagerSpeaking, activeVoiceKey, playManagerVoice, stopManagerVoice]);'''

assert state_target in content, "State target not found"
content = content.replace(state_target, state_replacement, 1)

# 2. Add auto-playback effects
effect_target = '''        return () => clearTimeout(timer);
      }
    }
  }, [screen, storySlideshow.stage, isPreviewMode, soundEnabled]);'''

effect_replacement = '''        return () => clearTimeout(timer);
      }
    }
  }, [screen, storySlideshow.stage, isPreviewMode, soundEnabled]);

  /* Auto-play Manager Voice upon entering briefing / intermissions / victory / defeat */
  useEffect(() => {
    if (screen === "briefing") {
      playManagerVoice("intro");
    } else if (screen === "end") {
      playManagerVoice("victory");
    } else if (screen === "mission_failed" || screen === "wasted_cinematic" || screen === "wasted_slideshow") {
      playManagerVoice("defeat");
    } else if (screen !== "story_slideshow") {
      stopManagerVoice();
    }
    return () => {
      if (screen !== "story_slideshow") {
        stopManagerVoice();
      }
    };
  }, [screen, playManagerVoice, stopManagerVoice]);

  useEffect(() => {
    if (screen === "story_slideshow") {
      if (storySlideshow.stage === "briefing") {
        playManagerVoice(`intermission_${storySlideshow.levelCleared}`);
      } else {
        stopManagerVoice();
      }
    }
  }, [screen, storySlideshow.stage, storySlideshow.levelCleared, playManagerVoice, stopManagerVoice]);'''

assert effect_target in content, "Effect target not found"
content = content.replace(effect_target, effect_replacement, 1)

# 3. Stop manager voice when active defense starts
defense_target = '''  /* ── Start Active Defense on Current Level ── */
  const handleStartActiveDefense = (levelToStart) => {
    requestFullscreenSafe();'''

defense_replacement = '''  /* ── Start Active Defense on Current Level ── */
  const handleStartActiveDefense = (levelToStart) => {
    stopManagerVoice();
    requestFullscreenSafe();'''

assert defense_target in content, "Defense target not found"
content = content.replace(defense_target, defense_replacement, 1)

# 4. Update screen === "briefing"
briefing_old = '''              {/* Left Comms Bay: Manager Gordon Bennett Portrait with Radar Ring & Live Soundwaves */}
              <div className="gba-manager-slide-container slide-in">
                <div className="manager-comms-bay">
                  <div className="manager-portrait-frame speaking">
                    <img src={managerImgSrc} alt="Bank Manager Gordon Bennett" className="manager-portrait-img" />
                    <div className="manager-radar-ring" aria-hidden="true" />
                  </div>
                  <div className="manager-comms-telemetry">
                    <span className="telemetry-name">GORDON BENNETT</span>
                    <span className="telemetry-role">MANAGING DIRECTOR</span>
                    <div className="telemetry-soundwave" aria-hidden="true">
                      <span className="sw-bar b1" />
                      <span className="sw-bar b2" />
                      <span className="sw-bar b3" />
                      <span className="sw-bar b4" />
                      <span className="sw-bar b5" />
                    </div>
                    <span className="telemetry-freq">RF: 142.85 MHz [LIVE]</span>
                  </div>
                </div>
              </div>

              {/* Right Directives Bay: High-Tech Mission Message */}
              <div className="gba-dialogue-box">
                <div className="gba-nameplate">
                  <div className="gba-speaker-info">
                    <span className="speaker-icon">👔</span>
                    <span className="speaker-title">MANAGER GORDON BENNETT</span>
                  </div>
                  <span className="gba-mood-chip urgent">⚠️ PANICKED // PRIORITY ALPHA</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "ASSISTANT! Tommy Vercetti and his crew just blasted through the lobby! Tommy has a 10-minute timer per floor before each blast gate breaches! You must set an unbreakable cipher on this terminal immediately! Every suggestion you make, I will verify the security protocols!"
                  </p>
                </div>'''

briefing_new = '''              {/* Left Comms Bay: Manager Gordon Bennett Portrait with Radar Ring & Live Soundwaves */}
              <div className="gba-manager-slide-container slide-in">
                <div className="manager-comms-bay">
                  <div className={`manager-portrait-frame ${isManagerSpeaking ? "speaking" : ""}`}>
                    <img src={managerImgSrc} alt="Bank Manager Gordon Bennett" className="manager-portrait-img" />
                    <div className="manager-radar-ring" aria-hidden="true" />
                  </div>
                  <div className="manager-comms-telemetry">
                    <span className="telemetry-name">GORDON BENNETT</span>
                    <span className="telemetry-role">MANAGING DIRECTOR</span>
                    <div className={`telemetry-soundwave ${isManagerSpeaking ? "active" : ""}`} aria-hidden="true">
                      <span className="sw-bar b1" />
                      <span className="sw-bar b2" />
                      <span className="sw-bar b3" />
                      <span className="sw-bar b4" />
                      <span className="sw-bar b5" />
                    </div>
                    <span className="telemetry-freq">RF: 142.85 MHz [{isManagerSpeaking ? "TRANSMITTING" : "LIVE"}]</span>
                  </div>
                </div>
              </div>

              {/* Right Directives Bay: High-Tech Mission Message */}
              <div className="gba-dialogue-box">
                <div className="gba-nameplate">
                  <div className="gba-speaker-info">
                    <span className="speaker-icon">👔</span>
                    <span className="speaker-title">MANAGER GORDON BENNETT</span>
                  </div>
                  <span className="gba-mood-chip urgent">⚠️ PANICKED // PRIORITY ALPHA</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "ASSISTANT! Tommy Vercetti and his crew just blasted through the lobby! Tommy has an armed crew drilling before each blast gate breaches! You must set an unbreakable cipher on this terminal immediately! Every suggestion you make, I will verify the security protocols! Move fast!"
                  </p>
                </div>

                {/* Voiceover Replay & Live Status Controls */}
                <div className="gba-voice-telemetry-row">
                  <button
                    type="button"
                    className={`gba-voice-btn ${isManagerSpeaking && activeVoiceKey === "intro" ? "speaking" : ""}`}
                    onClick={() => toggleManagerVoice("intro")}
                    title={isManagerSpeaking && activeVoiceKey === "intro" ? "Pause Bennett's voice transmission" : "Play / Replay Bennett's voice transmission"}
                  >
                    <span className="voice-wave-icon">{isManagerSpeaking && activeVoiceKey === "intro" ? "🔊" : "▶"}</span>
                    <span className="voice-status-text">
                      {isManagerSpeaking && activeVoiceKey === "intro" ? "COMM TRANSMISSION LIVE..." : "REPLAY VOICE TRANSMISSION"}
                    </span>
                    {isManagerSpeaking && activeVoiceKey === "intro" && (
                      <span className="mini-live-wave">
                        <span className="lw1" /><span className="lw2" /><span className="lw3" />
                      </span>
                    )}
                  </button>
                  <span className="voice-audio-tag">AI COMM · 142.85 MHz</span>
                </div>'''

assert briefing_old in content, "Briefing old not found"
content = content.replace(briefing_old, briefing_new, 1)

# Also update the 10:00 timer labels on screen === "briefing" to match Level 1's 15:00
content = content.replace('<span className="time-limit-badge">⏱️ 10:00 TIMER PER FLOOR</span>', '<span className="time-limit-badge">⏱️ 15:00 TIMER · FLOOR 1</span>', 1)
content = content.replace('<span className="param-val">10 MINUTES</span>', '<span className="param-val">15 MINUTES</span>', 1)

# 5. Update story_slideshow GBA dialogue box
slideshow_old = '''              <div className="gba-interactive-wrapper briefing-gba">
                <div className="gba-manager-slide-container slide-in">
                  <div className="manager-portrait-frame speaking">
                    <img src={managerImgSrc} alt="Bank Manager" className="manager-portrait-img" />
                  </div>
                </div>

                <div className="gba-dialogue-box">
                  <div className="gba-nameplate">
                    <span>👔 MANAGER GORDON BENNETT</span>
                    <span className="gba-mood-chip urgent">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.mood}
                    </span>
                  </div>
                  <div className="gba-text-content">
                    <p className="gba-typewriter-text">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.speech}
                    </p>
                  </div>
                  <div className="gba-prompt-arrow blink">▼</div>
                </div>
              </div>'''

slideshow_new = '''              <div className="gba-interactive-wrapper briefing-gba">
                <div className="gba-manager-slide-container slide-in">
                  <div className={`manager-portrait-frame ${isManagerSpeaking ? "speaking" : ""}`}>
                    <img src={managerImgSrc} alt="Bank Manager" className="manager-portrait-img" />
                  </div>
                </div>

                <div className="gba-dialogue-box">
                  <div className="gba-nameplate">
                    <span>👔 MANAGER GORDON BENNETT</span>
                    <span className="gba-mood-chip urgent">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.mood}
                    </span>
                  </div>
                  <div className="gba-text-content">
                    <p className="gba-typewriter-text">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.speech}
                    </p>
                  </div>

                  {/* Voiceover Replay & Live Status Controls */}
                  <div className="gba-voice-telemetry-row">
                    <button
                      type="button"
                      className={`gba-voice-btn ${isManagerSpeaking && activeVoiceKey === `intermission_${storySlideshow.levelCleared}` ? "speaking" : ""}`}
                      onClick={() => toggleManagerVoice(`intermission_${storySlideshow.levelCleared}`)}
                      title="Play / Replay Bennett's voice briefing"
                    >
                      <span className="voice-wave-icon">{isManagerSpeaking && activeVoiceKey === `intermission_${storySlideshow.levelCleared}` ? "🔊" : "▶"}</span>
                      <span className="voice-status-text">
                        {isManagerSpeaking && activeVoiceKey === `intermission_${storySlideshow.levelCleared}` ? "COMM TRANSMISSION LIVE..." : "REPLAY VOICE TRANSMISSION"}
                      </span>
                      {isManagerSpeaking && activeVoiceKey === `intermission_${storySlideshow.levelCleared}` && (
                        <span className="mini-live-wave">
                          <span className="lw1" /><span className="lw2" /><span className="lw3" />
                        </span>
                      )}
                    </button>
                    <span className="voice-audio-tag">AI COMM · 142.85 MHz</span>
                  </div>

                  <div className="gba-prompt-arrow blink">▼</div>
                </div>
              </div>'''

assert slideshow_old in content, "Slideshow old not found"
content = content.replace(slideshow_old, slideshow_new, 1)

# 6. Update victory screen (screen === "end")
end_old = '''            <p className="victory-speech">
              Manager Bennett: <em>"UNBELIEVABLE! You defended all 4 security vaults across 40 minutes of intense siege! The Omega Quantum Vault is permanently clamped shut, and VCPD SWAT arrested Vercetti's crew! By order of the Board, you are hereby appointed LEGENDARY GRAND DEFENDER OF VICE CITY!"</em>
            </p>'''

end_new = '''            <p className="victory-speech">
              Manager Bennett: <em>"UNBELIEVABLE! You defended all 4 security vaults across 40 minutes of intense siege! The Omega Quantum Vault is permanently clamped shut, and VCPD SWAT arrested Vercetti's crew! By order of the Board, you are hereby appointed LEGENDARY GRAND DEFENDER OF VICE CITY!"</em>
            </p>

            <div className="victory-voice-row" style={{ marginTop: "14px", marginBottom: "18px", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                className={`gba-voice-btn victory-voice-btn ${isManagerSpeaking && activeVoiceKey === "victory" ? "speaking" : ""}`}
                onClick={() => toggleManagerVoice("victory")}
              >
                <span className="voice-wave-icon">{isManagerSpeaking && activeVoiceKey === "victory" ? "🔊" : "🏆"}</span>
                <span className="voice-status-text">
                  {isManagerSpeaking && activeVoiceKey === "victory" ? "BENNETT COMMENDATION PLAYING..." : "REPLAY BENNETT'S VICTORY SPEECH"}
                </span>
                {isManagerSpeaking && activeVoiceKey === "victory" && (
                  <span className="mini-live-wave">
                    <span className="lw1" /><span className="lw2" /><span className="lw3" />
                  </span>
                )}
              </button>
            </div>'''

assert end_old in content, "End old not found"
content = content.replace(end_old, end_new, 1)

# 7. Update wasted actions row with distress call button
wasted_old = '''                    🏠 RETURN TO WAITING LOBBY (LOCKED AWAITING ADMIN APPROVAL)
                  </button>
                </>'''

wasted_new = '''                    🏠 RETURN TO WAITING LOBBY (LOCKED AWAITING ADMIN APPROVAL)
                  </button>
                  <button
                    type="button"
                    className={`gta-action-btn secondary-btn ${isManagerSpeaking && activeVoiceKey === "defeat" ? "speaking" : ""}`}
                    onClick={() => toggleManagerVoice("defeat")}
                  >
                    {isManagerSpeaking && activeVoiceKey === "defeat" ? "🎙️ DISTRESS CALL PLAYING..." : "🎙️ REPLAY MANAGER DISTRESS CALL"}
                  </button>
                </>'''

assert wasted_old in content, "Wasted old not found"
content = content.replace(wasted_old, wasted_new, 1)

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("PlayerTerminal.jsx updated successfully with Manager Voiceover controls!")

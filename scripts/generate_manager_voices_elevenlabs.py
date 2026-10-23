"""
generate_manager_voices_elevenlabs.py
Generates high-fidelity AI voiceovers for Bank Manager Gordon Bennett using:
1. ElevenLabs API with "Adam - Dominant, Firm" (voice_id: pNInz6obpgDQGcFmaJgB)
   if ELEVENLABS_API_KEY or XI_API_KEY is available (in env, .env, or CLI arg).
2. Edge Neural TTS fallback (en-US-GuyNeural / en-US-ChristopherNeural)
   if ElevenLabs key is not yet supplied.

Both modes include dramatic auto-indentations / pauses ("leave necessary gaps")
between statements using ellipses and punctuation breaks.
Outputs to: public/audio/manager/
"""
import os
import sys
import json
import urllib.request
import urllib.error
import asyncio

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(ROOT_DIR, "public", "audio", "manager")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Adam Voice ID from ElevenLabs
ELEVENLABS_ADAM_VOICE_ID = "pNInz6obpgDQGcFmaJgB"
ELEVENLABS_API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_ADAM_VOICE_ID}"

# Script dialogue with dramatic auto-indentation pauses ("...") for 20 rules / 15m, 13m, 11m, 9m
DIALOGUES = {
    "manager_intro.mp3": (
        "Assistant! ... Tommy Vercetti and his crew just blasted through the lobby! ... "
        "Tommy has an armed syndicate drilling before each blast gate breaches! ... "
        "You have fifteen minutes to solve twenty security cipher layers on this terminal immediately! ... "
        "Every suggestion you make, I will verify the security protocols! ... Move fast!"
    ),
    "manager_intermission_1.mp3": (
        "Rookie! ... He didn't accept his loss! ... "
        "He's drilling twice as fast—we need to calibrate twenty cipher layers simultaneously in thirteen minutes! ... "
        "Move to Level 2 Executive Corridors now!"
    ),
    "manager_intermission_2.mp3": (
        "Hold the line, Assistant! ... "
        "All twenty security layers must be locked simultaneously in eleven minutes! ... "
        "If you fail, the bank's entire gold reserve is his! ... "
        "Secure the Titanium Vault!"
    ),
    "manager_intermission_3.mp3": (
        "Officer! ... He penetrated the Omega Quantum Core! ... "
        "The final twenty ultra-cryptographic lock tumblers must now be calibrated simultaneously in under nine minutes! ... "
        "His drill is operating at overdrive! ... "
        "Stand firm, and engage the Omega cipher!"
    ),
    "manager_victory.mp3": (
        "Unbelievable! ... You defended all four security vaults across forty-eight minutes of intense siege, solving all eighty cipher protocols! ... "
        "The Omega Quantum Vault is permanently clamped shut, and Vice City SWAT arrested Vercetti's crew! ... "
        "By order of the Board, you are hereby appointed Legendary Grand Defender of Vice City!"
    ),
    "manager_defeat.mp3": (
        "We lost the vault! ... "
        "Vercetti's syndicate forced the multi-cipher airlock and emptied the entire bank! ... "
        "Disengage immediately, and await Central Security orders!"
    ),
}

def get_elevenlabs_api_key():
    # 1. Command-line argument
    if len(sys.argv) > 1 and sys.argv[1].strip() and not sys.argv[1].startswith("-"):
        return sys.argv[1].strip()
    
    # 2. Environment variables
    for env_var in ["ELEVENLABS_API_KEY", "XI_API_KEY", "ELEVEN_API_KEY"]:
        val = os.environ.get(env_var, "").strip()
        if val:
            return val
            
    # 3. .env file
    env_file = os.path.join(ROOT_DIR, ".env")
    if os.path.isfile(env_file):
        try:
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip().startswith("#"):
                        continue
                    if "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() in ["ELEVENLABS_API_KEY", "XI_API_KEY", "ELEVEN_API_KEY"]:
                            clean_v = v.strip().strip("'\"")
                            if clean_v:
                                return clean_v
        except Exception:
            pass
            
    return None

def generate_with_elevenlabs(api_key):
    print("==================================================================")
    print("🎙️ GENERATING MANAGER BENNETT VOICE VIA ELEVENLABS (VOICE: ADAM)")
    print(f"   Voice ID: {ELEVENLABS_ADAM_VOICE_ID}")
    print("==================================================================")
    
    for filename, text in DIALOGUES.items():
        out_path = os.path.join(OUTPUT_DIR, filename)
        print(f"\n-> Generating {filename} with ElevenLabs Adam...")
        
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.50,
                "similarity_boost": 0.75,
                "style": 0.35,
                "use_speaker_boost": True
            }
        }
        
        req = urllib.request.Request(
            ELEVENLABS_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "xi-api-key": api_key,
                "Accept": "audio/mpeg"
            }
        )
        
        try:
            with urllib.request.urlopen(req) as resp:
                audio_data = resp.read()
                with open(out_path, "wb") as f_out:
                    f_out.write(audio_data)
                size_kb = len(audio_data) / 1024
                print(f"   [SUCCESS] Saved {filename} ({size_kb:.1f} KB)")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            print(f"   [ERROR] HTTP {e.code}: {err_body}")
            raise e

async def generate_with_edgetts():
    import edge_tts
    voice = "en-US-GuyNeural"
    rate = "+6%"
    pitch = "+1Hz"
    
    print("==================================================================")
    print(f"🎙️ GENERATING MANAGER BENNETT NEURAL VOICEOVER VIA EDGE-TTS ({voice})")
    print("   Formatted with dramatic auto-indentation pauses (20 rules per floor)")
    print("==================================================================")
    
    for filename, text in DIALOGUES.items():
        out_path = os.path.join(OUTPUT_DIR, filename)
        print(f"-> Generating {filename}...")
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        await communicate.save(out_path)
        size_kb = os.path.getsize(out_path) / 1024
        print(f"   [OK] Saved {filename} ({size_kb:.1f} KB)")
        
    print("\n✅ All voice tracks generated successfully with authentic pauses!")

def main():
    api_key = get_elevenlabs_api_key()
    if api_key:
        print(f"Found ElevenLabs API Key: {api_key[:4]}...{api_key[-4:]}")
        try:
            generate_with_elevenlabs(api_key)
            print("\n🎉 ElevenLabs Adam generation completed successfully!")
            return
        except Exception as e:
            print(f"\n⚠️ ElevenLabs generation encountered error: {e}. Falling back to Edge Neural TTS...")
    else:
        print("ℹ️ No ELEVENLABS_API_KEY detected in env, .env, or CLI argument.")
        print("   Generating high-fidelity fallback with Edge Neural TTS with dramatic pauses...")
        print("   (To generate with Adam, provide key: python scripts/generate_manager_voices_elevenlabs.py <your_key>)")
        
    asyncio.run(generate_with_edgetts())

if __name__ == "__main__":
    main()

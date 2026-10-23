"""
generate_manager_voices.py
Generates high-fidelity AI neural voiceovers for Bank Manager Gordon Bennett
using Edge Neural TTS (en-US-GuyNeural / en-US-ChristopherNeural).
Outputs to public/audio/manager/
"""
import os
import asyncio
import edge_tts

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "audio", "manager")
os.makedirs(OUTPUT_DIR, exist_ok=True)

VOICE = "en-US-GuyNeural"
RATE = "+6%"
PITCH = "+1Hz"

DIALOGUES = {
    "manager_intro.mp3": (
        "Assistant! Tommy Vercetti and his crew just blasted through the lobby! "
        "Tommy has an armed syndicate drilling before each blast gate breaches! "
        "You have fifteen minutes to solve fifteen security cipher layers on this terminal immediately! "
        "Every suggestion you make, I will verify the security protocols! Move fast!"
    ),
    "manager_intermission_1.mp3": (
        "Rookie! He didn't accept his loss! "
        "He's drilling twice as fast—we need to calibrate eighteen cipher layers simultaneously in thirteen minutes! "
        "Move to Level 2 Executive Corridors now!"
    ),
    "manager_intermission_2.mp3": (
        "Hold the line, Assistant! "
        "All twenty-one security layers must be locked simultaneously in eleven minutes! "
        "If you fail, the bank's entire gold reserve is his! "
        "Secure the Titanium Vault!"
    ),
    "manager_intermission_3.mp3": (
        "Officer! He penetrated the Omega Quantum Core! "
        "Twenty-six ultra-cryptographic lock tumblers must now be calibrated simultaneously in under nine minutes! "
        "His drill is operating at overdrive! "
        "Stand firm and engage the Omega cipher!"
    ),
    "manager_victory.mp3": (
        "Unbelievable! You defended all four security vaults across forty-eight minutes of intense siege, solving all eighty cipher protocols! "
        "The Omega Quantum Vault is permanently clamped shut, and V C P D SWAT arrested Vercetti's crew! "
        "By order of the Board, you are hereby appointed Legendary Grand Defender of Vice City!"
    ),
    "manager_defeat.mp3": (
        "We lost the vault! Vercetti's syndicate forced the multi-cipher airlock and emptied the entire bank! "
        "Disengage immediately and await Central Security orders!"
    ),
}

async def generate_all():
    print(f"Generating Manager Gordon Bennett neural voiceovers using {VOICE}...")
    for filename, text in DIALOGUES.items():
        out_path = os.path.join(OUTPUT_DIR, filename)
        print(f"-> Generating {filename}...")
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(out_path)
        size_kb = os.path.getsize(out_path) / 1024
        print(f"   [OK] Saved {filename} ({size_kb:.1f} KB)")
    print("All voice tracks generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())

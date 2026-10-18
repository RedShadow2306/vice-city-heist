#!/usr/bin/env python3
import math
import os
from PIL import Image, ImageDraw, ImageFont

def generate_dial_texture(filepath):
    size = (1024, 1024)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512

    # Dial Background Ring
    r_outer = 480
    r_inner = 140
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=(36, 44, 62, 255), outline=(130, 155, 205, 255), width=8)
    draw.ellipse([cx - 430, cy - 430, cx + 430, cy + 430], outline=(90, 115, 160, 255), width=4)

    # Dial Tick Marks
    for i in range(100):
        angle_rad = math.radians(i * 3.6 - 90)
        is_major = (i % 10 == 0)
        is_mid = (i % 5 == 0) and not is_major
        tick_len = 45 if is_major else (28 if is_mid else 16)
        line_w = 6 if is_major else (4 if is_mid else 2)
        color = (255, 255, 255, 255) if is_major else ((200, 220, 250, 240) if is_mid else (140, 165, 205, 200))

        x1 = cx + (r_outer - 15) * math.cos(angle_rad)
        y1 = cy + (r_outer - 15) * math.sin(angle_rad)
        x2 = cx + (r_outer - 15 - tick_len) * math.cos(angle_rad)
        y2 = cy + (r_outer - 15 - tick_len) * math.sin(angle_rad)
        draw.line([x1, y1, x2, y2], fill=color, width=line_w)

    # Dial Numbers: 0, 20, 40, 60, 80
    numbers = [
        (0, -90),
        (20, -18),
        (40, 54),
        (60, 126),
        (80, 198)
    ]
    try:
        font = ImageFont.truetype("arial.ttf", 52)
    except Exception:
        font = ImageFont.load_default()

    for val, deg in numbers:
        angle_rad = math.radians(deg)
        r_text = r_outer - 100
        tx = cx + r_text * math.cos(angle_rad)
        ty = cy + r_text * math.sin(angle_rad)
        text = str(val)
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((tx - tw / 2, ty - th / 2), text, fill=(255, 255, 255, 255), font=font)

    # Center Hub Base
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=(28, 35, 52, 255), outline=(0, 229, 255, 255), width=6)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    img.save(filepath)
    print(f"Generated dial texture: {filepath}")


def generate_plaque_texture(filepath):
    size = (1024, 512)
    img = Image.new("RGBA", size, (16, 22, 34, 255))
    draw = ImageDraw.Draw(img)

    # Outer border with bevel
    draw.rectangle([8, 8, 1015, 503], outline=(54, 68, 99, 255), width=6)
    draw.rectangle([18, 18, 1005, 493], outline=(0, 229, 255, 180), width=3)

    # Rivet screw dots in 4 corners
    for rx, ry in [(40, 40), (984, 40), (40, 472), (984, 472)]:
        draw.ellipse([rx - 12, ry - 12, rx + 12, ry + 12], fill=(140, 160, 190, 255), outline=(40, 50, 70, 255), width=2)

    try:
        font_main = ImageFont.truetype("arial.ttf", 54)
        font_sub = ImageFont.truetype("arial.ttf", 34)
    except Exception:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Main Title
    title = "VICE CITY SAVINGS & LOAN"
    bbox1 = draw.textbbox((0, 0), title, font=font_main)
    tw1 = bbox1[2] - bbox1[0]
    draw.text(((1024 - tw1) / 2, 140), title, fill=(240, 245, 255, 255), font=font_main)

    # Subtitle
    sub = "BIOMETRIC MULTI-LAYER KEY VAULT"
    bbox2 = draw.textbbox((0, 0), sub, font=font_sub)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((1024 - tw2) / 2, 270), sub, fill=(72, 213, 208, 255), font=font_sub)

    # Class ID Tag
    cid = "CLASS-IV TITANIUM HEAVY PROTOCOL"
    bbox3 = draw.textbbox((0, 0), cid, font=font_sub)
    tw3 = bbox3[2] - bbox3[0]
    draw.text(((1024 - tw3) / 2, 340), cid, fill=(143, 163, 199, 200), font=font_sub)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    img.save(filepath)
    print(f"Generated plaque texture: {filepath}")

if __name__ == "__main__":
    tex_dir = r"d:\Association\vice-city-heist\public\models\textures"
    generate_dial_texture(os.path.join(tex_dir, "vault_dial_diffuse.png"))
    generate_plaque_texture(os.path.join(tex_dir, "vault_plaque_diffuse.png"))

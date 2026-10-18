#!/usr/bin/env python3
"""
generate_rich_vault_textures.py
Generates authentic PBR textures matching the exact GTA Vice City bank vault palette
from El Banco Corrupto Grande and vault_neon_bg.jpg:
- Real heavy industrial gunmetal steel (#546274, #68798E, #7E92A9)
- Split Vice City neon atmospheric lighting:
  * Left: Intense Electric Magenta (#F84391 / #E01171 / #A24574)
  * Right: Intense Electric Cyan (#00E5FF / #8DE5E6 / #00BCD4)
- Authentic GTA Vice City industrial warning/hazard plates (Warning Yellow #F59E0B + Jet Black)
- Machined satin chrome combination dial with sharp black engraved numbers (0, 10, 20... 90)
- 24K Gold bullion bars & $10,000 cash stacks
- No cheesy rectangular printed computer text — pure, authentic, heavy industrial vault metal!
"""

import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def create_normal_map_from_height(height_array, strength=3.5):
    h, w = height_array.shape
    sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
    sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float32)

    padded = np.pad(height_array, 1, mode='edge')

    dx = (
        padded[:-2, 2:] * sobel_x[0, 2] + padded[1:-1, 2:] * sobel_x[1, 2] + padded[2:, 2:] * sobel_x[2, 2] +
        padded[:-2, :-2] * sobel_x[0, 0] + padded[1:-1, :-2] * sobel_x[1, 0] + padded[2:, :-2] * sobel_x[2, 0]
    ) / 8.0

    dy = (
        padded[2:, :-2] * sobel_y[2, 0] + padded[2:, 1:-1] * sobel_y[2, 1] + padded[2:, 2:] * sobel_y[2, 2] +
        padded[:-2, :-2] * sobel_y[0, 0] + padded[:-2, 1:-1] * sobel_y[0, 1] + padded[:-2, 2:] * sobel_y[0, 2]
    ) / 8.0

    nx = -dx * strength
    ny = -dy * strength
    nz = np.ones_like(nx)

    len_norm = np.sqrt(nx**2 + ny**2 + nz**2)
    len_norm[len_norm == 0] = 1.0
    nx /= len_norm
    ny /= len_norm
    nz /= len_norm

    r = ((nx * 0.5 + 0.5) * 255.0).astype(np.uint8)
    g = ((ny * 0.5 + 0.5) * 255.0).astype(np.uint8)
    b = ((nz * 0.5 + 0.5) * 255.0).astype(np.uint8)

    normal_rgb = np.stack([r, g, b], axis=-1)
    return Image.fromarray(normal_rgb, mode="RGB")


def generate_vault_door_textures(output_dir):
    """
    Circular Industrial Bank Vault Door Faceplate:
    Matches the round vault in vault_neon_bg.jpg:
    - Real gunmetal steel base (RGB 92, 105, 122) with radial & brushed grain
    - Vice City dual-tone ambient neon wash:
      * Left half: Electric Magenta (#F84391) sheen
      * Right half: Electric Cyan (#00E5FF) sheen
    - Outer concentric bevel with 32 heavy chrome hex rivets
    - Concentric lathe micro-channels
    - Clean industrial metal without cheesy printed text
    """
    width, height = 2048, 2048
    print("Generating Authentic GTA Vice City Vault Door PBR Textures...")

    np.random.seed(42)
    cx, cy = width // 2, height // 2
    y_idx, x_idx = np.ogrid[:height, :width]
    dist_from_c = np.sqrt((x_idx - cx)**2 + (y_idx - cy)**2).astype(np.float32)
    angle_from_c = np.arctan2(y_idx - cy, x_idx - cx).astype(np.float32)

    # Radial & horizontal brushed steel grain
    noise = np.random.normal(0, 8, (height, width)).astype(np.float32)
    radial_grain = np.sin(angle_from_c * 180.0) * 3.5 + np.cos(dist_from_c * 0.35) * 2.5
    brushed = np.repeat(np.mean(noise.reshape(height, width // 16, 16), axis=2), 16, axis=1)

    # Horizontal coordinate normalized [0..1]
    x_grad = np.tile(np.linspace(0.0, 1.0, width, dtype=np.float32), (height, 1))

    # Base midtone industrial steel (RGB ~ 95, 108, 126)
    base_r = 95.0 + brushed * 0.6 + radial_grain * 0.5
    base_g = 108.0 + brushed * 0.7 + radial_grain * 0.5
    base_b = 126.0 + brushed * 0.8 + radial_grain * 0.5

    # Vice City Neon Ambient Wash:
    # Left: Electric Magenta (+42 R, -12 G, +28 B)
    # Right: Electric Cyan (-18 R, +36 G, +45 B)
    steel_r = np.clip(base_r + (1.0 - x_grad) * 42.0 - x_grad * 18.0, 45, 185).astype(np.uint8)
    steel_g = np.clip(base_g - (1.0 - x_grad) * 12.0 + x_grad * 36.0, 55, 195).astype(np.uint8)
    steel_b = np.clip(base_b + (1.0 - x_grad) * 28.0 + x_grad * 45.0, 75, 220).astype(np.uint8)
    steel_a = np.full((height, width), 255, dtype=np.uint8)

    diffuse = Image.fromarray(np.stack([steel_r, steel_g, steel_b, steel_a], axis=-1), mode="RGBA")
    draw_diffuse = ImageDraw.Draw(diffuse)

    height_map = np.full((height, width), 0.5, dtype=np.float32) + (brushed * 0.002)
    roughness = Image.new("L", (width, height), 72)
    draw_roughness = ImageDraw.Draw(roughness)

    # 1. Outer Heavy Steel Flange Ring (r = 980 to 920)
    draw_diffuse.ellipse([cx - 980, cy - 980, cx + 980, cy + 980],
                         outline=(50, 62, 78, 255), width=30)
    draw_diffuse.ellipse([cx - 950, cy - 950, cx + 950, cy + 950],
                         outline=(160, 185, 215, 255), width=6)
    height_map[(dist_from_c <= 980) & (dist_from_c >= 920)] = 0.78

    # 32 Heavy Industrial Hex Rivets along the perimeter ring
    num_rivets = 32
    for i in range(num_rivets):
        rad = math.radians(i * (360.0 / num_rivets))
        rx = cx + 940 * math.cos(rad)
        ry = cy + 940 * math.sin(rad)
        r_bolt = 24

        draw_diffuse.ellipse([rx - r_bolt, ry - r_bolt, rx + r_bolt, ry + r_bolt],
                             fill=(215, 230, 248, 255), outline=(42, 52, 68, 255), width=4)
        draw_diffuse.regular_polygon((rx, ry, r_bolt - 9), n_sides=6, rotation=0,
                                     fill=(35, 45, 58, 255), outline=(130, 155, 185, 255))
        draw_roughness.ellipse([rx - r_bolt, ry - r_bolt, rx + r_bolt, ry + r_bolt], fill=22)

        d_bolt = np.sqrt((x_idx - rx)**2 + (y_idx - ry)**2)
        height_map[d_bolt <= r_bolt] = 0.92
        height_map[d_bolt <= (r_bolt - 9)] = 0.40

    # 2. Stepped Bevel Ring (r = 880 to 860)
    draw_diffuse.ellipse([cx - 880, cy - 880, cx + 880, cy + 880],
                         outline=(40, 50, 65, 255), width=18)
    draw_diffuse.ellipse([cx - 862, cy - 862, cx + 862, cy + 862],
                         outline=(205, 225, 248, 255), width=4)
    height_map[(dist_from_c <= 880) & (dist_from_c >= 860)] = 0.35

    # 3. Concentric Machined Lathe Channels (Bank Vault Precision Grooves)
    for cr in [780, 680, 580, 480]:
        draw_diffuse.ellipse([cx - cr, cy - cr, cx + cr, cy + cr],
                             outline=(45, 56, 72, 255), width=6)
        draw_diffuse.ellipse([cx - cr + 3, cy - cr + 3, cx + cr - 3, cy + cr - 3],
                             outline=(185, 205, 230, 255), width=2)
        height_map[(dist_from_c <= cr + 4) & (dist_from_c >= cr - 4)] = 0.30

    # 4. 24K Gold Inlaid Accent Band (r = 730)
    draw_diffuse.ellipse([cx - 730, cy - 730, cx + 730, cy + 730],
                         outline=(255, 209, 102, 255), width=8)
    draw_roughness.ellipse([cx - 730, cy - 730, cx + 730, cy + 730], outline=24, width=8)
    height_map[(dist_from_c <= 734) & (dist_from_c >= 726)] = 0.85

    # 5. Dual Neon Groove Accent:
    # Left semicircle in Magenta, Right semicircle in Cyan
    for deg in range(90, 270, 2):
        rad = math.radians(deg)
        x1 = cx + 820 * math.cos(rad)
        y1 = cy + 820 * math.sin(rad)
        draw_diffuse.ellipse([x1 - 3, y1 - 3, x1 + 3, y1 + 3], fill=(248, 67, 145, 255))
    for deg in range(-90, 90, 2):
        rad = math.radians(deg)
        x1 = cx + 820 * math.cos(rad)
        y1 = cy + 820 * math.sin(rad)
        draw_diffuse.ellipse([x1 - 3, y1 - 3, x1 + 3, y1 + 3], fill=(0, 229, 255, 255))

    normal_map = create_normal_map_from_height(height_map, strength=4.0)

    diff_path = os.path.join(output_dir, "vault_door_diffuse.png")
    norm_path = os.path.join(output_dir, "vault_door_normal.png")
    rough_path = os.path.join(output_dir, "vault_door_roughness.png")

    diffuse.save(diff_path, "PNG")
    normal_map.save(norm_path, "PNG")
    roughness.save(rough_path, "PNG")
    print(f"Saved: {diff_path}, {norm_path}, {rough_path}")


def generate_hazard_plates_texture(output_dir):
    """
    Authentic Yellow & Black Hazard and Warning Plates matching vault_neon_bg.jpg:
    - Upper: 'WARNING' plate with black border and caution subtext
    - Lower: 'HAZARD' plate with biohazard triangle symbol
    """
    size = (1024, 1024)
    print("Generating Authentic Vice City Hazard Signs PBR Texture...")
    img = Image.new("RGBA", size, (28, 35, 45, 255))
    draw = ImageDraw.Draw(img)

    try:
        font_header = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 80)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 32)
        font_small = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
    except Exception:
        font_header = font_sub = font_small = ImageFont.load_default()

    # Plate 1: WARNING SIGN (Upper half: y = 50 to 470)
    w_box = [60, 50, 964, 470]
    draw.rectangle(w_box, fill=(245, 158, 11, 255), outline=(20, 20, 20, 255), width=16)
    draw.rectangle([78, 68, 946, 452], outline=(20, 20, 20, 255), width=6)

    # Black header bar
    draw.rectangle([90, 80, 934, 190], fill=(18, 18, 18, 255))
    txt_warn = "WARNING"
    bbox_w = draw.textbbox((0, 0), txt_warn, font=font_header)
    tw = bbox_w[2] - bbox_w[0]
    draw.text(((1024 - tw) // 2, 95), txt_warn, fill=(245, 158, 11, 255), font=font_header)

    # Warning text
    lines = [
        "MAXIMUM SECURITY HEAVY VAULT CORE",
        "EL BANCO CORRUPTO GRANDE • DAEMON '26",
        "ARMED DEFENSE PROTOCOL ACTIVE",
        "UNAUTHORIZED ACCESS MET WITH FORCE"
    ]
    for idx, line in enumerate(lines):
        bbox_l = draw.textbbox((0, 0), line, font=font_small)
        lw = bbox_l[2] - bbox_l[0]
        draw.text(((1024 - lw) // 2, 220 + idx * 56), line, fill=(18, 18, 18, 255), font=font_small)

    # 4 Corner mounting screws
    for sx, sy in [(95, 85), (929, 85), (95, 435), (929, 435)]:
        draw.ellipse([sx - 12, sy - 12, sx + 12, sy + 12], fill=(210, 225, 240, 255), outline=(30, 30, 30, 255), width=3)
        draw.line([sx - 8, sy, sx + 8, sy], fill=(30, 30, 30, 255), width=3)

    # Plate 2: HAZARD / BIOHAZARD SIGN (Lower half: y = 550 to 970)
    h_box = [60, 550, 964, 970]
    draw.rectangle(h_box, fill=(245, 158, 11, 255), outline=(20, 20, 20, 255), width=16)
    draw.rectangle([78, 568, 946, 952], outline=(20, 20, 20, 255), width=6)

    # Black header bar
    draw.rectangle([90, 580, 934, 690], fill=(18, 18, 18, 255))
    txt_haz = "HAZARD"
    bbox_h = draw.textbbox((0, 0), txt_haz, font=font_header)
    hw = bbox_h[2] - bbox_h[0]
    draw.text(((1024 - hw) // 2, 595), txt_haz, fill=(245, 158, 11, 255), font=font_header)

    # Triangle with biohazard symbol
    tri_cx, tri_cy = 512, 820
    tri_r = 100
    p1 = (tri_cx, tri_cy - tri_r)
    p2 = (tri_cx - int(tri_r * 0.95), tri_cy + int(tri_r * 0.65))
    p3 = (tri_cx + int(tri_r * 0.95), tri_cy + int(tri_r * 0.65))
    draw.polygon([p1, p2, p3], outline=(18, 18, 18, 255), fill=None)
    draw.line([p1[0], p1[1] + 12, p2[0] + 12, p2[1] - 8], fill=(18, 18, 18, 255), width=8)
    draw.line([p2[0] + 12, p2[1] - 8, p3[0] - 12, p3[1] - 8], fill=(18, 18, 18, 255), width=8)
    draw.line([p3[0] - 12, p3[1] - 8, p1[0], p1[1] + 12], fill=(18, 18, 18, 255), width=8)

    # Biohazard 3-crescent icon in center
    draw.ellipse([tri_cx - 28, tri_cy - 10, tri_cx + 28, tri_cy + 46], outline=(18, 18, 18, 255), width=10)
    draw.ellipse([tri_cx - 52, tri_cy - 48, tri_cx + 4, tri_cy + 8], outline=(18, 18, 18, 255), width=10)
    draw.ellipse([tri_cx - 4, tri_cy - 48, tri_cx + 52, tri_cy + 8], outline=(18, 18, 18, 255), width=10)
    draw.ellipse([tri_cx - 14, tri_cy - 22, tri_cx + 14, tri_cy + 6], fill=(18, 18, 18, 255))

    # 4 Corner mounting screws
    for sx, sy in [(95, 585), (929, 585), (95, 935), (929, 935)]:
        draw.ellipse([sx - 12, sy - 12, sx + 12, sy + 12], fill=(210, 225, 240, 255), outline=(30, 30, 30, 255), width=3)
        draw.line([sx - 8, sy, sx + 8, sy], fill=(30, 30, 30, 255), width=3)

    out_path = os.path.join(output_dir, "vault_hazard_diffuse.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")


def generate_dial_pbr_textures(output_dir):
    """
    Authentic Bank Vault Combination Dial:
    - High-reflectance satin chrome numeric track (#E2EDF8)
    - Bold, jet-black numerals: 0, 10, 20... 90 (0 in Vice City Cyan #00E5FF)
    - 100 Engraved black tick marks
    - Diamond knurled outer grip ring in gunmetal & chrome
    - Polished 24K Gold bezel ring (#FFD166)
    - Concentric lathe micro-grooves
    """
    size = (2048, 2048)
    print("Generating Authentic Vice City Dial PBR Textures...")
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = 1024, 1024

    height_map = np.zeros(size, dtype=np.float32)

    r_outer_knurl = 980
    r_outer_ring = 910
    r_track_outer = 860
    r_track_inner = 500
    r_inner_gold = 470
    r_hub = 220

    # 1. Knurled Grip Ring (Dark Gunmetal with chrome highlights)
    draw.ellipse([cx - r_outer_knurl, cy - r_outer_knurl, cx + r_outer_knurl, cy + r_outer_knurl],
                 fill=(60, 72, 90, 255), outline=(195, 215, 240, 255), width=10)
    for i in range(120):
        angle = math.radians(i * 3.0)
        kx1 = cx + (r_outer_ring + 8) * math.cos(angle)
        ky1 = cy + (r_outer_ring + 8) * math.sin(angle)
        kx2 = cx + (r_outer_knurl - 6) * math.cos(angle)
        ky2 = cy + (r_outer_knurl - 6) * math.sin(angle)
        draw.line([kx1, ky1, kx2, ky2], fill=(28, 36, 48, 255), width=5)

    # 2. Polished 24K Gold Bevel Ring (#FFD166)
    draw.ellipse([cx - r_outer_ring, cy - r_outer_ring, cx + r_outer_ring, cy + r_outer_ring],
                 fill=(255, 209, 102, 255), outline=(255, 240, 160, 255), width=8)

    # 3. High-Reflectance Satin Chrome Dial Track
    draw.ellipse([cx - r_track_outer, cy - r_track_outer, cx + r_track_outer, cy + r_track_outer],
                 fill=(228, 238, 248, 255), outline=(140, 160, 185, 255), width=6)

    # Concentric lathe micro-grooves
    for ring_r in range(r_track_inner + 15, r_track_outer - 15, 12):
        draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r],
                     outline=(210, 222, 235, 255), width=2)

    try:
        font_num = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 82)
    except Exception:
        font_num = ImageFont.load_default()

    # 4. Tick Marks (100 Divisions)
    for i in range(100):
        deg = i * 3.6 - 90
        rad = math.radians(deg)
        is_major = (i % 10 == 0)
        is_mid = (i % 5 == 0) and not is_major

        tick_len = 84 if is_major else (52 if is_mid else 32)
        tick_w = 10 if is_major else (6 if is_mid else 4)
        tick_col = (14, 18, 26, 255) if (is_major or is_mid) else (65, 80, 105, 240)

        p1_x = cx + (r_track_outer - 20) * math.cos(rad)
        p1_y = cy + (r_track_outer - 20) * math.sin(rad)
        p2_x = cx + (r_track_outer - 20 - tick_len) * math.cos(rad)
        p2_y = cy + (r_track_outer - 20 - tick_len) * math.sin(rad)
        draw.line([p1_x, p1_y, p2_x, p2_y], fill=tick_col, width=tick_w)

    # 5. Bold Engraved Numerals: 0, 10, 20... 90
    for val in range(0, 100, 10):
        deg = val * 3.6 - 90
        rad = math.radians(deg)
        r_text = r_track_outer - 195
        tx = cx + r_text * math.cos(rad)
        ty = cy + r_text * math.sin(rad)

        text = str(val)
        bbox = draw.textbbox((0, 0), text, font=font_num)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        num_color = (0, 229, 255, 255) if val == 0 else (14, 18, 26, 255)
        draw.text((tx - tw / 2 + 1, ty - th / 2 + 1), text, fill=(245, 250, 255, 220), font=font_num)
        draw.text((tx - tw / 2, ty - th / 2), text, fill=num_color, font=font_num)

    # 6. Inner 24K Gold Accent Ring
    draw.ellipse([cx - r_inner_gold, cy - r_inner_gold, cx + r_inner_gold, cy + r_inner_gold],
                 fill=None, outline=(255, 209, 102, 255), width=12)

    # 7. Center Recessed Steel Hub Plate
    draw.ellipse([cx - r_hub, cy - r_hub, cx + r_hub, cy + r_hub],
                 fill=(45, 55, 72, 255), outline=(0, 229, 255, 255), width=8)

    # Height map
    y_ind, x_ind = np.ogrid[:size[1], :size[0]]
    dist_c = np.sqrt((x_ind - cx)**2 + (y_ind - cy)**2)

    height_map[(dist_c <= r_outer_knurl) & (dist_c >= r_outer_ring)] = 0.72
    height_map[(dist_c <= r_outer_ring) & (dist_c >= r_track_outer)] = 0.88
    height_map[(dist_c <= r_track_outer) & (dist_c >= r_track_inner)] = 0.60
    height_map[(dist_c <= r_inner_gold + 6) & (dist_c >= r_inner_gold - 6)] = 0.82
    height_map[dist_c <= r_hub] = 0.40

    normal_dial = create_normal_map_from_height(height_map, strength=3.5)

    diff_path = os.path.join(output_dir, "vault_dial_diffuse.png")
    norm_path = os.path.join(output_dir, "vault_dial_normal.png")
    img.save(diff_path, "PNG")
    normal_dial.save(norm_path, "PNG")
    print(f"Saved: {diff_path}, {norm_path}")


def generate_wall_pbr_textures(output_dir):
    """
    Industrial Bank Wall Plates matching vault_neon_bg.jpg:
    - Dark cold industrial steel plate (RGB ~ 65, 75, 90)
    - Vertical plate seams with hex socket bolts
    - Left side catches magenta reflection, right side catches cyan reflection
    """
    width, height = 2048, 2048
    print("Generating Authentic Vice City Wall PBR Textures...")
    np.random.seed(99)
    base_gray = np.random.normal(70, 8, (height, width)).astype(np.float32)
    kernel_w = 64
    brushed = np.repeat(np.mean(base_gray.reshape(height, width // kernel_w, kernel_w), axis=2), kernel_w, axis=1)

    x_grad = np.tile(np.linspace(0.0, 1.0, width, dtype=np.float32), (height, 1))

    # Base steel color
    base_r = brushed * 0.90
    base_g = brushed * 1.05
    base_b = brushed * 1.25

    # Split neon wash: magenta on left, cyan on right
    diff_r = np.clip(base_r + (1.0 - x_grad) * 35.0 - x_grad * 12.0, 40, 160).astype(np.uint8)
    diff_g = np.clip(base_g - (1.0 - x_grad) * 8.0 + x_grad * 28.0, 48, 175).astype(np.uint8)
    diff_b = np.clip(base_b + (1.0 - x_grad) * 22.0 + x_grad * 38.0, 65, 205).astype(np.uint8)
    diff_a = np.full((height, width), 255, dtype=np.uint8)

    diffuse = Image.fromarray(np.stack([diff_r, diff_g, diff_b, diff_a], axis=-1), mode="RGBA")
    draw_diff = ImageDraw.Draw(diffuse)

    height_map = np.full((height, width), 0.5, dtype=np.float32) + (brushed - 70) * 0.002
    roughness = Image.new("L", (width, height), 70)
    draw_rough = ImageDraw.Draw(roughness)

    # Vertical Panel Seams
    seam_x = [480, 1568]
    for sx in seam_x:
        draw_diff.line([sx - 10, 0, sx - 10, height], fill=(30, 38, 50, 255), width=20)
        draw_diff.line([sx + 8, 0, sx + 8, height], fill=(160, 185, 215, 255), width=3)
        height_map[:, max(0, sx-10):min(width, sx+10)] = 0.25

        # Hex rivets along the seam
        for ry in range(80, height, 160):
            r_b = 20
            draw_diff.ellipse([sx - r_b, ry - r_b, sx + r_b, ry + r_b],
                              fill=(215, 230, 248, 255), outline=(42, 52, 68, 255), width=4)
            draw_diff.regular_polygon((sx, ry, r_b - 8), n_sides=6, rotation=0,
                                      fill=(28, 36, 48, 255), outline=(130, 155, 185, 255))
            draw_rough.ellipse([sx - r_b, ry - r_b, sx + r_b, ry + r_b], fill=25)

            y_i, x_i = np.ogrid[:height, :width]
            d = np.sqrt((x_i - sx)**2 + (y_i - ry)**2)
            height_map[d <= r_b] = 0.88
            height_map[d <= (r_b - 8)] = 0.38

    normal_wall = create_normal_map_from_height(height_map, strength=4.0)

    diff_path = os.path.join(output_dir, "vault_wall_diffuse.png")
    norm_path = os.path.join(output_dir, "vault_wall_normal.png")
    rough_path = os.path.join(output_dir, "vault_wall_roughness.png")

    diffuse.save(diff_path, "PNG")
    normal_wall.save(norm_path, "PNG")
    roughness.save(rough_path, "PNG")
    print(f"Saved: {diff_path}, {norm_path}, {rough_path}")


def generate_gold_ingot_texture(output_dir):
    size = (1024, 1024)
    print("Generating 24K Gold Ingot PBR Texture...")
    img = Image.new("RGBA", size, (255, 209, 102, 255))
    draw = ImageDraw.Draw(img)

    draw.rectangle([30, 30, 994, 994], outline=(255, 240, 160, 255), width=18)
    draw.rectangle([55, 55, 969, 969], outline=(210, 160, 30, 255), width=8)

    try:
        font_stamp_lg = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 64)
        font_stamp_md = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 46)
        font_stamp_sm = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 36)
    except Exception:
        font_stamp_lg = font_stamp_md = font_stamp_sm = ImageFont.load_default()

    cx, cy = 512, 512
    draw.ellipse([cx - 140, 200, cx + 140, 480], outline=(175, 125, 20, 255), width=6)
    draw.text((cx - 100, 280), "999.9", fill=(145, 100, 10, 255), font=font_stamp_lg)
    draw.text((cx - 120, 360), "FINE GOLD", fill=(155, 110, 10, 255), font=font_stamp_md)
    draw.text((cx - 85, 560), "1000g", fill=(140, 95, 10, 255), font=font_stamp_lg)

    txt_bank = "DAEMON CENTRAL RESERVE"
    bbox_b = draw.textbbox((0, 0), txt_bank, font=font_stamp_md)
    w_b = bbox_b[2] - bbox_b[0]
    draw.text((cx - w_b // 2, 700), txt_bank, fill=(160, 115, 15, 255), font=font_stamp_md)

    txt_ser = "ASSAYER № 77092"
    bbox_s = draw.textbbox((0, 0), txt_ser, font=font_stamp_sm)
    w_s = bbox_s[2] - bbox_s[0]
    draw.text((cx - w_s // 2, 800), txt_ser, fill=(145, 105, 10, 255), font=font_stamp_sm)

    out_path = os.path.join(output_dir, "vault_gold_diffuse.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")


def generate_cash_texture(output_dir):
    size = (512, 512)
    print("Generating Cash Stack Texture...")
    img = Image.new("RGBA", size, (28, 65, 42, 255))
    draw = ImageDraw.Draw(img)

    draw.rectangle([10, 10, 502, 502], outline=(65, 125, 80, 255), width=8)
    draw.ellipse([156, 156, 356, 356], outline=(75, 140, 95, 255), width=6)

    draw.rectangle([180, 0, 332, 512], fill=(255, 209, 102, 255), outline=(180, 140, 20, 255), width=4)
    try:
        font_c = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 36)
    except Exception:
        font_c = ImageFont.load_default()

    draw.text((205, 235), "$10,000", fill=(18, 30, 18, 255), font=font_c)

    out_path = os.path.join(output_dir, "vault_cash_diffuse.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")


if __name__ == "__main__":
    target_dir = r"d:\Association\vice-city-heist\public\models\textures"
    os.makedirs(target_dir, exist_ok=True)
    generate_vault_door_textures(target_dir)
    generate_hazard_plates_texture(target_dir)
    generate_dial_pbr_textures(target_dir)
    generate_wall_pbr_textures(target_dir)
    generate_gold_ingot_texture(target_dir)
    generate_cash_texture(target_dir)
    print("\nAll Authentic GTA Vice City PBR Vault Textures Generated Successfully!")

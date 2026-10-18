#!/usr/bin/env python3
"""
scripts/build_lobby_vault.py
Generates the exact 3D Vice City Savings & Loan Titanium Class-IV Vault
matching the 2D CSS waiting lobby design:
- Hollow vault chamber (back, left, right, top, bottom walls)
- Stack of 3D gold bullion ingots inside
- Outer frame with 4 corner chrome rivets and cyan accent glow
- Left hinges with vertical pivot
- Heavy vault door slab with 4 locking bolts
- Combination dial housing with numbered dial disc (0, 20, 40, 60, 80)
- 3-spoke chrome wheel handle
- Nameplate: "VICE CITY SAVINGS & LOAN / BIOMETRIC MULTI-LAYER KEY VAULT"
"""
# pyright: reportMissingImports=false
import math
import os
import sys

try:
    import bpy  # type: ignore
except ImportError:
    bpy = None  # type: ignore


def build_lobby_vault(output_glb):
    tex_dir = os.path.join(os.path.dirname(output_glb), "textures")
    dial_tex_path = os.path.join(tex_dir, "vault_dial_diffuse.png")
    plaque_tex_path = os.path.join(tex_dir, "vault_plaque_diffuse.png")

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 2. Material Helper
    def make_mat(name, color, metallic=0.0, roughness=0.5, emission=None, emission_strength=1.0, tex_path=None):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        bsdf = nodes.get("Principled BSDF")

        if bsdf:
            bsdf.inputs["Base Color"].default_value = color
            bsdf.inputs["Metallic"].default_value = metallic
            bsdf.inputs["Roughness"].default_value = roughness

            if emission:
                if "Emission Color" in bsdf.inputs:
                    bsdf.inputs["Emission Color"].default_value = emission
                elif "Emission" in bsdf.inputs:
                    bsdf.inputs["Emission"].default_value = emission
                if "Emission Strength" in bsdf.inputs:
                    bsdf.inputs["Emission Strength"].default_value = emission_strength

            if tex_path and os.path.exists(tex_path):
                img_node = nodes.new("ShaderNodeTexImage")
                img_node.image = bpy.data.images.load(tex_path)
                links.new(img_node.outputs["Color"], bsdf.inputs["Base Color"])

        return mat

    # Materials
    mat_chassis = make_mat("MatChassis", (0.09, 0.12, 0.18, 1.0), metallic=0.85, roughness=0.32)
    mat_frame = make_mat("MatFrame", (0.14, 0.18, 0.28, 1.0), metallic=0.80, roughness=0.30)
    mat_cyan_glow = make_mat("MatCyanGlow", (0.0, 0.9, 1.0, 1.0), metallic=0.2, roughness=0.2, emission=(0.0, 0.9, 1.0, 1.0), emission_strength=2.2)
    mat_chrome = make_mat("MatChrome", (0.88, 0.92, 0.98, 1.0), metallic=0.96, roughness=0.15)
    mat_dark_interior = make_mat("MatDarkInterior", (0.06, 0.08, 0.12, 1.0), metallic=0.88, roughness=0.45)
    mat_gold = make_mat("MatGold", (1.0, 0.78, 0.05, 1.0), metallic=0.98, roughness=0.16)
    mat_gold_glow = make_mat("MatGoldGlow", (1.0, 0.75, 0.1, 1.0), metallic=0.5, roughness=0.3, emission=(1.0, 0.7, 0.05, 1.0), emission_strength=3.5)

    mat_dial = make_mat("MatDial", (0.15, 0.18, 0.25, 1.0), metallic=0.8, roughness=0.35, tex_path=dial_tex_path)
    mat_plaque = make_mat("MatPlaque", (0.10, 0.14, 0.22, 1.0), metallic=0.85, roughness=0.3, tex_path=plaque_tex_path)

    # ─────────────────────────────────────────────────────────
    # 3. HOLLOW VAULT CHASSIS (Stationary Walls)
    # ─────────────────────────────────────────────────────────
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    chassis = bpy.context.active_object
    chassis.name = "VaultChassis"

    def add_box(name, loc, sc, mat, parent=chassis):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
        obj = bpy.context.active_object
        obj.name = name
        obj.scale = sc
        bpy.ops.object.transform_apply(scale=True)
        obj.data.materials.append(mat)
        obj.parent = parent
        return obj

    # Back Wall
    add_box("WallBack", (0, 0.55, 0), (3.0, 0.08, 2.2), mat_dark_interior)

    # Left & Right Walls
    add_box("WallLeft", (-1.46, 0.25, 0), (0.08, 0.55, 2.2), mat_chassis)
    add_box("WallRight", (1.46, 0.25, 0), (0.08, 0.55, 2.2), mat_chassis)

    # Top & Bottom Walls
    add_box("WallTop", (0, 0.25, 1.06), (3.0, 0.55, 0.08), mat_chassis)
    add_box("WallBottom", (0, 0.25, -1.06), (3.0, 0.55, 0.08), mat_chassis)

    # Front Outer Frame Trim (surrounding the door opening)
    add_box("FrontFrameTop", (0, -0.04, 1.06), (3.16, 0.06, 0.16), mat_frame)
    add_box("FrontFrameBottom", (0, -0.04, -1.06), (3.16, 0.06, 0.16), mat_frame)
    add_box("FrontFrameLeft", (-1.46, -0.04, 0), (0.16, 0.06, 2.28), mat_frame)
    add_box("FrontFrameRight", (1.46, -0.04, 0), (0.16, 0.06, 2.28), mat_frame)

    # Neon Cyan Accent Trim Line
    add_box("NeonRimTop", (0, -0.05, 1.13), (3.18, 0.02, 0.02), mat_cyan_glow)
    add_box("NeonRimBottom", (0, -0.05, -1.13), (3.18, 0.02, 0.02), mat_cyan_glow)
    add_box("NeonRimLeft", (-1.53, -0.05, 0), (0.02, 0.02, 2.28), mat_cyan_glow)
    add_box("NeonRimRight", (1.53, -0.05, 0), (0.02, 0.02, 2.28), mat_cyan_glow)

    # 4 Corner Chrome Rivets
    for idx, (rx, rz) in enumerate([(-1.42, 1.02), (1.42, 1.02), (-1.42, -1.02), (1.42, -1.02)]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.052, depth=0.04, vertices=16, location=(rx, -0.07, rz))
        rivet = bpy.context.active_object
        rivet.name = f"FrameRivet_{idx}"
        rivet.rotation_euler = (math.radians(90), 0, 0)
        rivet.data.materials.append(mat_chrome)
        rivet.parent = chassis

    # Left Frame Hinge Brackets (Stationary on outer frame)
    for h_idx, hz in enumerate([0.62, -0.62]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.062, depth=0.26, vertices=16, location=(-1.48, -0.05, hz))
        hinge = bpy.context.active_object
        hinge.name = f"FrameHinge_{h_idx}"
        hinge.data.materials.append(mat_chrome)
        hinge.parent = chassis

    # ─────────────────────────────────────────────────────────
    # 4. INTERIOR GOLD BULLION CHAMBER
    # ─────────────────────────────────────────────────────────
    add_box("GoldFloorGlow", (0, 0.30, -0.98), (2.6, 0.45, 0.04), mat_gold_glow)

    ingot_w, ingot_d, ingot_h = 0.36, 0.20, 0.10
    pyramid_rows = [
        [(-0.42, 0.28, -0.88), (0.0, 0.28, -0.88), (0.42, 0.28, -0.88)],
        [(-0.21, 0.28, -0.77), (0.21, 0.28, -0.77)],
        [(0.0, 0.28, -0.66)]
    ]
    bar_id = 0
    for row in pyramid_rows:
        for bx, by, bz in row:
            add_box(f"GoldIngot_{bar_id}", (bx, by, bz), (ingot_w, ingot_d, ingot_h), mat_gold)
            bar_id += 1

    for r_z in [-0.88, -0.77]:
        for r_x in [0.82, 1.04]:
            add_box(f"GoldStackRight_{bar_id}", (r_x, 0.28, r_z), (0.32, 0.18, 0.09), mat_gold)
            bar_id += 1

    # ─────────────────────────────────────────────────────────
    # 5. VAULT DOOR ASSEMBLY (Pivoting on Left Hinge X = -1.36)
    # Note: Children use LOCAL coordinates relative to door_pivot!
    # ─────────────────────────────────────────────────────────
    hinge_x = -1.36
    door_y = -0.05
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(hinge_x, door_y, 0))
    door_pivot = bpy.context.active_object
    door_pivot.name = "VaultDoorAssembly"

    def add_door_box(name, local_loc, sc, mat):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
        obj = bpy.context.active_object
        obj.name = name
        obj.scale = sc
        bpy.ops.object.transform_apply(scale=True)
        obj.data.materials.append(mat)
        obj.parent = door_pivot
        obj.location = local_loc
        return obj

    # Main Door Slab: Local center at X = 1.34 so left edge is at hinge X = 0
    add_door_box("VaultDoorSlab", (1.34, 0, 0), (2.68, 0.08, 1.96), mat_chassis)
    add_door_box("VaultDoorBezel", (1.34, -0.045, 0), (2.58, 0.02, 1.88), mat_frame)

    # Door Hinge Sleeves (attached to door at local X = 0)
    for h_idx, hz in enumerate([0.62, -0.62]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.058, depth=0.20, vertices=16, location=(0, 0, 0))
        dsleeve = bpy.context.active_object
        dsleeve.name = f"DoorHingeSleeve_{h_idx}"
        dsleeve.data.materials.append(mat_chrome)
        dsleeve.parent = door_pivot
        dsleeve.location = (0, 0, hz)

    # 4 Hydraulic Locking Bolts
    door_bolts = [
        ("Top", (1.34, 0, 0.96), (0.32, 0.06, 0.06)),
        ("Bottom", (1.34, 0, -0.96), (0.32, 0.06, 0.06)),
        ("RightUpper", (2.66, 0, 0.44), (0.10, 0.06, 0.06)),
        ("RightLower", (2.66, 0, -0.44), (0.10, 0.06, 0.06)),
    ]
    for b_name, b_loc, b_scale in door_bolts:
        add_door_box(f"LockBolt_{b_name}", b_loc, b_scale, mat_chrome)

    # ─────────────────────────────────────────────────────────
    # 6. COMBINATION DIAL & 3-SPOKE HANDLE (LOCAL TO DOOR)
    # ─────────────────────────────────────────────────────────
    dial_local_x = 1.34
    dial_local_z = 0.18
    dial_local_y = -0.055

    # Dial Bezel Housing
    bpy.ops.mesh.primitive_cylinder_add(radius=0.52, depth=0.04, vertices=32, location=(0, 0, 0))
    dial_housing = bpy.context.active_object
    dial_housing.name = "DialHousing"
    dial_housing.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    dial_housing.data.materials.append(mat_frame)
    dial_housing.parent = door_pivot
    dial_housing.location = (dial_local_x, dial_local_y, dial_local_z)

    # Combination Wheel Pivot
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    wheel_pivot = bpy.context.active_object
    wheel_pivot.name = "CombinationWheel"
    wheel_pivot.parent = door_pivot
    wheel_pivot.location = (dial_local_x, dial_local_y - 0.022, dial_local_z)

    # Dial Face Disc
    bpy.ops.mesh.primitive_cylinder_add(radius=0.44, depth=0.015, vertices=32, location=(0, 0, 0))
    dial_disc = bpy.context.active_object
    dial_disc.name = "DialDiscFace"
    dial_disc.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    dial_disc.data.materials.append(mat_dial)
    dial_disc.parent = wheel_pivot
    dial_disc.location = (0, 0, 0)

    # 3-Spoke Chrome Wheel Handle Assembly
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    handle_pivot = bpy.context.active_object
    handle_pivot.name = "HandleAssembly"
    handle_pivot.parent = door_pivot
    handle_pivot.location = (dial_local_x, dial_local_y - 0.045, dial_local_z)

    # Chrome Center Hub
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.05, vertices=24, location=(0, 0, 0))
    hub = bpy.context.active_object
    hub.name = "HandleCenterHub"
    hub.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    hub.data.materials.append(mat_chrome)
    hub.parent = handle_pivot
    hub.location = (0, 0, 0)

    # 3 Spokes at 0°, 120°, 240°
    for sp_idx, sp_deg in enumerate([0, 120, 240]):
        sp_rad = math.radians(sp_deg)
        sp_len = 0.42
        sp_x = (sp_len / 2) * math.cos(sp_rad)
        sp_z = (sp_len / 2) * math.sin(sp_rad)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=sp_len, vertices=16, location=(0, 0, 0))
        spoke = bpy.context.active_object
        spoke.name = f"HandleSpoke_{sp_idx}"
        spoke.rotation_euler = (0, -sp_rad + math.radians(90), 0)
        bpy.ops.object.transform_apply(rotation=True)
        spoke.data.materials.append(mat_chrome)
        spoke.parent = handle_pivot
        spoke.location = (sp_x, 0, sp_z)

        # Grip knob at tip
        tip_x = (sp_len + 0.02) * math.cos(sp_rad)
        tip_z = (sp_len + 0.02) * math.sin(sp_rad)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, segments=12, ring_count=8, location=(0, 0, 0))
        knob = bpy.context.active_object
        knob.name = f"SpokeKnob_{sp_idx}"
        knob.data.materials.append(mat_chrome)
        knob.parent = handle_pivot
        knob.location = (tip_x, 0, tip_z)

    # Nameplate Plaque (below dial)
    add_door_box("VaultPlaque", (dial_local_x, dial_local_y - 0.01, -0.52), (1.46, 0.012, 0.42), mat_plaque)

    # ─────────────────────────────────────────────────────────
    # 7. EXPORT GLTF 2.0 (.glb)
    # ─────────────────────────────────────────────────────────
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    print(f"Exporting Vice City 3D Vault to: {output_glb}")

    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print("Export Complete!")


if __name__ == "__main__":
    out_file = r"d:\Association\vice-city-heist\public\models\lobby_vault.glb"
    if len(sys.argv) > 1 and sys.argv[-1].endswith(".glb"):
        out_file = sys.argv[-1]

    if bpy is None:
        print("ERROR: This script requires Blender's embedded Python runtime (bpy).")
        print("Run with: blender.exe -b --python scripts/build_lobby_vault.py")
        sys.exit(1)

    build_lobby_vault(out_file)

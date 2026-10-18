#!/usr/bin/env python3
"""
Generates a stylized low-poly Vice City Heist Vault Safe 3D model using Blender Python API (bpy)
and exports it as a .glb file into the project's public folder.
"""
import bpy
import math
import os
import sys

def create_vault_model(output_glb_path):
    # 1. Clean existing scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 2. Materials Helper
    def make_material(name, base_color, metallic=0.0, roughness=0.5, emission=None, emission_strength=1.0):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        if bsdf:
            # Set Base Color
            bsdf.inputs["Base Color"].default_value = base_color
            bsdf.inputs["Metallic"].default_value = metallic
            bsdf.inputs["Roughness"].default_value = roughness
            if emission:
                # Blender 4+ emission inputs
                if "Emission Color" in bsdf.inputs:
                    bsdf.inputs["Emission Color"].default_value = emission
                    bsdf.inputs["Emission Strength"].default_value = emission_strength
                elif "Emission" in bsdf.inputs:
                    bsdf.inputs["Emission"].default_value = emission
        return mat

    mat_titanium = make_material("TitaniumDark", (0.08, 0.10, 0.14, 1.0), metallic=0.85, roughness=0.25)
    mat_gold = make_material("ViceGold", (1.0, 0.78, 0.22, 1.0), metallic=0.95, roughness=0.18)
    mat_chrome = make_material("ChromeSteel", (0.85, 0.88, 0.92, 1.0), metallic=0.95, roughness=0.12)
    mat_neon_pink = make_material("NeonPink", (1.0, 0.12, 0.55, 1.0), emission=(1.0, 0.12, 0.55, 1.0), emission_strength=4.5)
    mat_neon_teal = make_material("NeonTeal", (0.0, 0.90, 0.85, 1.0), emission=(0.0, 0.90, 0.85, 1.0), emission_strength=4.5)
    mat_rubber = make_material("DarkRubber", (0.03, 0.03, 0.04, 1.0), metallic=0.1, roughness=0.8)

    # 3. Main Safe Body (Heavy Chamfered Box)
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 1.1))
    body = bpy.context.active_object
    body.name = "VaultChassis"
    body.scale = (1.1, 0.9, 1.1)
    bpy.ops.object.transform_apply(scale=True)
    body.data.materials.append(mat_titanium)

    # Add Bevel Modifier for clean low-poly beveled edges
    bevel = body.modifiers.new(name="Bevel", type="BEVEL")
    bevel.width = 0.06
    bevel.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")

    # 4. Safe Outer Rim Frame (Face)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.92, 1.1))
    rim = bpy.context.active_object
    rim.name = "DoorFrame"
    rim.scale = (1.9, 0.06, 1.9)
    bpy.ops.object.transform_apply(scale=True)
    rim.data.materials.append(mat_rubber)

    # 5. Heavy Vault Door (Recessed front door)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.95, 1.1))
    door = bpy.context.active_object
    door.name = "VaultDoor"
    door.scale = (1.75, 0.12, 1.75)
    bpy.ops.object.transform_apply(scale=True)
    door.data.materials.append(mat_titanium)

    door_bevel = door.modifiers.new(name="Bevel", type="BEVEL")
    door_bevel.width = 0.04
    door_bevel.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")

    # 6. Safe Door Outer Trim (Gold Accent Ring)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.72, depth=0.08, vertices=24, location=(0, 1.03, 1.1))
    door_ring = bpy.context.active_object
    door_ring.rotation_euler = (math.radians(90), 0, 0)
    door_ring.name = "DialBackplate"
    door_ring.data.materials.append(mat_gold)

    # 7. Central Dial Lock (Chrome Wheel)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=0.14, vertices=20, location=(0, 1.09, 1.1))
    dial_hub = bpy.context.active_object
    dial_hub.rotation_euler = (math.radians(90), 0, 0)
    dial_hub.name = "DialHub"
    dial_hub.data.materials.append(mat_chrome)

    # 8. Three Spoke Handles (Classic Bank Vault Handwheel)
    for i in range(3):
        angle = i * (2 * math.pi / 3)
        spoke_len = 0.55
        x_pos = (spoke_len / 2) * math.cos(angle)
        z_pos = 1.1 + (spoke_len / 2) * math.sin(angle)
        
        bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=spoke_len, vertices=12, location=(x_pos, 1.15, z_pos))
        spoke = bpy.context.active_object
        spoke.name = f"WheelSpoke_{i}"
        spoke.rotation_euler = (0, -angle, math.radians(90))
        spoke.data.materials.append(mat_gold)

        # Spoke Tip Grip Knobs
        tip_x = spoke_len * math.cos(angle)
        tip_z = 1.1 + spoke_len * math.sin(angle)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, segments=12, ring_count=8, location=(tip_x, 1.15, tip_z))
        knob = bpy.context.active_object
        knob.name = f"WheelKnob_{i}"
        knob.data.materials.append(mat_chrome)

    # 9. Heavy Industrial Side Hinges
    for z_hinge in [0.55, 1.65]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.28, vertices=16, location=(-1.05, 0.95, z_hinge))
        hinge = bpy.context.active_object
        hinge.name = f"Hinge_{z_hinge}"
        hinge.data.materials.append(mat_gold)

    # 10. Digital Keypad & Status Display
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.62, 1.02, 1.1))
    keypad_box = bpy.context.active_object
    keypad_box.scale = (0.32, 0.05, 0.52)
    bpy.ops.object.transform_apply(scale=True)
    keypad_box.name = "DigitalKeypad"
    keypad_box.data.materials.append(mat_rubber)

    # Neon Status Indicator Screen
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.62, 1.05, 1.25))
    screen_obj = bpy.context.active_object
    screen_obj.scale = (0.24, 0.02, 0.12)
    bpy.ops.object.transform_apply(scale=True)
    screen_obj.name = "KeypadStatusLED"
    screen_obj.data.materials.append(mat_neon_teal)

    # 11. Neon Accent Light Bars (Vice City Neon Cyberpunk Style)
    for x_offset, light_mat in [(-0.95, mat_neon_pink), (0.95, mat_neon_teal)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_offset, 0.98, 1.1))
        light_strip = bpy.context.active_object
        light_strip.scale = (0.04, 0.02, 1.8)
        bpy.ops.object.transform_apply(scale=True)
        light_strip.name = f"NeonStrip_{x_offset}"
        light_strip.data.materials.append(light_mat)

    # 12. Steel Base Pedestal Legs
    for x_foot in [-0.85, 0.85]:
        for y_foot in [-0.65, 0.65]:
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_foot, y_foot, 0.08))
            foot = bpy.context.active_object
            foot.scale = (0.24, 0.24, 0.16)
            bpy.ops.object.transform_apply(scale=True)
            foot.name = f"VaultFoot_{x_foot}_{y_foot}"
            foot.data.materials.append(mat_titanium)

    # Ensure parent output directory exists
    os.makedirs(os.path.dirname(output_glb_path), exist_ok=True)

    # 13. Export as GLB
    print(f"Exporting Vault model to: {output_glb_path}")
    bpy.ops.export_scene.gltf(
        filepath=output_glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print("Export complete!")

if __name__ == "__main__":
    out_path = r"d:\Association\vice-city-heist\public\models\vault_safe.glb"
    if len(sys.argv) > 1 and sys.argv[-1].endswith(".glb"):
        out_path = sys.argv[-1]
    create_vault_model(out_path)

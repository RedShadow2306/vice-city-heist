#!/usr/bin/env python3
"""
generate_vault_door_asset.py
Generates a high-fidelity, game-ready 3D asset of the heavy industrial submarine / bunker vault door
matching the user reference image:
- Heavy steel bulkhead frame with perimeter rivets and industrial piping
- Top-left blue beacon lamp & top-right red emergency siren
- Heavy horizontal left hinges with double knuckle brackets and rivet plates
- Prominent 6-spoke central circular lock wheel
- Interior gold reserves chamber revealed upon door swing
- Parented assemblies for smooth R3F animation:
  * VaultDoorAssembly (pivoting on left hinge X = -1.25)
  * LockWheelAssembly (spins on central Z axis)
"""
import bpy
import math
import os
import sys

def build_vault_door(output_path):
    # 1. Reset scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 2. Material Helper
    def create_pbr_material(name, base_color, metallic=0.0, roughness=0.5, emission=None, emission_strength=1.0):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = base_color
            bsdf.inputs["Metallic"].default_value = metallic
            bsdf.inputs["Roughness"].default_value = roughness
            if emission:
                if "Emission Color" in bsdf.inputs:
                    bsdf.inputs["Emission Color"].default_value = emission
                    bsdf.inputs["Emission Strength"].default_value = emission_strength
                elif "Emission" in bsdf.inputs:
                    bsdf.inputs["Emission"].default_value = emission
        return mat

    # PBR Materials
    mat_bulkhead_steel = create_pbr_material("Mat_BulkheadSteel", (0.18, 0.21, 0.24, 1.0), metallic=0.92, roughness=0.38)
    mat_door_face = create_pbr_material("Mat_DoorSteel", (0.22, 0.25, 0.29, 1.0), metallic=0.94, roughness=0.32)
    mat_dark_iron = create_pbr_material("Mat_DarkIron", (0.10, 0.12, 0.14, 1.0), metallic=0.88, roughness=0.45)
    mat_wheel_steel = create_pbr_material("Mat_WheelSteel", (0.45, 0.48, 0.52, 1.0), metallic=0.96, roughness=0.22)
    mat_chrome_hub = create_pbr_material("Mat_ChromeHub", (0.75, 0.78, 0.82, 1.0), metallic=0.98, roughness=0.15)
    mat_rivet = create_pbr_material("Mat_RivetSteel", (0.35, 0.38, 0.42, 1.0), metallic=0.92, roughness=0.28)
    mat_beacon_blue = create_pbr_material("Mat_BeaconBlue", (0.0, 0.6, 1.0, 1.0), emission=(0.0, 0.75, 1.0, 1.0), emission_strength=6.0)
    mat_beacon_red = create_pbr_material("Mat_BeaconRed", (1.0, 0.1, 0.1, 1.0), emission=(1.0, 0.15, 0.1, 1.0), emission_strength=7.0)
    mat_pipe = create_pbr_material("Mat_IndustrialPipe", (0.14, 0.16, 0.18, 1.0), metallic=0.85, roughness=0.42)
    mat_gold_ingot = create_pbr_material("Mat_GoldIngot", (1.0, 0.82, 0.22, 1.0), metallic=0.98, roughness=0.16)
    mat_cash = create_pbr_material("Mat_CashStack", (0.12, 0.32, 0.18, 1.0), metallic=0.05, roughness=0.85)
    mat_concrete = create_pbr_material("Mat_ChamberWall", (0.07, 0.08, 0.10, 1.0), metallic=0.1, roughness=0.92)

    # 3. FIXED BULKHEAD CORRIDOR & OUTER DOOR FRAME
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    wall = bpy.context.active_object
    wall.name = "BulkheadWall"
    wall.scale = (4.4, 0.4, 4.4)
    bpy.ops.object.transform_apply(scale=True)
    wall.data.materials.append(mat_bulkhead_steel)

    # Bulkhead Doorway Aperture Frame
    for fz in [-1.55, 1.55]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.12, fz))
        bar = bpy.context.active_object
        bar.scale = (2.4, 0.28, 0.24)
        bpy.ops.object.transform_apply(scale=True)
        bar.name = f"FrameBarH_{fz}"
        bar.data.materials.append(mat_dark_iron)

    for fx in [-1.22, 1.22]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(fx, 0.12, 0))
        bar = bpy.context.active_object
        bar.scale = (0.24, 0.28, 3.2)
        bpy.ops.object.transform_apply(scale=True)
        bar.name = f"FrameBarV_{fx}"
        bar.data.materials.append(mat_dark_iron)

    for cx, cz in [(-1.22, -1.55), (1.22, -1.55), (-1.22, 1.55), (1.22, 1.55)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.28, vertices=16, location=(cx, 0.12, cz))
        corner = bpy.context.active_object
        corner.name = f"FrameCorner_{cx}_{cz}"
        corner.data.materials.append(mat_dark_iron)

    # Perimeter Rivets along outer frame
    for rz in [-1.62, 1.62]:
        for rx_idx in range(12):
            rx = -1.2 + rx_idx * 0.218
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.032, segments=8, ring_count=6, location=(rx, 0.26, rz))
            riv = bpy.context.active_object
            riv.name = f"FrameRivetH_{rz}_{rx_idx}"
            riv.data.materials.append(mat_rivet)

    for rx in [-1.30, 1.30]:
        for rz_idx in range(14):
            rz = -1.4 + rz_idx * 0.215
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.032, segments=8, ring_count=6, location=(rx, 0.26, rz))
            riv = bpy.context.active_object
            riv.name = f"FrameRivetV_{rx}_{rz_idx}"
            riv.data.materials.append(mat_rivet)

    # 4. INDUSTRIAL OVERHEAD PIPES & BULKHEAD LIGHTS
    for pz in [1.85, 2.0]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=4.4, vertices=16, location=(0, 0.28, pz))
        pipe = bpy.context.active_object
        pipe.rotation_euler = (0, math.radians(90), 0)
        pipe.name = f"CeilingPipe_{pz}"
        pipe.data.materials.append(mat_pipe)

    for px in [-1.85, 1.85]:
        for p_offset in [-0.08, 0.08]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=4.2, vertices=12, location=(px + p_offset, 0.24, 0))
            conduit = bpy.context.active_object
            conduit.name = f"Conduit_{px}_{p_offset}"
            conduit.data.materials.append(mat_pipe)

    # Breaker Box & Pressure Gauges
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.82, 0.28, 0.5))
    breaker_box = bpy.context.active_object
    breaker_box.scale = (0.28, 0.16, 0.65)
    bpy.ops.object.transform_apply(scale=True)
    breaker_box.name = "BreakerBoxHousing"
    breaker_box.data.materials.append(mat_dark_iron)

    for gz in [0.65, 0.38]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.08, vertices=20, location=(1.82, 0.38, gz))
        gauge = bpy.context.active_object
        gauge.rotation_euler = (math.radians(90), 0, 0)
        gauge.name = f"PressureGauge_{gz}"
        gauge.data.materials.append(mat_wheel_steel)

    # Top Left Blue Beacon Siren Lamp
    bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.22, vertices=16, location=(-1.35, 0.32, 1.88))
    siren_blue = bpy.context.active_object
    siren_blue.name = "SirenLampBlue"
    siren_blue.data.materials.append(mat_beacon_blue)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.35, 0.26, 1.88))
    bracket_blue = bpy.context.active_object
    bracket_blue.scale = (0.24, 0.12, 0.28)
    bpy.ops.object.transform_apply(scale=True)
    bracket_blue.name = "SirenBracketBlue"
    bracket_blue.data.materials.append(mat_dark_iron)

    # Top Right Red Emergency Siren Lamp
    bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.22, vertices=16, location=(1.35, 0.32, 1.88))
    siren_red = bpy.context.active_object
    siren_red.name = "SirenLampRed"
    siren_red.data.materials.append(mat_beacon_red)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.35, 0.26, 1.88))
    bracket_red = bpy.context.active_object
    bracket_red.scale = (0.24, 0.12, 0.28)
    bpy.ops.object.transform_apply(scale=True)
    bracket_red.name = "SirenBracketRed"
    bracket_red.data.materials.append(mat_dark_iron)

    # 5. VAULT INTERIOR CHAMBER
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.8, 0))
    chamber = bpy.context.active_object
    chamber.scale = (3.2, 3.2, 3.2)
    bpy.ops.object.transform_apply(scale=True)
    chamber.name = "VaultChamberInterior"
    chamber.data.materials.append(mat_concrete)

    # Gold Bullion Pedestal
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.8, -0.65))
    pedestal = bpy.context.active_object
    pedestal.scale = (1.6, 1.2, 0.45)
    bpy.ops.object.transform_apply(scale=True)
    pedestal.name = "GoldPedestal"
    pedestal.data.materials.append(mat_dark_iron)

    for row in range(3):
        for col in range(4):
            gx = -0.55 + col * 0.38
            gy = -1.6 - row * 0.32
            gz = -0.4 + row * 0.14
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(gx, gy, gz))
            bar = bpy.context.active_object
            bar.scale = (0.32, 0.16, 0.10)
            bpy.ops.object.transform_apply(scale=True)
            bar.name = f"GoldBullion_{row}_{col}"
            bar.data.materials.append(mat_gold_ingot)

    for px, py in [(-0.95, -1.8), (0.95, -1.8)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(px, py, -0.65))
        pallet = bpy.context.active_object
        pallet.scale = (0.65, 0.9, 0.45)
        bpy.ops.object.transform_apply(scale=True)
        pallet.name = f"CashBundle_{px}"
        pallet.data.materials.append(mat_cash)

    # 6. HEAVY DUAL HINGES ON THE LEFT (Pivot at X = -1.25)
    hinge_x = -1.25
    hinge_y = 0.18
    for hz in [-0.75, 0.75]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(hinge_x - 0.16, hinge_y, hz))
        wb = bpy.context.active_object
        wb.scale = (0.22, 0.18, 0.38)
        bpy.ops.object.transform_apply(scale=True)
        wb.name = f"HingeWallMount_{hz}"
        wb.data.materials.append(mat_dark_iron)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.55, vertices=20, location=(hinge_x, hinge_y, hz))
        pin = bpy.context.active_object
        pin.name = f"HingePin_{hz}"
        pin.data.materials.append(mat_wheel_steel)

    # 7. ROTATABLE VAULT DOOR ASSEMBLY (Pivoting at hinge_x = -1.25)
    door_assembly = bpy.data.objects.new("VaultDoorAssembly", None)
    door_assembly.location = (hinge_x, hinge_y, 0)
    bpy.context.collection.objects.link(door_assembly)

    # Main Rounded Bulkhead Door Plate
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, hinge_y, 0))
    door_plate = bpy.context.active_object
    door_plate.scale = (2.15, 0.22, 2.85)
    bpy.ops.object.transform_apply(scale=True)
    door_plate.name = "BulkheadDoorPlate"
    door_plate.data.materials.append(mat_door_face)
    door_plate.parent = door_assembly

    d_mod = door_plate.modifiers.new(name="Bevel", type="BEVEL")
    d_mod.width = 0.10
    d_mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")

    # Inner Recessed Plate Frame
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, hinge_y + 0.08, 0))
    inner_plate = bpy.context.active_object
    inner_plate.scale = (1.82, 0.08, 2.52)
    bpy.ops.object.transform_apply(scale=True)
    inner_plate.name = "DoorInnerRecessPlate"
    inner_plate.data.materials.append(mat_bulkhead_steel)
    inner_plate.parent = door_assembly

    # Perimeter Rivets along Door Rim
    for rz in [-1.30, 1.30]:
        for rx_idx in range(10):
            rx = -0.9 + rx_idx * 0.20
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.028, segments=8, ring_count=6, location=(rx, hinge_y + 0.12, rz))
            riv = bpy.context.active_object
            riv.name = f"DoorRivetH_{rz}_{rx_idx}"
            riv.data.materials.append(mat_rivet)
            riv.parent = door_assembly

    for rx in [-0.98, 0.98]:
        for rz_idx in range(12):
            rz = -1.15 + rz_idx * 0.21
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.028, segments=8, ring_count=6, location=(rx, hinge_y + 0.12, rz))
            riv = bpy.context.active_object
            riv.name = f"DoorRivetV_{rx}_{rz_idx}"
            riv.data.materials.append(mat_rivet)
            riv.parent = door_assembly

    # Massive Horizontal Steel Hinge Arms
    for hz in [-0.75, 0.75]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.28, vertices=20, location=(hinge_x, hinge_y, hz))
        arm_knuckle = bpy.context.active_object
        arm_knuckle.name = f"HingeArmKnuckle_{hz}"
        arm_knuckle.data.materials.append(mat_dark_iron)
        arm_knuckle.parent = door_assembly

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(hinge_x + 0.42, hinge_y + 0.04, hz))
        arm_bar = bpy.context.active_object
        arm_bar.scale = (0.75, 0.14, 0.28)
        bpy.ops.object.transform_apply(scale=True)
        arm_bar.name = f"HingeArmBar_{hz}"
        arm_bar.data.materials.append(mat_dark_iron)
        arm_bar.parent = door_assembly

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(hinge_x + 0.75, hinge_y + 0.12, hz))
        rivet_plate = bpy.context.active_object
        rivet_plate.scale = (0.28, 0.04, 0.24)
        bpy.ops.object.transform_apply(scale=True)
        rivet_plate.name = f"HingeRivetPlate_{hz}"
        rivet_plate.data.materials.append(mat_wheel_steel)
        rivet_plate.parent = door_assembly

        for sx in [-0.08, 0.08]:
            for sz in [-0.07, 0.07]:
                bpy.ops.mesh.primitive_uv_sphere_add(radius=0.026, segments=8, ring_count=6, location=(hinge_x + 0.75 + sx, hinge_y + 0.14, hz + sz))
                stud = bpy.context.active_object
                stud.name = f"HingeStud_{hz}_{sx}_{sz}"
                stud.data.materials.append(mat_rivet)
                stud.parent = door_assembly

    # 8. PROMINENT 6-SPOKE LOCK WHEEL (Spins on central Z axis)
    wheel_assembly = bpy.data.objects.new("LockWheelAssembly", None)
    wheel_assembly.location = (0, hinge_y + 0.16, 0)
    bpy.context.collection.objects.link(wheel_assembly)
    wheel_assembly.parent = door_assembly

    # Central Mounting Boss
    bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.10, vertices=32, location=(0, hinge_y + 0.14, 0))
    boss = bpy.context.active_object
    boss.rotation_euler = (math.radians(90), 0, 0)
    boss.name = "WheelMountingBoss"
    boss.data.materials.append(mat_dark_iron)
    boss.parent = door_assembly

    for b_idx in range(8):
        b_angle = b_idx * (2 * math.pi / 8)
        bx = 0.28 * math.cos(b_angle)
        bz = 0.28 * math.sin(b_angle)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.06, vertices=8, location=(bx, hinge_y + 0.20, bz))
        f_bolt = bpy.context.active_object
        f_bolt.rotation_euler = (math.radians(90), 0, 0)
        f_bolt.name = f"BossBolt_{b_idx}"
        f_bolt.data.materials.append(mat_rivet)
        f_bolt.parent = door_assembly

    # Central Hub
    bpy.ops.mesh.primitive_cylinder_add(radius=0.20, depth=0.18, vertices=28, location=(0, hinge_y + 0.24, 0))
    hub = bpy.context.active_object
    hub.rotation_euler = (math.radians(90), 0, 0)
    hub.name = "WheelHub"
    hub.data.materials.append(mat_chrome_hub)
    hub.parent = wheel_assembly

    # Center Cap Dome
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, segments=16, ring_count=10, location=(0, hinge_y + 0.33, 0))
    cap = bpy.context.active_object
    cap.name = "WheelCenterCap"
    cap.data.materials.append(mat_chrome_hub)
    cap.parent = wheel_assembly

    # Outer Handwheel Ring
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.62,
        minor_radius=0.042,
        major_segments=48,
        minor_segments=16,
        location=(0, hinge_y + 0.26, 0)
    )
    wheel_rim = bpy.context.active_object
    wheel_rim.rotation_euler = (math.radians(90), 0, 0)
    wheel_rim.name = "WheelOuterRim"
    wheel_rim.data.materials.append(mat_wheel_steel)
    wheel_rim.parent = wheel_assembly

    # Inner concentric ring
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.36,
        minor_radius=0.028,
        major_segments=36,
        minor_segments=12,
        location=(0, hinge_y + 0.25, 0)
    )
    inner_rim = bpy.context.active_object
    inner_rim.rotation_euler = (math.radians(90), 0, 0)
    inner_rim.name = "WheelInnerRim"
    inner_rim.data.materials.append(mat_wheel_steel)
    inner_rim.parent = wheel_assembly

    # 6 Radial Spokes
    spoke_len = 0.58
    for s_idx in range(6):
        s_angle = s_idx * (2 * math.pi / 6)
        sx = (spoke_len / 2.0) * math.cos(s_angle)
        sz = (spoke_len / 2.0) * math.sin(s_angle)
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.034,
            depth=spoke_len,
            vertices=14,
            location=(sx, hinge_y + 0.25, sz)
        )
        spoke = bpy.context.active_object
        spoke.rotation_euler = (0, -s_angle, math.radians(90))
        spoke.name = f"WheelSpoke_{s_idx}"
        spoke.data.materials.append(mat_wheel_steel)
        spoke.parent = wheel_assembly

    # 6 Outer Grip Knobs
    for k_idx in range(6):
        k_angle = k_idx * (2 * math.pi / 6)
        kx = 0.62 * math.cos(k_angle)
        kz = 0.62 * math.sin(k_angle)
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=0.052,
            segments=12,
            ring_count=8,
            location=(kx, hinge_y + 0.26, kz)
        )
        knob = bpy.context.active_object
        knob.name = f"WheelGripKnob_{k_idx}"
        knob.data.materials.append(mat_chrome_hub)
        knob.parent = wheel_assembly

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 9. EXPORT GLB
    print(f"Exporting Submarine Vault Door Asset to: {output_path}")
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print("Export Submarine Vault Door Complete!")

if __name__ == "__main__":
    out_file = r"d:\Association\vice-city-heist\public\models\vault_door.glb"
    if len(sys.argv) > 1 and sys.argv[-1].endswith(".glb"):
        out_file = sys.argv[-1]
    build_vault_door(out_file)

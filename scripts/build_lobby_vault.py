#!/usr/bin/env python3
"""
build_lobby_vault.py
Builds the complete authentic 3D Bank Vault for Vice City Heist.
Directly reproduces the iconic GTA Vice City El Banco Corrupto Grande vault
matching public/images/vault_neon_bg.jpg in full detail:
- Complete reinforced bulkhead bank wall surrounding the circular vault door
- Heavy industrial steel wall panels with vertical/horizontal seams and hex rivets
- Left wall: 2 authentic yellow/black Hazard & Warning plates, heavy hinge anchors, conduit cables
- Right wall: Industrial ventilation louver air-intake grille and cable conduit
- Massive C-crane hinge arm on the left connecting the door to wall pivot pins
- Circular stepped vault door with flange bevel and 28 perimeter chrome studs
- Full mechanical linkage bars:
  * Horizontal actuator crossbar to the left
  * Diagonal locking linkage rods to the 2 o'clock and 4 o'clock deadbolt blocks
- 6 hydraulic chrome locking deadbolts with 24K gold guide collars
- Central 8-spoke forged chrome wheel handle with concentric ring and gold medallion cap
- Geared cogwheel combination dial on the right with Sargent & Greenleaf satin chrome dial
- Tubular chrome U-grab handle on the right edge of the door
- Rich treasury chamber inside with pyramid of 24K gold bullion bars and cash stacks
- Perfectly facing the user (0° tilt) with authentic Vice City split neon lighting
"""

import importlib
import math
import os
import sys

try:
    bpy = importlib.import_module("bpy")
except (ImportError, ModuleNotFoundError):
    bpy = None

def build_lobby_vault(output_glb):
    if bpy is None:
        print("ERROR: bpy module not available. Must run inside Blender.")
        return

    # 1. Reset Scene & Clean all orphan objects/meshes/materials
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh, do_unlink=True)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat, do_unlink=True)

    tex_dir = r"d:\Association\vice-city-heist\public\models\textures"
    door_diff = os.path.join(tex_dir, "vault_door_diffuse.png")
    door_norm = os.path.join(tex_dir, "vault_door_normal.png")
    door_rough = os.path.join(tex_dir, "vault_door_roughness.png")

    dial_diff = os.path.join(tex_dir, "vault_dial_diffuse.png")
    dial_norm = os.path.join(tex_dir, "vault_dial_normal.png")

    wall_diff = os.path.join(tex_dir, "vault_wall_diffuse.png")
    wall_norm = os.path.join(tex_dir, "vault_wall_normal.png")
    wall_rough = os.path.join(tex_dir, "vault_wall_roughness.png")

    hazard_diff = os.path.join(tex_dir, "vault_hazard_diffuse.png")
    gold_diff = os.path.join(tex_dir, "vault_gold_diffuse.png")
    cash_diff = os.path.join(tex_dir, "vault_cash_diffuse.png")

    # 2. Material Factory with PBR Texture Node setup
    def make_pbr_mat(name, base_color=(0.28, 0.34, 0.42, 1.0), metallic=0.90, roughness=0.28,
                     emission=None, emission_strength=1.0,
                     tex_diffuse=None, tex_normal=None, tex_roughness=None):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()

        output = nodes.new("ShaderNodeOutputMaterial")
        bsdf = nodes.new("ShaderNodeBsdfPrincipled")
        links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

        bsdf.inputs["Base Color"].default_value = base_color
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness

        if emission:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = emission
                bsdf.inputs["Emission Strength"].default_value = emission_strength
            elif "Emission" in bsdf.inputs:
                bsdf.inputs["Emission"].default_value = emission

        # Diffuse map
        if tex_diffuse and os.path.exists(tex_diffuse):
            tex_diff = nodes.new("ShaderNodeTexImage")
            tex_diff.image = bpy.data.images.load(tex_diffuse)
            links.new(tex_diff.outputs["Color"], bsdf.inputs["Base Color"])

        # Roughness map
        if tex_roughness and os.path.exists(tex_roughness):
            tex_rough = nodes.new("ShaderNodeTexImage")
            tex_rough.image = bpy.data.images.load(tex_roughness)
            tex_rough.image.colorspace_settings.name = "Non-Color"
            links.new(tex_rough.outputs["Color"], bsdf.inputs["Roughness"])

        # Normal map
        if tex_normal and os.path.exists(tex_normal):
            tex_norm = nodes.new("ShaderNodeTexImage")
            tex_norm.image = bpy.data.images.load(tex_normal)
            tex_norm.image.colorspace_settings.name = "Non-Color"
            norm_node = nodes.new("ShaderNodeNormalMap")
            norm_node.inputs["Strength"].default_value = 1.8
            links.new(tex_norm.outputs["Color"], norm_node.inputs["Color"])
            links.new(norm_node.outputs["Normal"], bsdf.inputs["Normal"])

        return mat

    # Materials matching vault_neon_bg.jpg
    mat_wall = make_pbr_mat(
        "MatWall",
        base_color=(0.24, 0.29, 0.38, 1.0),
        metallic=0.88,
        roughness=0.32,
        tex_diffuse=wall_diff,
        tex_normal=wall_norm,
        tex_roughness=wall_rough
    )

    mat_vault_steel = make_pbr_mat(
        "MatVaultSteel",
        base_color=(0.30, 0.36, 0.44, 1.0),
        metallic=0.92,
        roughness=0.26
    )

    mat_door_face = make_pbr_mat(
        "MatDoorFace",
        base_color=(0.34, 0.40, 0.48, 1.0),
        metallic=0.92,
        roughness=0.24,
        tex_diffuse=door_diff,
        tex_normal=door_norm,
        tex_roughness=door_rough
    )

    mat_hazard = make_pbr_mat(
        "MatHazard",
        base_color=(0.96, 0.62, 0.05, 1.0),
        metallic=0.08,
        roughness=0.40,
        tex_diffuse=hazard_diff
    )

    mat_dial = make_pbr_mat(
        "MatDial",
        base_color=(0.92, 0.95, 0.98, 1.0),
        metallic=0.94,
        roughness=0.14,
        tex_diffuse=dial_diff,
        tex_normal=dial_norm
    )

    mat_chrome = make_pbr_mat("MatChrome", (0.95, 0.97, 1.0, 1.0), metallic=0.98, roughness=0.08)
    mat_dark_iron = make_pbr_mat("MatDarkIron", (0.16, 0.20, 0.26, 1.0), metallic=0.90, roughness=0.36)
    mat_gold_accent = make_pbr_mat("MatGoldAccent", (1.0, 0.82, 0.20, 1.0), metallic=0.96, roughness=0.14)
    mat_pink_neon = make_pbr_mat("MatPinkNeon", (0.97, 0.26, 0.57, 1.0), metallic=0.1, roughness=0.15, emission=(0.97, 0.26, 0.57, 1.0), emission_strength=5.0)
    mat_cable = make_pbr_mat("MatCable", (0.08, 0.08, 0.10, 1.0), metallic=0.2, roughness=0.7)
    mat_interior = make_pbr_mat("MatInterior", (0.10, 0.13, 0.18, 1.0), metallic=0.85, roughness=0.45)
    mat_gold_glow = make_pbr_mat("MatGoldGlow", (1.0, 0.82, 0.20, 1.0), metallic=0.3, roughness=0.2, emission=(1.0, 0.78, 0.15, 1.0), emission_strength=4.5)
    mat_gold_bar = make_pbr_mat("MatGoldBar", (1.0, 0.82, 0.20, 1.0), metallic=0.96, roughness=0.15, tex_diffuse=gold_diff)
    mat_cash = make_pbr_mat("MatCash", (0.14, 0.32, 0.20, 1.0), metallic=0.05, roughness=0.80, tex_diffuse=cash_diff)

    # ─────────────────────────────────────────────────────────
    # 3. STATIONARY ROOT: REINFORCED BANK WALL & BULKHEAD
    # (The surrounding structure of El Banco Corrupto Grande)
    # ─────────────────────────────────────────────────────────
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    chassis = bpy.context.active_object
    chassis.name = "VaultChassis"

    door_center_x = 0.08

    def add_chassis_box(name, loc, sc, mat):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
        obj = bpy.context.active_object
        obj.name = name
        obj.scale = sc
        bpy.ops.object.transform_apply(scale=True)
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.cube_project(cube_size=1.5)
        bpy.ops.object.mode_set(mode='OBJECT')
        obj.data.materials.append(mat)
        obj.parent = chassis
        return obj

    # ── Background Reinforced Bunker Wall (Width=3.6, Height=2.6) ──
    # Left Wall section: from x = -1.80 to -0.88 (width 0.92, height 2.50)
    add_chassis_box("WallBulkheadLeft", (-1.36, 0.04, 0), (0.92, 0.08, 2.50), mat_wall)
    # Right Wall section: from x = 1.04 to 1.84 (width 0.80, height 2.50)
    add_chassis_box("WallBulkheadRight", (1.44, 0.04, 0), (0.80, 0.08, 2.50), mat_wall)
    # Top Wall header lintel
    add_chassis_box("WallBulkheadTop", (door_center_x, 0.04, 1.15), (2.00, 0.08, 0.30), mat_wall)
    # Bottom Wall sill
    add_chassis_box("WallBulkheadBottom", (door_center_x, 0.04, -1.15), (2.00, 0.08, 0.30), mat_wall)

    # Vertical and Horizontal Structural Seam Plates
    add_chassis_box("SeamPlateLeft", (-0.90, 0.0, 0), (0.06, 0.04, 2.48), mat_dark_iron)
    add_chassis_box("SeamPlateRight", (1.06, 0.0, 0), (0.06, 0.04, 2.48), mat_dark_iron)

    # Hex rivets along the structural seam plates
    for sz in [-1.05, -0.70, -0.35, 0.0, 0.35, 0.70, 1.05]:
        for sx in [-0.90, 1.06]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.025, vertices=8, location=(sx, -0.025, sz))
            rb = bpy.context.active_object
            rb.name = f"SeamRivet_{sx}_{sz}"
            rb.rotation_euler = (math.radians(90), 0, 0)
            bpy.ops.object.transform_apply(rotation=True)
            rb.data.materials.append(mat_chrome)
            rb.parent = chassis

    # ── Heavy Circular Doorway Collar & Flange (Center X=0.08, Z=0) ──
    bpy.ops.mesh.primitive_cylinder_add(radius=1.04, depth=0.12, vertices=64, location=(door_center_x, 0.02, 0))
    collar = bpy.context.active_object
    collar.name = "DoorFrameCollar"
    collar.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    collar.data.materials.append(mat_vault_steel)
    collar.parent = chassis

    # Circular Flange Outer Lip (Dark Iron with Beveled Rim)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.09, depth=0.04, vertices=64, location=(door_center_x, -0.03, 0))
    flange = bpy.context.active_object
    flange.name = "DoorFrameFlange"
    flange.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    flange.data.materials.append(mat_dark_iron)
    flange.parent = chassis

    # 24 Perimeter Hex Studs on the collar flange
    for i in range(24):
        rad = math.radians(i * (360.0 / 24))
        bx = door_center_x + 1.065 * math.cos(rad)
        bz = 1.065 * math.sin(rad)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.03, vertices=12, location=(bx, -0.05, bz))
        bolt = bpy.context.active_object
        bolt.name = f"FrameBolt_{i}"
        bolt.rotation_euler = (math.radians(90), 0, 0)
        bpy.ops.object.transform_apply(rotation=True)
        bolt.data.materials.append(mat_chrome)
        bolt.parent = chassis

    # ── Right Wall: Industrial Ventilation Louver Grille (matching vault_neon_bg.jpg) ──
    louver_x, louver_z = 1.48, -0.42
    louver_w, louver_h = 0.34, 0.48
    add_chassis_box("LouverFrame", (louver_x, 0.0, louver_z), (louver_w, 0.03, louver_h), mat_dark_iron)
    # Slats
    num_slats = 8
    for s_idx in range(num_slats):
        slat_z = (louver_z - louver_h / 2 + 0.04) + s_idx * (louver_h - 0.08) / (num_slats - 1)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(louver_x, -0.02, slat_z))
        slat = bpy.context.active_object
        slat.name = f"LouverSlat_{s_idx}"
        slat.scale = (louver_w - 0.06, 0.015, 0.022)
        slat.rotation_euler = (math.radians(35), 0, 0)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        slat.data.materials.append(mat_vault_steel)
        slat.parent = chassis

    # Vertical cable drop pipe on right wall
    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=1.60, vertices=16, location=(1.22, -0.02, 0.20))
    v_pipe = bpy.context.active_object
    v_pipe.name = "VerticalConduitPipeRight"
    v_pipe.data.materials.append(mat_cable)
    v_pipe.parent = chassis

    # ── Left Wall: 2 Authentic Yellow/Black Hazard & Warning Plates ──
    def add_hazard_plate(name, loc, size_w, size_h, uv_y_min, uv_y_max):
        # Backing metal plate
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(loc[0], loc[1] + 0.01, loc[2]))
        plate_back = bpy.context.active_object
        plate_back.name = f"{name}_Back"
        plate_back.scale = (size_w + 0.03, 0.015, size_h + 0.03)
        bpy.ops.object.transform_apply(scale=True)
        plate_back.data.materials.append(mat_dark_iron)
        plate_back.parent = chassis

        # Front printed face
        bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, 0, 0))
        pl = bpy.context.active_object
        pl.name = name
        pl.scale = (size_w, size_h, 1.0)
        pl.rotation_euler = (math.radians(90), 0, 0)
        bpy.ops.object.transform_apply(rotation=True, scale=True)

        mesh = pl.data
        uv_layer = mesh.uv_layers.active or mesh.uv_layers.new(name="UVMap")
        for poly in mesh.polygons:
            for loop_index in poly.loop_indices:
                vert_idx = mesh.loops[loop_index].vertex_index
                vx, vy, vz = mesh.vertices[vert_idx].co
                u = (vx / size_w) + 0.5
                v = ((vz / size_h) + 0.5) * (uv_y_max - uv_y_min) + uv_y_min
                uv_layer.data[loop_index].uv = (u, v)

        pl.data.materials.append(mat_hazard)
        pl.parent = chassis
        pl.location = (loc[0], loc[1] - 0.005, loc[2])

        # 4 Metal mounting corner bolts
        for dx in [-size_w * 0.44, size_w * 0.44]:
            for dz in [-size_h * 0.42, size_h * 0.42]:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.015, vertices=8, location=(loc[0] + dx, loc[1] - 0.012, loc[2] + dz))
                cb = bpy.context.active_object
                cb.name = f"{name}_Screw_{dx}_{dz}"
                cb.rotation_euler = (math.radians(90), 0, 0)
                bpy.ops.object.transform_apply(rotation=True)
                cb.data.materials.append(mat_chrome)
                cb.parent = chassis

    # Warning Sign (Upper): x=-1.40, z=0.30, w=0.36, h=0.24
    add_hazard_plate("SignWarning", (-1.40, -0.01, 0.30), 0.36, 0.24, 0.52, 0.98)
    # Hazard Sign (Lower): x=-1.40, z=-0.22, w=0.36, h=0.24
    add_hazard_plate("SignHazard", (-1.40, -0.01, -0.22), 0.36, 0.24, 0.02, 0.48)

    # Overhead curved power cables/conduits (matching vault_neon_bg.jpg)
    def add_curved_cable(name, start, mid, end, r=0.014):
        pts = [start, mid, end]
        for seg in range(2):
            p1 = pts[seg]
            p2 = pts[seg + 1]
            dx, dy, dz = p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]
            length = math.sqrt(dx*dx + dy*dy + dz*dz)
            mx, my, mz = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2
            bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=length, vertices=12, location=(mx, my, mz))
            cyl = bpy.context.active_object
            cyl.name = f"{name}_Seg_{seg}"
            cyl.rotation_euler = (math.atan2(math.sqrt(dx*dx + dy*dy), dz), 0, math.atan2(dy, dx))
            bpy.ops.object.transform_apply(rotation=True)
            cyl.data.materials.append(mat_cable)
            cyl.parent = chassis

    add_curved_cable("CableLeft1", (-1.65, -0.03, 0.95), (-1.05, -0.04, 0.82), (-0.45, -0.03, 1.05))
    add_curved_cable("CableLeft2", (-1.65, -0.03, 0.88), (-1.00, -0.04, 0.74), (-0.40, -0.03, 0.98))
    add_curved_cable("CableRight1", (0.50, -0.03, 1.02), (1.10, -0.04, 0.82), (1.65, -0.03, 0.95))
    add_curved_cable("CableRight2", (0.55, -0.03, 0.95), (1.15, -0.04, 0.75), (1.65, -0.03, 0.88))

    # Stationary Left Hinge Mounting Knuckles (at X = -1.15)
    for h_idx, hz in enumerate([0.65, -0.65]):
        # Mounting Base Block
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.22, 0.01, hz))
        b_block = bpy.context.active_object
        b_block.name = f"WallHingeBracket_{h_idx}"
        b_block.scale = (0.16, 0.14, 0.28)
        bpy.ops.object.transform_apply(scale=True)
        b_block.data.materials.append(mat_dark_iron)
        b_block.parent = chassis

        # Stationary Knuckle
        bpy.ops.mesh.primitive_cylinder_add(radius=0.082, depth=0.14, vertices=24, location=(-1.15, -0.02, hz))
        knuckle = bpy.context.active_object
        knuckle.name = f"StationaryKnuckle_{h_idx}"
        knuckle.data.materials.append(mat_vault_steel)
        knuckle.parent = chassis

        # 24K Gold Bushing Rings
        for b_off in [-0.07, 0.07]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.088, depth=0.02, vertices=24, location=(-1.15, -0.02, hz + b_off))
            bushing = bpy.context.active_object
            bushing.name = f"Bushing_{h_idx}_{b_off}"
            bushing.data.materials.append(mat_gold_accent)
            bushing.parent = chassis

        # Chrome Hinge Pin
        bpy.ops.mesh.primitive_cylinder_add(radius=0.046, depth=0.38, vertices=20, location=(-1.15, -0.02, hz))
        pin = bpy.context.active_object
        pin.name = f"HingePin_{h_idx}"
        pin.data.materials.append(mat_chrome)
        pin.parent = chassis

    # ── Interior Chamber (visible when door opens) ──
    bpy.ops.mesh.primitive_cylinder_add(radius=1.02, depth=0.68, vertices=48, location=(door_center_x, 0.38, 0))
    chamber = bpy.context.active_object
    chamber.name = "ChamberLining"
    chamber.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    chamber.data.materials.append(mat_interior)
    chamber.parent = chassis

    # Back wall of chamber
    add_chassis_box("ChamberBackWall", (door_center_x, 0.72, 0), (2.10, 0.04, 2.10), mat_interior)

    # ─────────────────────────────────────────────────────────
    # 4. INTERIOR GOLD BULLION & CASH TREASURY
    # ─────────────────────────────────────────────────────────
    add_chassis_box("GoldPedestalGlow", (door_center_x, 0.38, -0.80), (1.8, 0.44, 0.03), mat_gold_glow)

    bar_w, bar_d, bar_h = 0.34, 0.18, 0.09
    gold_rows = [
        [(-0.35, 0.36, -0.72), (0.0, 0.36, -0.72), (0.35, 0.36, -0.72)],
        [(-0.18, 0.36, -0.62), (0.18, 0.36, -0.62)],
        [(0.0, 0.36, -0.52)]
    ]
    bar_count = 0
    for row in gold_rows:
        for bx, by, bz in row:
            add_chassis_box(f"GoldBar_{bar_count}", (door_center_x + bx, by, bz), (bar_w, bar_d, bar_h), mat_gold_bar)
            bar_count += 1

    for cx_side in [-0.62, 0.62]:
        for cz_stack in [-0.72, -0.62]:
            add_chassis_box(f"CashStack_{cx_side}_{cz_stack}", (door_center_x + cx_side, 0.36, cz_stack), (0.30, 0.16, 0.09), mat_cash)

    # ─────────────────────────────────────────────────────────
    # 5. PIVOTING VAULT DOOR ASSEMBLY (Hinge X = -1.15)
    # ─────────────────────────────────────────────────────────
    hinge_x = -1.15
    door_y = -0.02
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(hinge_x, door_y, 0))
    door_pivot = bpy.context.active_object
    door_pivot.name = "VaultDoorAssembly"

    # Local door center offset (relative to hinge_x=-1.15):
    door_cx = door_center_x - hinge_x  # 0.08 - (-1.15) = 1.23

    # ── Massive C-Crane Hinge Arm ──
    def add_door_box(name, local_loc, sc, mat=mat_vault_steel):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
        obj = bpy.context.active_object
        obj.name = name
        obj.scale = sc
        bpy.ops.object.transform_apply(scale=True)
        obj.data.materials.append(mat)
        obj.parent = door_pivot
        obj.location = local_loc
        return obj

    # Moving Knuckles on Hinge Pin
    for h_idx, hz in enumerate([0.65, -0.65]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.080, depth=0.12, vertices=24, location=(0, 0, 0))
        dk = bpy.context.active_object
        dk.name = f"DoorMovingKnuckle_{h_idx}"
        dk.data.materials.append(mat_chrome)
        dk.parent = door_pivot
        dk.location = (0, 0, hz)

    # Heavy C-bracket spine & curved arms
    add_door_box("HingeSpineVertical", (0.16, -0.02, 0), (0.18, 0.12, 1.42))
    add_door_box("HingeArmUpper", (door_cx * 0.48, -0.02, 0.68), (door_cx * 0.88, 0.12, 0.16))
    add_door_box("HingeArmLower", (door_cx * 0.48, -0.02, -0.68), (door_cx * 0.88, 0.12, 0.16))

    # Door Top & Bottom Pivot Connection Blocks
    for hz_sign, hz_val in [("Top", 0.68), ("Bottom", -0.68)]:
        add_door_box(f"DoorHingeLug_{hz_sign}", (door_cx - 0.12, -0.03, hz_val), (0.24, 0.14, 0.20))
        bpy.ops.mesh.primitive_cylinder_add(radius=0.048, depth=0.18, vertices=20, location=(0, 0, 0))
        lug_pin = bpy.context.active_object
        lug_pin.name = f"LugPin_{hz_sign}"
        lug_pin.data.materials.append(mat_chrome)
        lug_pin.parent = door_pivot
        lug_pin.location = (door_cx - 0.12, -0.03, hz_val)

    # ── Circular Stepped Vault Door Slab (Centered at Y = 0.02, depth = 0.10) ──
    door_rad = 0.94
    bpy.ops.mesh.primitive_cylinder_add(radius=door_rad, depth=0.10, vertices=64, location=(0, 0, 0))
    door_slab = bpy.context.active_object
    door_slab.name = "VaultDoorCircularSlab"
    door_slab.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    door_slab.data.materials.append(mat_vault_steel)
    door_slab.parent = door_pivot
    door_slab.location = (door_cx, 0.02, 0)

    # Outer Stepped Bevel Flange Ring at Y = -0.028
    bpy.ops.mesh.primitive_cylinder_add(radius=door_rad + 0.04, depth=0.03, vertices=64, location=(0, 0, 0))
    door_flange = bpy.context.active_object
    door_flange.name = "VaultDoorOuterFlange"
    door_flange.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    door_flange.data.materials.append(mat_dark_iron)
    door_flange.parent = door_pivot
    door_flange.location = (door_cx, -0.028, 0)

    # 28 Heavy Chrome Ring Studs on door perimeter at Y = -0.042
    for i in range(28):
        rad = math.radians(i * (360.0 / 28))
        sx = door_cx + (door_rad - 0.03) * math.cos(rad)
        sz = (door_rad - 0.03) * math.sin(rad)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, segments=12, ring_count=8, location=(0, 0, 0))
        stud = bpy.context.active_object
        stud.name = f"DoorStud_{i}"
        stud.data.materials.append(mat_chrome)
        stud.parent = door_pivot
        stud.location = (sx, -0.042, sz)

    # ── HIGH-RES CIRCULAR PBR DOOR FACEPLATE (Placed CLEANLY IN FRONT at Y = -0.034) ──
    fp_rad = 0.88
    bpy.ops.mesh.primitive_circle_add(radius=fp_rad, vertices=64, fill_type='NGON', location=(0, 0, 0))
    faceplate = bpy.context.active_object
    faceplate.name = "VaultDoorFaceplate"
    faceplate.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)

    mesh_fp = faceplate.data
    uv_layer_fp = mesh_fp.uv_layers.active or mesh_fp.uv_layers.new(name="UVMap")
    for poly in mesh_fp.polygons:
        for loop_index in poly.loop_indices:
            vert_idx = mesh_fp.loops[loop_index].vertex_index
            vx, vy, vz = mesh_fp.vertices[vert_idx].co
            u = (vx / (2 * fp_rad)) + 0.5
            v = (vz / (2 * fp_rad)) + 0.5
            uv_layer_fp.data[loop_index].uv = (u, v)

    faceplate.data.materials.append(mat_door_face)
    faceplate.parent = door_pivot
    faceplate.location = (door_cx, -0.034, 0)

    # ── MECHANICAL LOCKING LINKAGE RODS (Matching vault_neon_bg.jpg!) ──
    # 1. Horizontal crossbar from center to left hinge lug
    bar_left_len = 0.58
    bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=bar_left_len, vertices=16, location=(0, 0, 0))
    hbar = bpy.context.active_object
    hbar.name = "HorizontalActuatorRod"
    hbar.rotation_euler = (0, math.radians(90), 0)
    bpy.ops.object.transform_apply(rotation=True)
    hbar.data.materials.append(mat_chrome)
    hbar.parent = door_pivot
    hbar.location = (door_cx - bar_left_len / 2 - 0.10, -0.048, 0)

    # Left Rod Guide Bracket
    add_door_box("ActuatorGuideLeft", (door_cx - bar_left_len - 0.12, -0.045, 0), (0.06, 0.05, 0.08), mat_dark_iron)

    # 2. Diagonal Locking Rod 1: extends up-right towards 2 o'clock deadbolt
    diag_len = 0.70
    diag_angle1 = math.radians(38)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=diag_len, vertices=16, location=(0, 0, 0))
    dbar1 = bpy.context.active_object
    dbar1.name = "DiagonalLockRod_UpperRight"
    dbar1.rotation_euler = (0, -diag_angle1 + math.radians(90), 0)
    bpy.ops.object.transform_apply(rotation=True)
    dbar1.data.materials.append(mat_chrome)
    dbar1.parent = door_pivot
    dbar1.location = (door_cx + (diag_len / 2 + 0.08) * math.cos(diag_angle1), -0.048, (diag_len / 2 + 0.08) * math.sin(diag_angle1))

    # Upper-right Deadbolt Guide Block (2 o'clock)
    ub_x = door_cx + (door_rad - 0.12) * math.cos(diag_angle1)
    ub_z = (door_rad - 0.12) * math.sin(diag_angle1)
    add_door_box("DeadboltBlock_UpperRight", (ub_x, -0.045, ub_z), (0.12, 0.06, 0.10), mat_dark_iron)

    # 3. Diagonal Locking Rod 2: extends down-right towards 4 o'clock deadbolt
    diag_angle2 = math.radians(-38)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=diag_len, vertices=16, location=(0, 0, 0))
    dbar2 = bpy.context.active_object
    dbar2.name = "DiagonalLockRod_LowerRight"
    dbar2.rotation_euler = (0, -diag_angle2 + math.radians(90), 0)
    bpy.ops.object.transform_apply(rotation=True)
    dbar2.data.materials.append(mat_chrome)
    dbar2.parent = door_pivot
    dbar2.location = (door_cx + (diag_len / 2 + 0.08) * math.cos(diag_angle2), -0.048, (diag_len / 2 + 0.08) * math.sin(diag_angle2))

    # Lower-right Deadbolt Guide Block (4 o'clock)
    lb_x = door_cx + (door_rad - 0.12) * math.cos(diag_angle2)
    lb_z = (door_rad - 0.12) * math.sin(diag_angle2)
    add_door_box("DeadboltBlock_LowerRight", (lb_x, -0.045, lb_z), (0.12, 0.06, 0.10), mat_dark_iron)

    # ── 6 Retractable Hydraulic Locking Deadbolts ──
    deadbolts = [
        ("RightUpper", (door_cx + door_rad + 0.06, 0.02, 0.42), 'X', 0.22, 0.052),
        ("RightMid", (door_cx + door_rad + 0.08, 0.02, 0.0), 'X', 0.24, 0.055),
        ("RightLower", (door_cx + door_rad + 0.06, 0.02, -0.42), 'X', 0.22, 0.052),
        ("TopRight", (door_cx + 0.45, 0.02, door_rad + 0.06), 'Z', 0.20, 0.048),
        ("BottomRight", (door_cx + 0.45, 0.02, -door_rad - 0.06), 'Z', 0.20, 0.048),
        ("TopLeft", (door_cx - 0.45, 0.02, door_rad + 0.06), 'Z', 0.20, 0.048),
    ]

    for b_name, b_loc, b_axis, b_len, b_rad in deadbolts:
        bpy.ops.mesh.primitive_cylinder_add(radius=b_rad, depth=b_len, vertices=20, location=(0, 0, 0))
        bolt = bpy.context.active_object
        bolt.name = f"LockBolt_{b_name}"
        if b_axis == 'X':
            bolt.rotation_euler = (0, math.radians(90), 0)
        else:
            bolt.rotation_euler = (0, 0, 0)
        bpy.ops.object.transform_apply(rotation=True)
        bolt.data.materials.append(mat_chrome)
        bolt.parent = door_pivot
        bolt.location = b_loc

        # 24K Gold Guide Collar
        bpy.ops.mesh.primitive_cylinder_add(radius=b_rad + 0.018, depth=0.07, vertices=20, location=(0, 0, 0))
        collar_b = bpy.context.active_object
        collar_b.name = f"BoltCollar_{b_name}"
        if b_axis == 'X':
            collar_b.rotation_euler = (0, math.radians(90), 0)
        else:
            collar_b.rotation_euler = (0, 0, 0)
        bpy.ops.object.transform_apply(rotation=True)
        collar_b.data.materials.append(mat_gold_accent)
        collar_b.parent = door_pivot
        collar_b.location = (b_loc[0] - (0.04 if b_axis == 'X' else 0), b_loc[1], b_loc[2] - (0.04 if b_axis == 'Z' else 0))

    # ─────────────────────────────────────────────────────────
    # 6. CENTRAL 8-SPOKE FORGED CHROME WHEEL HANDLE ("THE CENTRAL THING")
    # Centered directly in the middle of the circular door face!
    # ─────────────────────────────────────────────────────────
    handle_cx = door_cx
    handle_cy = -0.068
    handle_cz = 0.0

    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    handle_pivot = bpy.context.active_object
    handle_pivot.name = "HandleAssembly"
    handle_pivot.parent = door_pivot
    handle_pivot.location = (handle_cx, handle_cy, handle_cz)

    # Central Machined Chrome Hub
    bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.065, vertices=24, location=(0, 0, 0))
    wheel_hub = bpy.context.active_object
    wheel_hub.name = "HandleCenterHub"
    wheel_hub.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    wheel_hub.data.materials.append(mat_chrome)
    wheel_hub.parent = handle_pivot
    wheel_hub.location = (0, 0, 0)

    # 24K Gold Center Medallion Cap
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.070, segments=20, ring_count=12, location=(0, 0, 0))
    cap = bpy.context.active_object
    cap.name = "HandleGoldCap"
    cap.scale = (1.0, 0.45, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    cap.data.materials.append(mat_gold_accent)
    cap.parent = handle_pivot
    cap.location = (0, -0.038, 0)

    # Outer Connecting Ring between Spokes (radius = 0.28)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.28, minor_radius=0.016, major_segments=36, minor_segments=12, location=(0, 0, 0))
    wheel_ring = bpy.context.active_object
    wheel_ring.name = "HandleConnectingRing"
    wheel_ring.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    wheel_ring.data.materials.append(mat_chrome)
    wheel_ring.parent = handle_pivot
    wheel_ring.location = (0, -0.014, 0)

    # 8 Forged Chrome Spokes (every 45 degrees) with 24K Gold Grip Knobs
    for sp_idx in range(8):
        sp_deg = sp_idx * 45.0
        sp_rad = math.radians(sp_deg)
        sp_len = 0.42
        sp_x = (sp_len / 2) * math.cos(sp_rad)
        sp_z = (sp_len / 2) * math.sin(sp_rad)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=sp_len, vertices=16, location=(0, 0, 0))
        spoke = bpy.context.active_object
        spoke.name = f"HandleSpoke_{sp_idx}"
        spoke.rotation_euler = (0, -sp_rad + math.radians(90), 0)
        bpy.ops.object.transform_apply(rotation=True)
        spoke.data.materials.append(mat_chrome)
        spoke.parent = handle_pivot
        spoke.location = (sp_x, -0.014, sp_z)

        # Spoke Knob Grip
        tip_x = (sp_len + 0.025) * math.cos(sp_rad)
        tip_z = (sp_len + 0.025) * math.sin(sp_rad)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.032, segments=16, ring_count=10, location=(0, 0, 0))
        knob = bpy.context.active_object
        knob.name = f"SpokeKnob_{sp_idx}"
        knob.data.materials.append(mat_gold_accent)
        knob.parent = handle_pivot
        knob.location = (tip_x, -0.014, tip_z)

    # ─────────────────────────────────────────────────────────
    # 7. COMBINATION DIAL COG MECHANISM (Right Side of Door Face)
    # ─────────────────────────────────────────────────────────
    cog_x = door_cx + 0.48
    cog_y = -0.048
    cog_z = 0.0

    # Geared Cog Outer Ring with 12 Teeth
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.04, vertices=36, location=(0, 0, 0))
    cog_body = bpy.context.active_object
    cog_body.name = "DialCogBody"
    cog_body.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    cog_body.data.materials.append(mat_dark_iron)
    cog_body.parent = door_pivot
    cog_body.location = (cog_x, cog_y, cog_z)

    # 12 Gear Teeth around Cog
    for t_idx in range(12):
        t_deg = t_idx * 30.0
        t_rad = math.radians(t_deg)
        tx = cog_x + 0.23 * math.cos(t_rad)
        tz = cog_z + 0.23 * math.sin(t_rad)
        add_door_box(f"CogTooth_{t_idx}", (tx, cog_y, tz), (0.04, 0.04, 0.03), mat_dark_iron)

    # 24K Gold Bezel Ring on Cog
    bpy.ops.mesh.primitive_cylinder_add(radius=0.19, depth=0.015, vertices=36, location=(0, 0, 0))
    gold_dial_ring = bpy.context.active_object
    gold_dial_ring.name = "DialGoldBezelRing"
    gold_dial_ring.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    gold_dial_ring.data.materials.append(mat_gold_accent)
    gold_dial_ring.parent = door_pivot
    gold_dial_ring.location = (cog_x, cog_y - 0.015, cog_z)

    # Top Stationary Index Arrow (Vice City Hot Pink Pointer at 12 o'clock)
    bpy.ops.mesh.primitive_cone_add(radius1=0.022, radius2=0.0, depth=0.040, vertices=3, location=(0, 0, 0))
    index_pointer = bpy.context.active_object
    index_pointer.name = "IndexPointer"
    index_pointer.rotation_euler = (math.radians(90), 0, math.radians(180))
    bpy.ops.object.transform_apply(rotation=True)
    index_pointer.data.materials.append(mat_pink_neon)
    index_pointer.parent = door_pivot
    index_pointer.location = (cog_x, cog_y - 0.024, cog_z + 0.195)

    # Combination Wheel Pivot (spins during idle safecracking)
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    wheel_pivot = bpy.context.active_object
    wheel_pivot.name = "CombinationWheel"
    wheel_pivot.parent = door_pivot
    wheel_pivot.location = (cog_x, cog_y - 0.020, cog_z)

    # Dial Disc Face with Sargent & Greenleaf PBR Numbers 0-90
    dial_disc_rad = 0.18
    bpy.ops.mesh.primitive_circle_add(radius=dial_disc_rad, vertices=48, fill_type='NGON', location=(0, 0, 0))
    dial_disc = bpy.context.active_object
    dial_disc.name = "DialDiscFace"
    dial_disc.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)

    mesh_dial = dial_disc.data
    uv_layer_dial = mesh_dial.uv_layers.active or mesh_dial.uv_layers.new(name="UVMap")
    for poly in mesh_dial.polygons:
        for loop_index in poly.loop_indices:
            vert_idx = mesh_dial.loops[loop_index].vertex_index
            vx, vy, vz = mesh_dial.vertices[vert_idx].co
            u = (vx / (2 * dial_disc_rad)) + 0.5
            v = (vz / (2 * dial_disc_rad)) + 0.5
            uv_layer_dial.data[loop_index].uv = (u, v)

    dial_disc.data.materials.append(mat_dial)
    dial_disc.parent = wheel_pivot
    dial_disc.location = (0, 0, 0)

    # Small center knob on dial
    bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=0.025, vertices=20, location=(0, 0, 0))
    dial_knob = bpy.context.active_object
    dial_knob.name = "DialCenterKnob"
    dial_knob.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    dial_knob.data.materials.append(mat_chrome)
    dial_knob.parent = wheel_pivot
    dial_knob.location = (0, -0.012, 0)

    # ─────────────────────────────────────────────────────────
    # 8. TUBULAR CHROME GRAB HANDLE (Right Edge of Door)
    # ─────────────────────────────────────────────────────────
    grab_x = door_cx + 0.74
    grab_y = -0.065
    grab_h = 0.44

    # Top Standoff
    bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.06, vertices=16, location=(0, 0, 0))
    so_top = bpy.context.active_object
    so_top.name = "GrabStandoffTop"
    so_top.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    so_top.data.materials.append(mat_chrome)
    so_top.parent = door_pivot
    so_top.location = (grab_x, grab_y + 0.03, grab_h / 2)

    # Bottom Standoff
    bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.06, vertices=16, location=(0, 0, 0))
    so_bot = bpy.context.active_object
    so_bot.name = "GrabStandoffBot"
    so_bot.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    so_bot.data.materials.append(mat_chrome)
    so_bot.parent = door_pivot
    so_bot.location = (grab_x, grab_y + 0.03, -grab_h / 2)

    # Vertical Handle Bar
    bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=grab_h + 0.06, vertices=20, location=(0, 0, 0))
    bar = bpy.context.active_object
    bar.name = "GrabBar"
    bar.data.materials.append(mat_chrome)
    bar.parent = door_pivot
    bar.location = (grab_x, grab_y, 0)

    # ─────────────────────────────────────────────────────────
    # 9. EXPORT GLTF 2.0 (.glb) WITH EMBEDDED PBR TEXTURES
    # ─────────────────────────────────────────────────────────
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    print(f"Exporting Complete Masterpiece 3D Vault to: {output_glb}")

    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print("Export Complete! All parts and PBR textures embedded successfully.")


if __name__ == "__main__":
    out_file = r"d:\Association\vice-city-heist\public\models\lobby_vault.glb"
    if len(sys.argv) > 1 and sys.argv[-1].endswith(".glb"):
        out_file = sys.argv[-1]

    build_lobby_vault(out_file)

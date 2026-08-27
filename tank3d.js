import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { gsap } from "./vendor/gsap.module.js";
import ScrollTrigger from "./vendor/ScrollTrigger.module.js";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.innerWidth <= 860;

// VISUAL DEMO VALUE — replace with verified WINKO dimensions before using the scene for engineering work.
const TANK_SPEC = Object.freeze({
  panelWidth: 1.36,
  panelHeight: 1.36,
  tankPanelsX: 4,
  tankPanelsZ: 3,
  tankLevels: 2
});

const STAGES = [
  { key: "foundation", fallback: "FOUNDATION", detail: "Structure starts at the base." },
  { key: "baseFrame", fallback: "BASE FRAME", detail: "The supporting frame establishes the tank footprint." },
  { key: "basePanels", fallback: "BASE PANELS", detail: "The 4 × 3 panel grid establishes the floor." },
  { key: "lowerWalls", fallback: "FIRST WALL LEVEL", detail: "Pressed panels and external flanges form the first level." },
  { key: "firstTierStays", fallback: "FIRST-TIER ANGLE STAYS + CLEATS", detail: "Organized angle stays land into visible cleat nodes." },
  { key: "upperWalls", fallback: "UPPER WALL LEVEL", detail: "The modular wall rises panel by panel." },
  { key: "upperStays", fallback: "UPPER INTERNAL SUPPORTS", detail: "Vertical supports connect the tank to the roof support line." },
  { key: "roofSupport", fallback: "ROOF TRUSS / ROOF SUPPORT", detail: "Roof beams and the opposite truss support the cover." },
  { key: "roofPanels", fallback: "ROOF PANELS", detail: "The complete roof footprint closes the storage volume." },
  { key: "accessories", fallback: "LADDER / MANHOLE / VENT / LEVEL INDICATOR", detail: "Access and inspection components arrive from outside the tank." },
  { key: "pipework", fallback: "PIPEWORK", detail: "Dark steel connections complete the presentation." },
  { key: "complete", fallback: "COMPLETE", detail: "WINKO tank assembly view." }
];

const STAGE_BUTTON_INDICES = STAGES.map((_, index) => index);
const UNIT_Z = new THREE.Vector3(0, 0, 1);
const PANEL_FACE = Object.freeze({ PRESSED: "pressed", FLAT: "flat" });
const WINKO_PANEL_GEOMETRY_VERSION = "pressed-x-v2";

if (window.WINKO3D_DEBUG || new URLSearchParams(window.location.search).has("debug3d")) {
  console.info("WINKO panel geometry:", WINKO_PANEL_GEOMETRY_VERSION);
}

function stageText(stage, part) {
  const locale = window.WINKO_3D_TEXT || {};
  const source = part === "label" ? locale.stages : locale.details;
  return source?.[stage.key] || (part === "label" ? stage.fallback : stage.detail);
}

function createBeveledSquareGeometry(size, depth, bevel = .01) {
  const half = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half, -half);
  shape.lineTo(half, -half);
  shape.lineTo(half, half);
  shape.lineTo(-half, half);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, curveSegments: 2 });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createPanelBody({ panelSize, panelDepth, panelMaterial, faceMaterial }) {
  const group = new THREE.Group();
  const bodyGeometry = createBeveledSquareGeometry(panelSize, panelDepth, .012);
  const body = new THREE.Mesh(bodyGeometry, panelMaterial);
  body.name = "formed galvanized sheet body";
  group.add(body);
  const recessGeometry = createBeveledSquareGeometry(panelSize * .86, .032, .008);
  const recess = new THREE.Mesh(recessGeometry, faceMaterial);
  recess.position.z = panelDepth / 2 + .011;
  recess.name = "shallow recessed central sheet face";
  group.add(recess);
  return { group, geometry: { body: bodyGeometry, recess: recessGeometry } };
}

function createPanelFlange({ panelSize, flange, flangeMaterial }) {
  const group = new THREE.Group();
  const railDepth = .115;
  const railHeight = flange;
  const rails = [
    [panelSize + flange, railHeight, 0, panelSize / 2, "top"],
    [panelSize + flange, railHeight, 0, -panelSize / 2, "bottom"],
    [railHeight, panelSize - flange * 2, panelSize / 2, 0, "right"],
    [railHeight, panelSize - flange * 2, -panelSize / 2, 0, "left"]
  ];
  rails.forEach(([width, height, x, y, label], index) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(width, height, railDepth), flangeMaterial);
    rail.position.set(x, y, .025);
    rail.name = `external flange ${label} ${index + 1}`;
    group.add(rail);
  });
  return group;
}

function createPressedXArm(panelSize) {
  const armLength = panelSize * .49;
  const inner = panelSize * .035;
  const innerHalfWidth = panelSize * .028;
  const outerHalfWidth = panelSize * .067;
  const armShape = new THREE.Shape();
  armShape.moveTo(inner, -innerHalfWidth);
  armShape.bezierCurveTo(panelSize * .13, -panelSize * .035, panelSize * .29, -panelSize * .052, armLength - panelSize * .055, -outerHalfWidth);
  armShape.lineTo(armLength + panelSize * .008, -outerHalfWidth * .3);
  armShape.lineTo(armLength + panelSize * .008, outerHalfWidth * .3);
  armShape.lineTo(armLength - panelSize * .055, outerHalfWidth);
  armShape.bezierCurveTo(panelSize * .29, panelSize * .052, panelSize * .13, panelSize * .035, inner, innerHalfWidth);
  armShape.quadraticCurveTo(inner - panelSize * .012, 0, inner, -innerHalfWidth);
  armShape.closePath();
  const geometry = new THREE.ExtrudeGeometry(armShape, { depth: .024, bevelEnabled: true, bevelSegments: 2, bevelSize: .006, bevelThickness: .004, curveSegments: 12 });
  geometry.translate(0, 0, -.012);
  geometry.computeVertexNormals();
  return geometry;
}

function createPressedDiscGeometry(radius, depth, bevel) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, curveSegments: 24 });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createPressedRingGeometry(outerRadius, innerRadius, depth, bevel) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, curveSegments: 24 });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createCenterPressing({ panelDepth, pressedMaterial, flangeMaterial, faceMaterial }) {
  const group = new THREE.Group();
  const boss = new THREE.Mesh(createPressedDiscGeometry(.085, .022, .005), pressedMaterial);
  boss.position.z = panelDepth / 2 + .021;
  boss.name = "integrated shallow pressed centre boss";
  group.add(boss);
  const ring = new THREE.Mesh(createPressedRingGeometry(.095, .061, .014, .003), pressedMaterial);
  ring.position.z = panelDepth / 2 + .038;
  ring.name = "formed sheet centre pressing ring";
  group.add(ring);
  const dimple = new THREE.Mesh(createPressedDiscGeometry(.034, .01, .002), faceMaterial);
  dimple.position.z = panelDepth / 2 + .044;
  dimple.name = "shallow centre pressing dimple";
  group.add(dimple);
  return { group, geometry: { boss: boss.geometry, ring: ring.geometry, dimple: dimple.geometry } };
}

function createPerimeterBolts({ panelSize, flange, boltGeometry, boltMaterial, countTop, countBottom, countLeft, countRight, panelDepth }) {
  const group = new THREE.Group();
  const positions = [];
  const edge = panelSize / 2 - flange * .42;
  const addLine = (count, edgeName) => {
    const safeCount = Math.max(2, count);
    for (let index = 0; index < safeCount; index += 1) {
      const along = THREE.MathUtils.lerp(-edge, edge, index / (safeCount - 1));
      const position = edgeName === "top" ? [along, edge] : edgeName === "bottom" ? [along, -edge] : edgeName === "left" ? [-edge, along] : [edge, along];
      const key = `${position[0].toFixed(3)}:${position[1].toFixed(3)}`;
      if (positions.some(([x, y]) => `${x.toFixed(3)}:${y.toFixed(3)}` === key)) continue;
      positions.push(position);
      const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(position[0], position[1], panelDepth / 2 + .068);
      bolt.name = `perimeter flange bolt ${positions.length}`;
      group.add(bolt);
    }
  };
  addLine(countTop, "top"); addLine(countBottom, "bottom"); addLine(countLeft, "left"); addLine(countRight, "right");
  return { group, positions };
}

function createCanonicalWinkoPanel({ panelSize, panelDepth, materials }) {
  const group = new THREE.Group();
  group.name = "WINKO canonical pressed HDG panel";
  group.userData.canonical = true;
  group.userData.geometryVersion = WINKO_PANEL_GEOMETRY_VERSION;
  group.userData.faces = { [PANEL_FACE.PRESSED]: [0, 0, 1], [PANEL_FACE.FLAT]: [0, 0, -1] };
  const body = createPanelBody({ panelSize, panelDepth, panelMaterial: materials.panelMaterial, faceMaterial: materials.panelFaceMaterial });
  group.add(body.group);
  const flange = .075;
  group.add(createPanelFlange({ panelSize, flange, flangeMaterial: materials.flangeMaterial }));
  const pressedXGeometry = createPressedXArm(panelSize);
  [Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4].forEach((angle, index) => {
    const arm = new THREE.Mesh(pressedXGeometry, materials.pressedMaterial);
    arm.rotation.z = angle;
    arm.position.z = panelDepth / 2 + .021;
    arm.name = `integrated broad pressed sheet X arm ${index + 1}`;
    group.add(arm);
  });
  const center = createCenterPressing({ panelDepth, pressedMaterial: materials.pressedMaterial, flangeMaterial: materials.flangeMaterial, faceMaterial: materials.panelFaceMaterial });
  group.add(center.group);
  const boltGeometry = new THREE.CylinderGeometry(.016, .016, .024, 10);
  const bolts = createPerimeterBolts({ panelSize, flange, boltGeometry, boltMaterial: materials.boltMaterial, panelDepth, countTop: isMobile() ? 9 : 13, countBottom: isMobile() ? 9 : 13, countLeft: isMobile() ? 9 : 13, countRight: isMobile() ? 9 : 13 });
  group.add(bolts.group);
  return { group, geometry: { ...body.geometry, pressedX: pressedXGeometry, ...center.geometry, bolt: boltGeometry }, materials, flange, boltGeometry, boltPositions: bolts.positions };
}

function createSharedPanelKit() {
  const materials = {
    panelMaterial: new THREE.MeshStandardMaterial({ color: 0xa6b0b1, metalness: .82, roughness: .39 }),
    panelFaceMaterial: new THREE.MeshStandardMaterial({ color: 0x667275, metalness: .78, roughness: .44 }),
    pressedMaterial: new THREE.MeshStandardMaterial({ color: 0xd5dcda, metalness: .88, roughness: .34, emissive: 0x162020, emissiveIntensity: .1 }),
    flangeMaterial: new THREE.MeshStandardMaterial({ color: 0x596568, metalness: .84, roughness: .38 }),
    angleStayMaterial: new THREE.MeshStandardMaterial({ color: 0x596568, metalness: .84, roughness: .38 }),
    cleatMaterial: new THREE.MeshStandardMaterial({ color: 0x526064, metalness: .8, roughness: .4 }),
    boltMaterial: new THREE.MeshStandardMaterial({ color: 0xcbd2d1, metalness: .9, roughness: .3 }),
    roofSupportMaterial: new THREE.MeshStandardMaterial({ color: 0x596568, metalness: .84, roughness: .4 }),
    pipeMaterial: new THREE.MeshStandardMaterial({ color: 0xa6b0b1, metalness: .82, roughness: .39 }),
    foundationMaterial: new THREE.MeshStandardMaterial({ color: 0x687276, metalness: .04, roughness: .92 })
  };
  const panelSize = TANK_SPEC.panelWidth;
  const panelDepth = .12;
  const canonical = createCanonicalWinkoPanel({ panelSize, panelDepth, materials });
  const box = (w, h, d, material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  const neutralFloorPanel = new THREE.Group();
  neutralFloorPanel.name = "neutral visual floor panel";
  neutralFloorPanel.add(box(panelSize, panelSize, .09, materials.panelMaterial));
  const floorFace = box(panelSize * .9, panelSize * .9, .018, materials.panelFaceMaterial);
  floorFace.position.z = .054;
  neutralFloorPanel.add(floorFace);
  [[panelSize, .045, .035, 0, panelSize / 2 - .025], [panelSize, .045, .035, 0, -panelSize / 2 + .025], [.045, panelSize - .09, .035, panelSize / 2 - .025, 0], [.045, panelSize - .09, .035, -panelSize / 2 + .025, 0]].forEach(([w, h, d, x, y]) => { const joint = box(w, h, d, materials.flangeMaterial); joint.position.set(x, y, .06); neutralFloorPanel.add(joint); });
  return { ...canonical, canonicalPanel: canonical.group, neutralFloorPanel, metal: materials.pipeMaterial, face: materials.panelFaceMaterial, pressed: materials.pressedMaterial, edge: materials.angleStayMaterial, cleat: materials.cleatMaterial, bolt: materials.boltMaterial, concrete: materials.foundationMaterial, panelSize, panelDepth, materials };
}

const shared = createSharedPanelKit();

function boxBeamBetween(start, end, width, material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const beam = new THREE.Mesh(new THREE.BoxGeometry(width, width, length), material);
  beam.position.copy(start).add(end).multiplyScalar(.5);
  beam.quaternion.setFromUnitVectors(UNIT_Z, direction.normalize());
  return beam;
}

function pipeBetween(start, end, radius, material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 10), material);
  pipe.position.copy(start).add(end).multiplyScalar(.5);
  pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return pipe;
}

const angleGeometryCache = new Map();
function createAngleMember({ start, end, legA = .1, legB = .1, thickness = .018, material = shared.edge }) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const cacheKey = [length.toFixed(3), legA, legB, thickness].join("|");
  let geometry = angleGeometryCache.get(cacheKey);
  if (!geometry) {
    const profile = new THREE.Shape();
    profile.moveTo(0, 0);
    profile.lineTo(legA, 0);
    profile.lineTo(legA, thickness);
    profile.lineTo(thickness, thickness);
    profile.lineTo(thickness, legB);
    profile.lineTo(0, legB);
    profile.closePath();
    geometry = new THREE.ExtrudeGeometry(profile, { depth: length, bevelEnabled: false, steps: 1 });
    geometry.translate(-legA / 2, -legB / 2, 0);
    geometry.computeVertexNormals();
    angleGeometryCache.set(cacheKey, geometry);
  }
  const member = new THREE.Mesh(geometry, material);
  member.name = "galvanised L-angle stay";
  member.position.copy(start);
  member.quaternion.setFromUnitVectors(UNIT_Z, direction.normalize());
  member.userData.start = start.clone();
  member.userData.end = end.clone();
  return member;
}

function createCleat(type, kit = shared) {
  const group = new THREE.Group();
  group.name = `${type} cleat`;
  const plateSize = type === "star" ? .34 : type === "roof" ? .25 : .28;
  const plate = new THREE.Mesh(new THREE.BoxGeometry(plateSize, .065, plateSize * .72), kit.cleat);
  plate.name = `${type} cleat plate`;
  group.add(plate);
  if (type === "star") {
    [[.18, 0, 0], [-.18, 0, 0], [0, 0, .18], [0, 0, -.18]].forEach(([x, y, z], index) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(.22, .055, .055), kit.cleat);
      arm.position.set(x, y + .02, z);
      arm.rotation.y = index % 2 ? Math.PI / 2 : 0;
      arm.name = `star cleat arm ${index + 1}`;
      group.add(arm);
    });
  }
  [[-.09, .045, -.09], [.09, .045, .09]].forEach(([x, y, z], index) => {
    const fastener = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .018, 8), kit.bolt);
    fastener.position.set(x, y, z);
    fastener.name = `${type} cleat bolt ${index + 1}`;
    group.add(fastener);
  });
  return group;
}

function orientLocalFront(panel, worldNormal, label, face = PANEL_FACE.PRESSED) {
  const expected = worldNormal.clone().normalize();
  panel.quaternion.setFromUnitVectors(UNIT_Z, expected);
  panel.userData.face = face;
  panel.userData.faceLabel = label;
  panel.userData.expectedFrontNormal = expected.toArray();
  const debugMode = new URLSearchParams(window.location.search).has("debug3d") || window.WINKO3D_DEBUG;
  if (debugMode) {
    panel.updateWorldMatrix(true, false);
    const actual = UNIT_Z.clone().applyQuaternion(panel.getWorldQuaternion(new THREE.Quaternion())).normalize();
    console.assert(actual.dot(expected) > .999, `${label}: panel face orientation mismatch`, { expected, actual });
  }
  return panel;
}

function addCanonicalPanel(group, template, position, pressedWorldNormal, label) {
  const panel = template.clone(true);
  panel.position.copy(position);
  orientLocalFront(panel, pressedWorldNormal, label, PANEL_FACE.PRESSED);
  group.add(panel);
  return panel;
}

function addNeutralFloorPanel(group, template, position) {
  const panel = template.clone(true);
  panel.position.copy(position);
  orientLocalFront(panel, new THREE.Vector3(0, 1, 0), "neutral floor top", PANEL_FACE.FLAT);
  group.add(panel);
  return panel;
}

function addRoofTopJoints(panel, kit) {
  const topZ = -kit.panelDepth / 2 - .018;
  const size = kit.panelSize;
  [
    [size, .045, 0, size / 2 - .025],
    [size, .045, 0, -size / 2 + .025],
    [.045, size - .09, size / 2 - .025, 0],
    [.045, size - .09, -size / 2 + .025, 0]
  ].forEach(([w, h, x, y], index) => {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(w, h, .032), kit.edge);
    seam.position.set(x, y, topZ);
    seam.name = `flat roof top joint ${index + 1}`;
    panel.add(seam);
  });
  const roofBoltStep = isMobile() ? 3 : 2;
  kit.boltPositions.filter((_, index) => index % roofBoltStep === 0).forEach(([x, y], index) => {
    const fastener = new THREE.Mesh(kit.boltGeometry, kit.bolt);
    fastener.rotation.x = Math.PI / 2;
    fastener.position.set(x, y, topZ - .024);
    fastener.name = `roof top joint bolt ${index + 1}`;
    panel.add(fastener);
  });
}

function createTankGroups(root) {
  const groups = {};
  [
    "foundationGroup", "baseFrameGroup", "basePanelGroup", "lowerWallGroup", "upperWallGroup",
    "internalStayGroup", "roofSupportGroup", "roofPanelGroup", "ladderGroup", "levelIndicatorGroup",
    "accessoryGroup", "pipeGroup"
  ].forEach((name) => { groups[name] = new THREE.Group(); groups[name].name = name; root.add(groups[name]); });

  groups.stayTier1Group = new THREE.Group();
  groups.stayTier1Group.name = "stayTier1Group";
  groups.stayTier2Group = new THREE.Group();
  groups.stayTier2Group.name = "stayTier2Group";
  groups.verticalSupportGroup = new THREE.Group();
  groups.verticalSupportGroup.name = "verticalSupportGroup";
  groups.stayCleatGroup = new THREE.Group();
  groups.stayCleatGroup.name = "stayCleatGroup";
  groups.internalStayGroup.add(groups.stayTier1Group, groups.stayTier2Group, groups.verticalSupportGroup, groups.stayCleatGroup);

  groups.roofTrussGroup = new THREE.Group();
  groups.roofTrussGroup.name = "roofTrussGroup";
  groups.roofBeamGroup = new THREE.Group();
  groups.roofBeamGroup.name = "roofBeamGroup";
  groups.roofCleatGroup = new THREE.Group();
  groups.roofCleatGroup.name = "roofCleatGroup";
  groups.roofSupportGroup.add(groups.roofTrussGroup, groups.roofBeamGroup, groups.roofCleatGroup);

  groups.manholeGroup = new THREE.Group();
  groups.manholeGroup.name = "manholeGroup";
  groups.ventGroup = new THREE.Group();
  groups.ventGroup.name = "ventGroup";
  groups.otherVerifiedRoofAccessoryGroup = new THREE.Group();
  groups.otherVerifiedRoofAccessoryGroup.name = "otherVerifiedRoofAccessoryGroup";
  groups.accessoryGroup.add(groups.manholeGroup, groups.ventGroup, groups.otherVerifiedRoofAccessoryGroup);
  return groups;
}

function createFoundation(ctx) {
  const { groups, kit } = ctx;
  const xPositions = [-2.05, -.68, .68, 2.05];
  [-.86, .86].forEach((z) => xPositions.forEach((x) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(.92, .72, .72), kit.concrete);
    block.position.set(x, -1.5, z);
    groups.foundationGroup.add(block);
  }));
}

function createBaseFrame(ctx) {
  const { groups, kit, halfWidth, halfDepth } = ctx;
  const y = -1.02;
  const seamsX = Array.from({ length: TANK_SPEC.tankPanelsX + 1 }, (_, index) => -halfWidth + index * TANK_SPEC.panelWidth);
  const seamsZ = Array.from({ length: TANK_SPEC.tankPanelsZ + 1 }, (_, index) => -halfDepth + index * TANK_SPEC.panelWidth);
  seamsX.forEach((x) => groups.baseFrameGroup.add(boxBeamBetween(new THREE.Vector3(x, y, -halfDepth), new THREE.Vector3(x, y, halfDepth), .065, kit.edge)));
  seamsZ.forEach((z) => groups.baseFrameGroup.add(boxBeamBetween(new THREE.Vector3(-halfWidth, y, z), new THREE.Vector3(halfWidth, y, z), .065, kit.edge)));
}

function createBasePanels(ctx) {
  const { groups, kit } = ctx;
  for (let x = 0; x < TANK_SPEC.tankPanelsX; x += 1) {
    for (let z = 0; z < TANK_SPEC.tankPanelsZ; z += 1) {
      addNeutralFloorPanel(
        groups.basePanelGroup,
        kit.neutralFloorPanel,
        new THREE.Vector3((x - 1.5) * TANK_SPEC.panelWidth, -.88, (z - 1) * TANK_SPEC.panelWidth)
      );
    }
  }
}

function createWallSystem(ctx) {
  const { groups, kit, halfWidth, halfDepth } = ctx;
  const wallGroups = {};
  const wallDefinitions = [
    ["front", 0, halfDepth + .04, new THREE.Vector3(0, 0, 1), 4],
    ["back", 0, -halfDepth - .04, new THREE.Vector3(0, 0, -1), 4],
    ["left", -halfWidth - .04, 0, new THREE.Vector3(-1, 0, 0), 3],
    ["right", halfWidth + .04, 0, new THREE.Vector3(1, 0, 0), 3]
  ];
  ["lowerWallGroup", "upperWallGroup"].forEach((parentName, level) => {
    wallDefinitions.forEach(([name, x, z, outwardNormal, count]) => {
      const wall = new THREE.Group();
      wall.name = `${name}${level === 0 ? "Lower" : "Upper"}`;
      wall.userData.side = name;
      wall.userData.level = level;
      groups[parentName].add(wall);
      wallGroups[wall.name] = wall;
      const y = level === 0 ? -.02 : TANK_SPEC.panelHeight + .02;
      for (let column = 0; column < count; column += 1) {
        const position = name === "front" || name === "back"
          ? [(column - 1.5) * TANK_SPEC.panelWidth, y, z]
          : [x, y, (column - 1) * TANK_SPEC.panelWidth];
        addCanonicalPanel(
          wall,
          kit.canonicalPanel,
          new THREE.Vector3(position[0], position[1], position[2]),
          outwardNormal,
          `${name} wall ${level === 0 ? "lower" : "upper"} panel ${column + 1}`
        );
      }
    });
  });
  return wallGroups;
}

function createInternalStaySystem(ctx) {
  const { groups, kit, halfWidth, halfDepth, roofY } = ctx;
  const nodeCache = new Map();
  const addNode = (position, type) => {
    const key = `${type}:${position.x.toFixed(2)}:${position.y.toFixed(2)}:${position.z.toFixed(2)}`;
    if (nodeCache.has(key)) return nodeCache.get(key);
    const node = createCleat(type, kit);
    node.position.copy(position);
    node.userData.nodeType = type;
    groups.stayCleatGroup.add(node);
    nodeCache.set(key, node);
    return node;
  };
  const addStay = (start, end, tierGroup, startType = "plain", endType = "main", name = "angle stay") => {
    const stay = createAngleMember({ start, end, legA: .115, legB: .105, thickness: .02, material: kit.edge });
    stay.name = name;
    tierGroup.add(stay);
    addNode(start, startType);
    addNode(end, endType);
  };
  const frontZ = halfDepth - .18;
  const sideX = halfWidth - .18;
  const bayX = [-1.62, 1.62];
  const baseX = [-.92, .92];
  const bayZ = [-1.02, 1.02];
  const baseZ = [-.58, .58];
  bayX.forEach((x, index) => {
    addStay(new THREE.Vector3(x, -.22, frontZ), new THREE.Vector3(baseX[index], -.74, .62), groups.stayTier1Group, "plain", "main", `front lower angle stay ${index + 1}`);
    addStay(new THREE.Vector3(x, -.22, -frontZ), new THREE.Vector3(baseX[index], -.74, -.62), groups.stayTier1Group, "plain", "main", `back lower angle stay ${index + 1}`);
  });
  bayZ.forEach((z, index) => {
    addStay(new THREE.Vector3(-sideX, -.22, z), new THREE.Vector3(-.88, -.74, baseZ[index]), groups.stayTier1Group, "plain", "main", `left lower angle stay ${index + 1}`);
    addStay(new THREE.Vector3(sideX, -.22, z), new THREE.Vector3(.88, -.74, baseZ[index]), groups.stayTier1Group, "plain", "main", `right lower angle stay ${index + 1}`);
  });
  [-1.25, 1.25].forEach((x) => [-.82, .82].forEach((z) => {
    const start = new THREE.Vector3(x, -.74, z);
    const end = new THREE.Vector3(x, roofY - .3, z);
    const support = createAngleMember({ start, end, legA: .12, legB: .11, thickness: .022, material: kit.cleat });
    support.name = "vertical internal angle support";
    groups.verticalSupportGroup.add(support);
    addNode(start, "main");
    addNode(end, "roof");
  }));
}

function createRoofSupportSystem(ctx) {
  const { groups, kit, halfWidth, halfDepth, roofY } = ctx;
  const y = roofY - .3;
  const xSeams = Array.from({ length: TANK_SPEC.tankPanelsX + 1 }, (_, index) => -halfWidth + index * TANK_SPEC.panelWidth);
  const zSeams = Array.from({ length: TANK_SPEC.tankPanelsZ + 1 }, (_, index) => -halfDepth + index * TANK_SPEC.panelWidth);
  zSeams.forEach((z) => groups.roofBeamGroup.add(boxBeamBetween(new THREE.Vector3(-halfWidth, y, z), new THREE.Vector3(halfWidth, y, z), .065, kit.edge)));
  xSeams.forEach((x) => groups.roofBeamGroup.add(boxBeamBetween(new THREE.Vector3(x, y, -halfDepth), new THREE.Vector3(x, y, halfDepth), .065, kit.edge)));
  [-1.4, 1.4].forEach((x, index) => {
    const ridge = new THREE.Vector3(x, roofY - .2, 0);
    const front = new THREE.Vector3(x, y, halfDepth - .16);
    const back = new THREE.Vector3(x, y, -halfDepth + .16);
    groups.roofTrussGroup.add(createAngleMember({ start: front, end: ridge, legA: .1, legB: .1, thickness: .018, material: kit.edge }));
    groups.roofTrussGroup.add(createAngleMember({ start: back, end: ridge, legA: .1, legB: .1, thickness: .018, material: kit.edge }));
    const frontCleat = createCleat("roof", kit); frontCleat.position.copy(front); frontCleat.name = `roof cleat front ${index + 1}`; groups.roofCleatGroup.add(frontCleat);
    const backCleat = createCleat("roof", kit); backCleat.position.copy(back); backCleat.name = `roof cleat back ${index + 1}`; groups.roofCleatGroup.add(backCleat);
    const ridgeCleat = createCleat("roof", kit); ridgeCleat.position.copy(ridge); ridgeCleat.name = `roof cleat ridge ${index + 1}`; groups.roofCleatGroup.add(ridgeCleat);
  });
  groups.roofTrussGroup.add(boxBeamBetween(new THREE.Vector3(-1.4, roofY - .2, 0), new THREE.Vector3(1.4, roofY - .2, 0), .07, kit.edge));
}

function createRoofPanels(ctx) {
  const { groups, kit, roofY } = ctx;
  for (let x = 0; x < TANK_SPEC.tankPanelsX; x += 1) {
    for (let z = 0; z < TANK_SPEC.tankPanelsZ; z += 1) {
      const panel = addCanonicalPanel(
        groups.roofPanelGroup,
        kit.canonicalPanel,
        new THREE.Vector3((x - 1.5) * TANK_SPEC.panelWidth, roofY, (z - 1) * TANK_SPEC.panelWidth),
        new THREE.Vector3(0, -1, 0),
        `roof underside panel ${x + 1}-${z + 1}`
      );
      addRoofTopJoints(panel, kit);
    }
  }
}

function createExternalLadder(ctx) {
  const { groups, kit, halfWidth, halfDepth, roofY } = ctx;
  const x = -halfWidth - .48;
  const z = halfDepth - .76;
  const bottom = -1.02;
  const top = roofY + .82;
  groups.ladderGroup.add(pipeBetween(new THREE.Vector3(x, bottom, z), new THREE.Vector3(x, top, z), .035, kit.metal));
  groups.ladderGroup.add(pipeBetween(new THREE.Vector3(x, bottom, z - .34), new THREE.Vector3(x, top, z - .34), .035, kit.metal));
  for (let y = -.72; y < roofY + .08; y += .4) groups.ladderGroup.add(pipeBetween(new THREE.Vector3(x, y, z - .34), new THREE.Vector3(x, y, z), .026, kit.metal));
  const roofEdgeX = -halfWidth + .12;
  [z, z - .34].forEach((railZ, index) => {
    groups.ladderGroup.add(pipeBetween(new THREE.Vector3(x, top, railZ), new THREE.Vector3(roofEdgeX, top, railZ), .035, kit.metal));
    groups.ladderGroup.add(pipeBetween(new THREE.Vector3(roofEdgeX, top, railZ), new THREE.Vector3(roofEdgeX, roofY + .12, railZ), .035, kit.metal));
    groups.ladderGroup.children.at(-1).name = `ladder top handhold ${index + 1}`;
  });
}

function createLevelIndicator(ctx) {
  const { groups, kit, halfWidth } = ctx;
  const x = halfWidth + .25;
  const z = .75;
  groups.levelIndicatorGroup.add(pipeBetween(new THREE.Vector3(x, -.65, z), new THREE.Vector3(x, 1.78, z), .026, kit.edge));
  const body = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.72, .06), kit.face);
  body.position.set(x + .05, .55, z);
  groups.levelIndicatorGroup.add(body);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), kit.bolt);
  marker.position.set(x + .09, .7, z);
  groups.levelIndicatorGroup.add(marker);
}

function createManhole(ctx) {
  const { groups, kit, roofY, halfWidth, halfDepth } = ctx;
  const x = -halfWidth + .62;
  const z = halfDepth - .93;
  const curb = new THREE.Mesh(new THREE.BoxGeometry(.86, .16, .62), kit.edge);
  curb.position.set(x, roofY + .12, z);
  curb.name = "rectangular manhole curb";
  groups.manholeGroup.add(curb);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(.96, .055, .72), kit.metal);
  frame.position.set(x, roofY + .22, z);
  frame.name = "rectangular manhole frame";
  groups.manholeGroup.add(frame);
  const coverProfile = new THREE.Shape();
  coverProfile.moveTo(-.42, 0);
  coverProfile.lineTo(.42, 0);
  coverProfile.lineTo(.32, .16);
  coverProfile.lineTo(-.32, .09);
  coverProfile.closePath();
  const coverGeometry = new THREE.ExtrudeGeometry(coverProfile, { depth: .58, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 2 });
  coverGeometry.translate(0, 0, -.29);
  const cover = new THREE.Mesh(coverGeometry, kit.face);
  cover.position.set(x, roofY + .25, z);
  cover.name = "inclined rectangular manhole cover";
  groups.manholeGroup.add(cover);
  const hinge = pipeBetween(new THREE.Vector3(x - .38, roofY + .31, z - .3), new THREE.Vector3(x - .38, roofY + .31, z + .3), .025, kit.edge);
  hinge.name = "manhole cover hinge";
  groups.manholeGroup.add(hinge);
}

function createAirVent(ctx) {
  const { groups, kit, roofY, halfWidth, halfDepth } = ctx;
  const x = halfWidth - 1.15;
  const z = halfDepth - .46;
  const stem = pipeBetween(new THREE.Vector3(x, roofY + .04, z), new THREE.Vector3(x, roofY + .3, z), .035, kit.metal);
  stem.name = "short mushroom vent stem";
  groups.ventGroup.add(stem);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(.09, .11, .06, 18), kit.edge);
  collar.position.set(x, roofY + .09, z);
  collar.name = "mushroom vent roof collar";
  groups.ventGroup.add(collar);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .025, 24), kit.edge);
  brim.position.set(x, roofY + .32, z);
  brim.name = "mushroom vent brim";
  groups.ventGroup.add(brim);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), kit.metal);
  cap.scale.y = .55;
  cap.position.set(x, roofY + .32, z);
  cap.name = "small mushroom vent cap";
  groups.ventGroup.add(cap);
}

function createPipework(ctx) {
  const { groups, kit, halfWidth, halfDepth } = ctx;
  const y = -1.2;
  const z = halfDepth + .34;
  const pipeMaterial = kit.edge;
  groups.pipeGroup.add(pipeBetween(new THREE.Vector3(-halfWidth - .22, y, z), new THREE.Vector3(halfWidth + .22, y, z), .06, pipeMaterial));
  groups.pipeGroup.add(pipeBetween(new THREE.Vector3(-halfWidth - .22, y, z), new THREE.Vector3(-halfWidth - .22, -.36, z), .06, pipeMaterial));
  groups.pipeGroup.add(pipeBetween(new THREE.Vector3(halfWidth + .22, y, z), new THREE.Vector3(halfWidth + .22, -.58, z), .06, pipeMaterial));
  [-halfWidth - .22, halfWidth + .22].forEach((x) => {
    const joint = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), pipeMaterial);
    joint.position.set(x, y, z);
    groups.pipeGroup.add(joint);
  });
}

function setMaterialOpacity(group, opacity) {
  group.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    if (!node.userData.focusMaterial) node.userData.focusMaterial = node.material.clone();
    node.material.transparent = opacity < 1;
    node.material.opacity = opacity;
    node.material.depthWrite = opacity > .95;
  });
}

function createTankModel() {
  const root = new THREE.Group();
  root.name = "tankRoot";
  const groups = createTankGroups(root);
  const halfWidth = TANK_SPEC.panelWidth * TANK_SPEC.tankPanelsX / 2;
  const halfDepth = TANK_SPEC.panelWidth * TANK_SPEC.tankPanelsZ / 2;
  const roofY = TANK_SPEC.panelHeight * (TANK_SPEC.tankLevels - .5) + .1;
  const ctx = { root, groups, kit: shared, halfWidth, halfDepth, roofY };

  createFoundation(ctx);
  createBaseFrame(ctx);
  createBasePanels(ctx);
  const wallGroups = createWallSystem(ctx);
  createInternalStaySystem(ctx);
  createRoofSupportSystem(ctx);
  createRoofPanels(ctx);
  createExternalLadder(ctx);
  createLevelIndicator(ctx);
  createManhole(ctx);
  createAirVent(ctx);
  createPipework(ctx);

  const wallMeshes = [];
  [groups.lowerWallGroup, groups.upperWallGroup].forEach((wallGroup) => wallGroup.traverse((node) => { if (node.isMesh) wallMeshes.push(node); }));
  const focusWallGroups = [
    { group: wallGroups.frontLower, offset: new THREE.Vector3(0, 0, .48) },
    { group: wallGroups.frontUpper, offset: new THREE.Vector3(0, 0, .48) },
    { group: wallGroups.rightLower, offset: new THREE.Vector3(.48, 0, 0) },
    { group: wallGroups.rightUpper, offset: new THREE.Vector3(.48, 0, 0) }
  ];
  const focusWallMeshes = [];
  focusWallGroups.forEach(({ group }) => group.traverse((node) => { if (node.isMesh) focusWallMeshes.push(node); }));
  const entries = [];
  const addEntry = (group, key, start, end, from, explode, options = {}) => {
    const home = group.position.clone();
    const entry = {
      group,
      key,
      start,
      end,
      home,
      from: home.clone().add(from || new THREE.Vector3()),
      explode: home.clone().add(explode || new THREE.Vector3()),
      homeScale: group.scale.clone(),
      explodeScale: options.explodeScale || 1,
      opacity: options.opacity || false
    };
    group.userData.home = home.clone();
    group.userData.from = entry.from.clone();
    group.userData.explode = entry.explode.clone();
    group.userData.homeScale = entry.homeScale.clone();
    group.userData.explodeScale = entry.explodeScale;
    group.position.copy(entry.from);
    group.visible = false;
    entries.push(entry);
  };

  addEntry(groups.foundationGroup, "foundation", 0, .08, new THREE.Vector3(), new THREE.Vector3());
  addEntry(groups.baseFrameGroup, "baseFrame", .08, .16, new THREE.Vector3(0, -.35, 0), new THREE.Vector3(0, -.25, 0));
  addEntry(groups.basePanelGroup, "basePanels", .16, .25, new THREE.Vector3(0, -.46, 0), new THREE.Vector3(0, -.38, 0));
  ["frontLower", "backLower", "leftLower", "rightLower"].forEach((name) => {
    const side = wallGroups[name].userData.side;
    const delta = side === "front" ? new THREE.Vector3(0, 0, .65) : side === "back" ? new THREE.Vector3(0, 0, -.65) : side === "left" ? new THREE.Vector3(-.65, 0, 0) : new THREE.Vector3(.65, 0, 0);
    addEntry(wallGroups[name], "lowerWalls", .25, .38, delta, delta.clone().multiplyScalar(1.25));
  });
  addEntry(groups.stayTier1Group, "firstTierStays", .38, .5, new THREE.Vector3(0, .25, .22), new THREE.Vector3(0, .18, .12), { opacity: true });
  addEntry(groups.stayCleatGroup, "firstTierStays", .36, .5, new THREE.Vector3(0, .25, .22), new THREE.Vector3(0, .18, .12), { opacity: true });
  ["frontUpper", "backUpper", "leftUpper", "rightUpper"].forEach((name) => {
    const side = wallGroups[name].userData.side;
    const delta = side === "front" ? new THREE.Vector3(0, 0, .7) : side === "back" ? new THREE.Vector3(0, 0, -.7) : side === "left" ? new THREE.Vector3(-.7, 0, 0) : new THREE.Vector3(.7, 0, 0);
    addEntry(wallGroups[name], "upperWalls", .5, .62, delta, delta.clone().multiplyScalar(1.2));
  });
  addEntry(groups.stayTier2Group, "upperStays", .62, .73, new THREE.Vector3(0, .38, .24), new THREE.Vector3(0, .22, .16), { opacity: true, explodeScale: 1.03 });
  addEntry(groups.verticalSupportGroup, "upperStays", .62, .73, new THREE.Vector3(0, .45, .2), new THREE.Vector3(0, .22, .14), { opacity: true });
  addEntry(groups.roofSupportGroup, "roofSupport", .73, .82, new THREE.Vector3(0, 1.05, 0), new THREE.Vector3(0, .82, 0));
  addEntry(groups.roofPanelGroup, "roofPanels", .82, .89, new THREE.Vector3(0, 1.35, 0), new THREE.Vector3(0, 1.25, 0));
  addEntry(groups.ladderGroup, "accessories", .89, .95, new THREE.Vector3(-.85, .1, 0), new THREE.Vector3(-1.0, .14, .18));
  addEntry(groups.manholeGroup, "accessories", .89, .95, new THREE.Vector3(0, .72, 0), new THREE.Vector3(.18, .78, .2));
  addEntry(groups.ventGroup, "accessories", .89, .95, new THREE.Vector3(0, .82, 0), new THREE.Vector3(.3, .9, -.08));
  addEntry(groups.levelIndicatorGroup, "accessories", .89, .95, new THREE.Vector3(.55, .1, 0), new THREE.Vector3(.72, .1, .1));
  addEntry(groups.pipeGroup, "pipework", .95, .985, new THREE.Vector3(0, .25, .72), new THREE.Vector3(0, .25, .88));

  root.userData.groups = groups;
  root.userData.entries = entries;
  root.userData.wallGroups = wallGroups;
  root.userData.wallMeshes = wallMeshes;
  root.userData.focusWallGroups = focusWallGroups;
  root.userData.focusWallMeshes = focusWallMeshes;
  root.userData.exploded = false;
  root.userData.focused = false;
  root.userData.demoSpec = TANK_SPEC;
  root.userData.roofY = roofY;
  setAssemblyProgress(entries, 1);
  return root;
}

function setEntryOpacity(entry, value) {
  if (!entry.opacity) return;
  setMaterialOpacity(entry.group, value);
}

function setAssemblyProgress(entries, progress) {
  entries.forEach((entry) => {
    const t = entry.start === 0 ? 1 : THREE.MathUtils.clamp((progress - entry.start) / Math.max(.001, entry.end - entry.start), 0, 1);
    const eased = t * t * (3 - 2 * t);
    entry.group.position.lerpVectors(entry.from, entry.home, eased);
    entry.group.scale.copy(entry.homeScale);
    entry.group.visible = t > .002;
    setEntryOpacity(entry, entry.opacity ? Math.max(.04, eased) : 1);
  });
}

function setAssembled(root) {
  (root.userData.entries || []).forEach((entry) => {
    entry.group.position.copy(entry.home);
    entry.group.scale.copy(entry.homeScale);
    entry.group.visible = true;
    setEntryOpacity(entry, 1);
  });
  root.userData.exploded = false;
  root.userData.cameraRig?.setExploded(false, true);
}

function setExploded(root, exploded, animate = true) {
  const entries = root.userData.entries || [];
  entries.forEach((entry) => {
    const target = exploded ? entry.explode : entry.home;
    const targetScale = exploded ? entry.explodeScale : 1;
    entry.group.visible = true;
    if (animate && !reducedMotion) {
      gsap.to(entry.group.position, { x: target.x, y: target.y, z: target.z, duration: 1.15, ease: "power2.inOut", overwrite: true });
      gsap.to(entry.group.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 1.15, ease: "power2.inOut", overwrite: true });
    } else {
      entry.group.position.copy(target);
      entry.group.scale.setScalar(targetScale);
    }
  });
  root.userData.exploded = exploded;
  root.userData.cameraRig?.setExploded(exploded, animate);
}

function setFocusMode(root, focused, animate = true) {
  root.userData.focused = focused;
  const focusMeshes = root.userData.focusWallMeshes || [];
  const focusGroups = root.userData.focusWallGroups || [];
  const moveWalls = (withAnimation) => focusGroups.forEach(({ group, offset }) => {
    const home = group.userData.home || new THREE.Vector3();
    const target = focused ? home.clone().add(offset) : home;
    if (withAnimation && !reducedMotion) {
      gsap.to(group.position, { x: target.x, y: target.y, z: target.z, duration: .65, ease: "power2.out", overwrite: true });
    } else group.position.copy(target);
  });
  const apply = () => focusMeshes.forEach((mesh) => {
    if (!mesh.userData.focusMaterial) mesh.userData.focusMaterial = mesh.material.clone();
    mesh.material = mesh.userData.focusMaterial;
    mesh.material.transparent = focused;
    mesh.material.opacity = focused ? .12 : 1;
    mesh.material.depthWrite = !focused;
  });
  if (animate && !reducedMotion) {
    focusMeshes.forEach((mesh) => {
      if (!mesh.userData.focusMaterial) mesh.userData.focusMaterial = mesh.material.clone();
      mesh.material = mesh.userData.focusMaterial;
      gsap.to(mesh.material, { opacity: focused ? .12 : 1, duration: .65, ease: "power2.out", overwrite: true, onStart: () => { mesh.material.transparent = true; mesh.material.depthWrite = !focused; }, onComplete: () => { mesh.material.transparent = focused; mesh.material.depthWrite = !focused; } });
    });
    moveWalls(true);
  } else {
    apply();
    moveWalls(false);
  }
}

function addLighting(scene) {
  scene.add(new THREE.HemisphereLight(0xdfe7e6, 0x111718, 1.65));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(5, 8, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8baeb9, 1.15);
  rim.position.set(-6, 4, -5);
  scene.add(rim);
  const fill = new THREE.PointLight(0x93a9ae, 2.5, 16, 2);
  fill.position.set(0, 2, 4);
  scene.add(fill);
}

function addFloor(scene) {
  const floor = new THREE.Mesh(new THREE.CircleGeometry(5.2, 64), new THREE.MeshBasicMaterial({ color: 0x030506, transparent: true, opacity: .5 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.92;
  scene.add(floor);
  return floor;
}

function applyValidationMode(root, mode) {
  if (!mode || mode === "complete") return;
  const groups = root.userData.groups;
  const hideTopLevelGroups = () => root.children.forEach((child) => { child.visible = false; });
  if (mode === "panel") {
    hideTopLevelGroups();
    const panel = root.userData.wallGroups.frontLower?.children[0];
    groups.lowerWallGroup.visible = true;
    groups.lowerWallGroup.children.forEach((wall) => { wall.visible = false; });
    root.userData.wallGroups.frontLower.visible = true;
    if (panel) {
      root.userData.wallGroups.frontLower.children.forEach((child) => { child.visible = false; });
      panel.traverse((node) => { node.visible = true; });
      panel.position.set(0, 0, 0);
      panel.rotation.set(0, 0, 0);
    }
    root.position.y = .25;
    root.scale.setScalar(2.35);
    return;
  }
  if (mode === "internal" || mode === "structure") {
    hideTopLevelGroups();
    groups.baseFrameGroup.visible = true;
    groups.internalStayGroup.visible = true;
    groups.roofSupportGroup.visible = true;
    root.scale.setScalar(.9);
    return;
  }
  if (mode === "roof" || mode === "roof-underside") {
    hideTopLevelGroups();
    groups.roofSupportGroup.visible = true;
    groups.roofPanelGroup.visible = true;
    groups.ladderGroup.visible = true;
    groups.accessoryGroup.visible = true;
    groups.manholeGroup.visible = true;
    groups.ventGroup.visible = true;
    root.scale.setScalar(.84);
    return;
  }
  if (mode === "accessories") {
    hideTopLevelGroups();
    groups.roofPanelGroup.visible = true;
    groups.ladderGroup.visible = true;
    groups.accessoryGroup.visible = true;
    groups.manholeGroup.visible = true;
    groups.ventGroup.visible = true;
    root.scale.setScalar(.9);
    return;
  }
  if (mode === "exploded") setExploded(root, true, false);
}

function configureValidationCamera(mode, camera, controls, root) {
  if (!mode || mode === "complete") return;
  controls.enableZoom = true;
  controls.minPolarAngle = .05;
  controls.maxPolarAngle = Math.PI - .05;
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  controls.autoRotate = false;
  if (mode === "panel") {
    camera.position.set(0, .25, 8.2);
    controls.target.set(0, .25, 0);
    return;
  }
  if (mode === "exploded") {
    camera.position.set(9, 1.55, 13);
    controls.target.set(0, .65, 0);
    return;
  }
  const roofTarget = new THREE.Vector3(0, root.userData.roofY, 0).multiplyScalar(root.scale.x).add(root.position);
  if (mode === "roof") {
    camera.position.set(roofTarget.x, roofTarget.y + 8.4, roofTarget.z + .01);
    controls.target.copy(roofTarget);
    return;
  }
  if (mode === "roof-underside") {
    camera.position.set(roofTarget.x, roofTarget.y - 5.6, roofTarget.z + 2.8);
    controls.target.copy(roofTarget);
    return;
  }
  if (mode === "accessories") {
    camera.position.set(-6.8, roofTarget.y + 3.25, 6.2);
    controls.target.copy(roofTarget).add(new THREE.Vector3(-.2, -.05, 0));
    return;
  }
  if (mode === "internal" || mode === "structure") {
    camera.position.set(7.2, 3.8, 8.2);
    controls.target.set(0, .45, 0);
  }
}

function createScene(stage, { assembly = false } = {}) {
  const canvas = stage.querySelector("canvas");
  if (!canvas || !window.WebGLRenderingContext) { stage.classList.add("is-fallback"); return null; }
  const search = new URLSearchParams(window.location.search);
  const validationMode = search.get("debug3d") || search.get("mode") || stage.dataset.validationMode || (window.WINKO3D_DEBUG_PANEL ? "panel" : null);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile(), powerPreference: "high-performance" });
  } catch (error) {
    stage.classList.add("is-fallback");
    return null;
  }
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(7.6, 4.25, 9.2);
  const root = createTankModel();
  root.scale.setScalar(assembly ? .72 : .74);
  root.position.y = assembly ? -.12 : -.2;
  scene.add(root);
  addLighting(scene);
  const floor = addFloor(scene);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, .35, 0);
  controls.enableDamping = true;
  controls.dampingFactor = .075;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = 1.12;
  controls.maxPolarAngle = 1.66;
  controls.minAzimuthAngle = -.72;
  controls.maxAzimuthAngle = .72;
  controls.autoRotate = !assembly && !validationMode && !reducedMotion;
  controls.autoRotateSpeed = .18;
  const homeCamera = camera.position.clone();
  const homeTarget = controls.target.clone();
  root.userData.cameraRig = {
    setExploded(exploded, animate) {
      const scale = exploded ? 1.1 : 1;
      const destination = homeCamera.clone().multiplyScalar(scale);
      destination.y -= exploded ? 1.05 : 0;
      const target = homeTarget.clone();
      target.y += exploded ? .14 : 0;
      if (animate && !reducedMotion) {
        gsap.to(camera.position, { x: destination.x, y: destination.y, z: destination.z, duration: 1.15, ease: "power2.inOut", overwrite: true });
        gsap.to(controls.target, { x: target.x, y: target.y, z: target.z, duration: 1.15, ease: "power2.inOut", overwrite: true });
      } else { camera.position.copy(destination); controls.target.copy(target); }
    }
  };

  applyValidationMode(root, validationMode);
  configureValidationCamera(validationMode, camera, controls, root);
  if (validationMode && validationMode !== "complete" && validationMode !== "exploded") floor.visible = false;

  let active = true;
  const resize = () => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
  };
  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { rootMargin: "240px" });
  observer.observe(stage);
  const render = () => {
    requestAnimationFrame(render);
    if (!active || document.hidden) return;
    controls.update();
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
  stage.classList.add("is-3d-ready");
  const readyScope = stage.closest(".assembly-section") || stage.closest(".hero-media") || stage;
  readyScope.querySelectorAll("[data-three-only]").forEach((node) => { node.hidden = false; });
  if (window.WINKO3D_DEBUG) scene.add(new THREE.AxesHelper(3));
  return { stage, root, scene, camera, controls, renderer, resize, observer, setActive: (value) => { active = value; } };
}

function updateStageLabel(stage, index) {
  const definition = STAGES[index] || STAGES[0];
  const number = stage.querySelector("[data-stage-number]");
  const title = stage.querySelector("[data-stage-title]");
  const detail = stage.querySelector("[data-stage-detail]");
  const buttons = stage.querySelectorAll("[data-stage-button]");
  if (number) number.textContent = String(index + 1).padStart(2, "0");
  if (title) title.textContent = stageText(definition, "label");
  if (detail) detail.textContent = stageText(definition, "detail");
  buttons.forEach((button, buttonIndex) => {
    const key = button.dataset.stageKey || STAGES[buttonIndex]?.key;
    const buttonDefinition = STAGES.find((stageDefinition) => stageDefinition.key === key) || STAGES[buttonIndex];
    const label = button.querySelector("span");
    if (label && buttonDefinition) label.textContent = stageText(buttonDefinition, "label");
    button.classList.toggle("is-active", buttonIndex === index);
  });
  stage.dataset.stage = String(index + 1);
}

function bindSceneControls(stage, root) {
  const scope = stage.closest(".hero-media, .assembly-section") || stage;
  scope.querySelectorAll("[data-explode-button]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const exploded = !root.userData.exploded;
      if (root.userData.focused) {
        setFocusMode(root, false, true);
        scope.querySelectorAll("[data-structure-button]").forEach((control) => {
          control.setAttribute("aria-pressed", "false");
          control.classList.remove("is-active");
        });
      }
      setAssembled(root);
      setExploded(root, exploded, true);
      scope.querySelectorAll("[data-explode-button]").forEach((control) => {
        control.setAttribute("aria-pressed", String(exploded));
        control.classList.toggle("is-active", exploded);
      });
    });
  });
  scope.querySelectorAll("[data-structure-button]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const focused = !root.userData.focused;
      if (focused) {
        setAssembled(root);
        setExploded(root, false, false);
        scope.querySelectorAll("[data-explode-button]").forEach((control) => {
          control.setAttribute("aria-pressed", "false");
          control.classList.remove("is-active");
        });
      }
      setFocusMode(root, focused, true);
      button.setAttribute("aria-pressed", String(focused));
      button.classList.toggle("is-active", focused);
    });
  });
}

function initHeroStages() {
  document.querySelectorAll("[data-hero-tank-stage]").forEach((stage) => {
    if (stage.dataset.threeInitialized) return;
    stage.dataset.threeInitialized = "true";
    const result = createScene(stage, { assembly: false });
    if (!result) return;
    bindSceneControls(stage, result.root);
    window.WINKO3D.heroes.push(result);
  });
}

function initAssemblyStages() {
  document.querySelectorAll("[data-assembly-tank-stage]").forEach((stage) => {
    if (stage.dataset.threeRequested) return;
    stage.dataset.threeRequested = "true";
    const assemblyTrigger = stage.closest(".assembly-stage-wrap") || stage;
    const naturalTriggerHeight = assemblyTrigger.offsetHeight;
    const assemblyShell = stage.closest(".assembly-shell");
    const assemblyScrollDistance = () => Math.max(window.innerHeight * 2.8, naturalTriggerHeight + window.innerHeight * 1.1);
    if (ScrollTrigger && !isMobile() && !reducedMotion && assemblyShell) {
      const currentMinHeight = parseFloat(getComputedStyle(assemblyShell).minHeight) || 0;
      const shellStyle = getComputedStyle(assemblyShell);
      const shellPadding = (parseFloat(shellStyle.paddingTop) || 0) + (parseFloat(shellStyle.paddingBottom) || 0);
      assemblyShell.style.minHeight = `${Math.max(currentMinHeight, naturalTriggerHeight + assemblyScrollDistance() + shellPadding)}px`;
    }
    const boot = () => {
      if (stage.dataset.threeInitialized) return;
      stage.dataset.threeInitialized = "true";
      const result = createScene(stage, { assembly: true });
      if (!result) {
        if (assemblyShell) assemblyShell.style.minHeight = "";
        return;
      }
      setAssemblyProgress(result.root.userData.entries, 0);
      bindSceneControls(stage, result.root);
      const wrapper = stage.closest(".assembly-stage-wrap");
      const scope = wrapper || stage;
      scope.dataset.webglReady = "true";
      let manualLock = false;
      const releaseManual = () => { manualLock = false; };
      window.addEventListener("wheel", releaseManual, { passive: true });
      window.addEventListener("touchmove", releaseManual, { passive: true });
      const applyProgress = (progress, force = false) => {
        if (manualLock && !force) return;
        if (!result.root.userData.exploded) setAssemblyProgress(result.root.userData.entries, progress);
        const index = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
        updateStageLabel(scope, index);
      };
      if (ScrollTrigger && !isMobile() && !reducedMotion) {
        const assemblyPinTarget = stage.closest(".assembly-visual") || stage;
        ScrollTrigger.create({
          trigger: assemblyTrigger,
          start: "top top",
          // Give the 12-stage assembly a deliberate scroll runway so the next
          // section cannot arrive before the visual sequence is complete.
          end: () => `+=${assemblyScrollDistance()}`,
          pin: assemblyPinTarget,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyProgress(self.progress)
        });
      } else {
        const onScroll = () => {
          const rect = (wrapper || stage).getBoundingClientRect();
          const progress = THREE.MathUtils.clamp((window.innerHeight * .24 - rect.top) / Math.max(1, rect.height - window.innerHeight * .68), 0, 1);
          applyProgress(progress);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      }
      scope.querySelectorAll("[data-stage-button]").forEach((button, index) => button.addEventListener("click", () => {
        manualLock = true;
        const stageIndex = Math.min(STAGES.length - 1, STAGE_BUTTON_INDICES[index] ?? index);
        const progress = stageIndex === STAGES.length - 1 ? 1 : Math.min(.999, (stageIndex + .45) / STAGES.length);
        if (result.root.userData.exploded) setExploded(result.root, false, true);
        if (!reducedMotion) {
          const proxy = { value: Number(scope.dataset.stage || 1) / STAGES.length };
          gsap.to(proxy, { value: progress, duration: .8, ease: "power2.inOut", onUpdate: () => applyProgress(proxy.value, true) });
        } else applyProgress(progress, true);
      }));
      updateStageLabel(scope, 0);
      window.WINKO3D.assemblies.push(result);
    };
    if (ScrollTrigger && !isMobile() && !reducedMotion) {
      boot();
    } else if ("IntersectionObserver" in window) {
      const lazyObserver = new IntersectionObserver(([entry], observer) => { if (entry.isIntersecting) { observer.disconnect(); boot(); } }, { rootMargin: "420px" });
      lazyObserver.observe(stage);
    } else boot();
  });
}

function setLocale(locale) {
  window.WINKO_3D_LOCALE = locale;
  document.querySelectorAll("[data-hero-tank-stage] [data-stage-button], .assembly-stage-wrap [data-stage-button]").forEach((button) => {
    const key = button.dataset.stageKey;
    const definition = STAGES.find((stage) => stage.key === key);
    const label = button.querySelector("span");
    if (label && definition) label.textContent = stageText(definition, "label");
  });
  document.querySelectorAll("[data-stage-title]").forEach((node) => {
    const current = STAGES[Number(node.closest("[data-tank-assembly]")?.dataset.stage || 1) - 1] || STAGES[0];
    node.textContent = stageText(current, "label");
  });
  document.querySelectorAll("[data-stage-detail]").forEach((node) => {
    const current = STAGES[Number(node.closest("[data-tank-assembly]")?.dataset.stage || 1) - 1] || STAGES[0];
    node.textContent = stageText(current, "detail");
  });
}

window.WINKO3D = { heroes: [], assemblies: [], createTankModel, setExploded, setFocusMode, initHeroStages, initAssemblyStages, setLocale, TANK_SPEC, PANEL_FACE };
window.dispatchEvent(new Event("winko:3d-ready"));

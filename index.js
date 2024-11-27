const UP = new THREE.Vector3(0, 1, 0); // x = LR y = UD z = FB
const DOWN = new THREE.Vector3(0, -1, 0);

const LEFT = new THREE.Vector3(-1, 0, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

const FRONT = new THREE.Vector3(0, 0, 1);
const BACK = new THREE.Vector3(0, 0, -1);

const FACE_TRAD = [2, 3, 1, 0, 4, 5]; //right, left, up, down, front, back

const DIRECTIONS = [UP, DOWN, LEFT, RIGHT, FRONT, BACK]; // 0 1 2 3 4 5
const ADJACENCY = [
  [5, 3, 4, 2],
  [4, 2, 5, 3],
  [0, 4, 1, 5],
  [0, 5, 1, 4],
  [0, 3, 1, 2],
  [0, 2, 1, 3],
]; // NORTH EAST SOUTH WEST
const IDdirections = [0, 1, 2, 3, 4, 5];
const reverseIDdirections = [1, 0, 3, 2, 5, 4];

var button_clicked = false;

const scene = new THREE.Scene();

const geometryFace = new THREE.PlaneGeometry(1, 1);
const halfFace = new THREE.PlaneGeometry(1, 0.5);
const quarterFace = new THREE.PlaneGeometry(1, 0.25);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.001,
  1000
);
camera.position.z = 30;
camera.position.y = 10;
camera.position.x = 15;

var selectedCube = null;
var to_erase = [];

function faceEqual(face1, face2) {
  return (
    face1[0].cube.position.x == face2[0].cube.position.x &&
    face1[0].cube.position.y == face2[0].cube.position.y &&
    face1[0].cube.position.z == face2[0].cube.position.z &&
    face1[1] == face2[1]
  );
}
function faceInList(List, face) {
  for (let i = 0; i < List.length; i++) {
    if (faceEqual(List[i], face)) {
      return true;
    }
  }
  return false;
}
function cubeInList(List, cube) {
  for (let i = 0; i < List.length; i++) {
    if (
      cube.cube.position.x == List[i].cube.position.x &&
      cube.cube.position.y == List[i].cube.position.y &&
      cube.cube.position.z == List[i].cube.position.z
    ) {
      return true;
    }
  }
  return false;
}
function mousePressed() {
  if (button_clicked) {
    button_clicked = false;
  } else if (selectedCube != null) {
    var position = selectedCube.object.position.clone();
    var normal = selectedCube.normal;
    position.add(normal);
    polycube.addcube(position.x, position.y, position.z);
  }
}
function rightclick() {
  if (button_clicked) {
    button_clicked = false;
  } else if (selectedCube != null) {
    var index = scene.children.indexOf(selectedCube.object);
    scene.children.splice(index, 1);
    polycube.removecube(selectedCube.object);
  }
}

class Cube {
  constructor(x, y, z, polycube, id) {
    const piece = new THREE.BoxGeometry(1, 1, 1);
    const material0 = new THREE.MeshPhongMaterial({
      color: 0x888888,
    });
    const material1 = new THREE.MeshPhongMaterial({
      color: 0xcc1111,
    });
    const material2 = new THREE.MeshPhongMaterial({
      color: 0x1111cc,
    });
    const material3 = new THREE.MeshPhongMaterial({
      color: 0x11cc11,
    });
    const material4 = new THREE.MeshPhongMaterial({
      color: 0xed9121,
    });

    var cube = new THREE.Mesh(piece, [
      material0,
      material1,
      material2,
      material3,
      material4,
    ]);

    for (let i = 0; i < 6; i++) {
      cube.geometry.groups[i].materialIndex = 0;
    }
    cube.position.set(x, y, z);

    this.id = id;
    this.cube = cube;
    this.up = { val: null };
    this.down = { val: null };
    this.left = { val: null };
    this.right = { val: null };
    this.front = { val: null };
    this.back = { val: null };
    this.adjacency = [
      this.up,
      this.down,
      this.left,
      this.right,
      this.front,
      this.back,
    ]; // [UP, DOWN, LEFT, RIGHT, FRONT, BACK]

    this.findAdjacent(polycube);
    this.degree = 0;
    for (let i = 0; i < 6; i++) {
      if (this.adjacency[i].val != null) {
        this.degree += 1;
      }
    }
  }

  findAdjacent(polycube) {
    for (let i = 0; i < polycube.cubes.length; i++) {
      const dx = polycube.cubes[i].cube.position.x - this.cube.position.x;
      const dy = polycube.cubes[i].cube.position.y - this.cube.position.y;
      const dz = polycube.cubes[i].cube.position.z - this.cube.position.z;
      const vector = new THREE.Vector3(dx, dy, dz);
      for (let j in IDdirections) {
        if (
          vector.x == DIRECTIONS[j].x &&
          vector.y == DIRECTIONS[j].y &&
          vector.z == DIRECTIONS[j].z
        ) {
          this.adjacency[j].val = polycube.cubes[i];
          polycube.cubes[i].adjacency[reverseIDdirections[j]].val = this;
          polycube.cubes[i].degree += 1;
        }
      }
    }
  }
  westFace(direction) {
    if (this.adjacency[ADJACENCY[direction][3]].val == null) {
      return [this, ADJACENCY[direction][3]];
    }
    if (
      this.adjacency[ADJACENCY[direction][3]].val.adjacency[direction].val ==
      null
    ) {
      return [this.adjacency[ADJACENCY[direction][3]].val, direction];
    }
    return [
      this.adjacency[ADJACENCY[direction][3]].val.adjacency[direction].val,
      ADJACENCY[direction][1],
    ];
  }
  eastFace(direction) {
    if (this.adjacency[ADJACENCY[direction][1]].val == null) {
      return [this, ADJACENCY[direction][1]];
    }
    if (
      this.adjacency[ADJACENCY[direction][1]].val.adjacency[direction].val ==
      null
    ) {
      return [this.adjacency[ADJACENCY[direction][1]].val, direction];
    }
    return [
      this.adjacency[ADJACENCY[direction][1]].val.adjacency[direction].val,
      ADJACENCY[direction][3],
    ];
  }
  northFace(direction) {
    if (this.adjacency[ADJACENCY[direction][0]].val == null) {
      return [this, ADJACENCY[direction][0]];
    }
    if (
      this.adjacency[ADJACENCY[direction][0]].val.adjacency[direction].val ==
      null
    ) {
      return [this.adjacency[ADJACENCY[direction][0]].val, direction];
    }
    return [
      this.adjacency[ADJACENCY[direction][0]].val.adjacency[direction].val,
      ADJACENCY[direction][2],
    ];
  }
  southFace(direction) {
    if (this.adjacency[ADJACENCY[direction][2]].val == null) {
      return [this, ADJACENCY[direction][2]];
    }
    if (
      this.adjacency[ADJACENCY[direction][2]].val.adjacency[direction].val ==
      null
    ) {
      return [this.adjacency[ADJACENCY[direction][2]].val, direction];
    }
    return [
      this.adjacency[ADJACENCY[direction][2]].val.adjacency[direction].val,
      ADJACENCY[direction][0],
    ];
  }
}

class Polycube {
  constructor() {
    this.cubes = [];
    this.layers = [];
  }

  clearPolycube() {
    for (let i = 0; i < this.cubes.length; i++) {
      scene.remove(this.cubes[i].cube);
    }
    this.cubes = [];
    this.layers = [];
  }

  addcube(x, y, z) {
    var cube = new Cube(
      x,
      y,
      z,
      this,
      x.toString() + "-" + y.toString() + "-" + z.toString()
    );
    this.cubes.push(cube);

    scene.add(cube.cube);
  }

  removecube(cube_mesh) {
    var cube;
    for (let i = 0; i < this.cubes.length; i++) {
      if (this.cubes[i].cube === cube_mesh) {
        cube = this.cubes[i];
        var cube_index = i;
      }
    }

    for (let i = 0; i < 6; i++) {
      if (cube.adjacency[i].val) {
        cube.adjacency[i].val.adjacency[reverseIDdirections[i]].val = null;
        cube.adjacency[i].val.degree -= 1;
      }
    }

    this.cubes.splice(cube_index, 1);
  }

  computeLayers() {
    for (let i = 0; i < this.cubes.length; i++) {
      this.addToLayer(this.cubes[i], this.cubes[i].cube.position.y);
    }
  }

  translate_axis(n) {
    // n equals the number of translation we want the axis to do
    // [UP, DOWN, LEFT, RIGHT, FRONT, BACK]; // 0 1 2 3 4 5
    for (let i = 0; i < this.cubes.length; i++) {
      for (let j = 0; j < n; j++) {
        var stock = this.cubes[i].adjacency[0].val;

        this.cubes[i].adjacency[0].val = this.cubes[i].adjacency[3].val;
        this.cubes[i].adjacency[3].val = this.cubes[i].adjacency[4].val;
        this.cubes[i].adjacency[4].val = stock;

        stock = this.cubes[i].adjacency[1].val;
        this.cubes[i].adjacency[1].val = this.cubes[i].adjacency[2].val;
        this.cubes[i].adjacency[2].val = this.cubes[i].adjacency[5].val;
        this.cubes[i].adjacency[5].val = stock;

        var position = this.cubes[i].cube.position;
        this.cubes[i].cube.position.set(position.z, position.x, position.y);
      }
    }
  }

  addToLayer(cube, level) {
    if (this.layers.length == 0) {
      var new_layer = new Layer(level, true);
      new_layer.addCube(cube);
      this.layers.unshift(new_layer);
      return;
    }
    if (level < this.layers[0].level) {
      var new_layer = new Layer(level, true);
      new_layer.addCube(cube);
      this.layers.unshift(new_layer);
      return;
    }

    for (let i = 0; i < this.layers.length; i++) {
      if (this.layers[i].level == level) {
        this.layers[i].addCube(cube);
        return;
      }
    }
    var new_layer = new Layer(level, true);
    new_layer.addCube(cube);
    this.layers.push(new_layer);
  }

  findNorthLi(face) {
    var Li = face[0].northFace(face[1]);
    var bridge = [];
    if (Li[1] != 1) {
      return [Li, bridge];
    }
    var direction = null;

    if (faceEqual(Li[0].northFace(Li[1]), face)) {
      direction = 2;
    } else if (faceEqual(Li[0].eastFace(Li[1]), face)) {
      direction = 3;
    } else if (faceEqual(Li[0].southFace(Li[1]), face)) {
      direction = 0;
    } else if (faceEqual(Li[0].westFace(Li[1]), face)) {
      direction = 1;
    } else {
      return [[null, null], bridge];
    }

    while (Li[1] == 1) {
      bridge.push(Li);
      switch (direction) {
        case 0:
          Li = Li[0].northFace(Li[1]);
          break;
        case 1:
          Li = Li[0].eastFace(Li[1]);
          break;
        case 2:
          Li = Li[0].southFace(Li[1]);
          break;
        case 3:
          Li = Li[0].westFace(Li[1]);
          break;
      }
    }
    return [Li, bridge];
  }
  findRandL() {
    var F = null;
    for (let i = 0; i < this.layers[0].cubes.length; i++) {
      if (
        this.layers[0].cubes[i].up.val == null &&
        ((this.layers[0].cubes[i].front.val != null &&
          this.layers[0].cubes[i].front.val.up.val != null) ||
          (this.layers[0].cubes[i].back.val != null &&
            this.layers[0].cubes[i].back.val.up.val != null) ||
          (this.layers[0].cubes[i].left.val != null &&
            this.layers[0].cubes[i].left.val.up.val != null) ||
          (this.layers[0].cubes[i].right.val != null &&
            this.layers[0].cubes[i].right.val.up.val != null))
      ) {
        F = [this.layers[0].cubes[i], 0];
        break;
      }
    }

    if (F != null) {
      var e2 = F;
      var e1 = null;
      var e1direction = null;
      //find e1 direction
      if (F[0].front.val != null && F[0].front.val.up.val != null) {
        e1 = e2;
        e1direction = 0;
        while (e1[0].back.val != null) {
          e1 = [e1[0].back.val, 0];
        }
      }
      if (F[0].back.val != null && F[0].back.val.up.val != null) {
        e1 = e2;
        e1direction = 2;
        while (e1[0].front.val != null) {
          e1 = [e1[0].front.val, 0];
        }
      }
      if (F[0].left.val != null && F[0].left.val.up.val != null) {
        e1 = e2;
        e1direction = 1;
        while (e1[0].right.val != null) {
          e1 = [e1[0].right.val, 0];
        }
      }
      if (F[0].right.val != null && F[0].right.val.up.val != null) {
        e1 = e2;
        e1direction = 3;
        while (e1[0].left.val != null) {
          e1 = [e1[0].left.val, 0];
        }
      }

      if (e1 == null) {
        return "e1 is null";
      }

      var R1 = null;
      switch (e1direction) {
        case 0:
          R1 = e1[0].northFace(0);
          break;
        case 1:
          R1 = e1[0].eastFace(0);
          break;
        case 2:
          R1 = e1[0].southFace(0);
          break;
        case 3:
          R1 = e1[0].westFace(0);
          break;
      }

      if (R1 == null) {
        return "R1 not found";
      }
    } else {
      for (let i = 0; i < this.layers[0].cubes.length; i++) {
        if (this.layers[0].cubes[i].back.val == null) {
          R1 = [this.layers[0].cubes[i], 5];
          break;
        }
      }
    }

    var L1 = R1[0].eastFace(R1[1]);
    this.layers[0].addR(R1);
    this.layers[0].addL(L1);

    var Ri = R1;
    var Li = L1;
    this.layers[0].clockwise = false;
    var bridge = [];
    for (let i = 1; i < this.layers.length; i++) {
      var clip = this.layers[i - 1].findclip(Ri);

      if (clip.length == 0) {
        Li = this.findNorthLi(Ri)[0];
        bridge = this.findNorthLi(Ri)[1];
      } else {
        var possibleLi = this.layers[i - 1].findFacesAdjacentToclip(Ri);
        for (let possible = 0; possible < possibleLi.length; possible++) {
          if (
            possibleLi[possible][1] == Ri[1] ||
            possibleLi[possible][1] == reverseIDdirections[Ri[1]]
          ) {
            Li = possibleLi[possible];
          }
        }
        bridge = this.layers[i - 1].findBridge(Ri, Li);
      }

      if (Li[1] == 1 || Li[1] == 0) {
        return;
      }

      if (Ri[1] == Li[1]) {
        this.layers[i].clockwise = this.layers[i - 1].clockwise;
      } else {
        this.layers[i].clockwise = !this.layers[i - 1].clockwise;
      }

      var tmp = null;
      if (this.layers[i].clockwise) {
        tmp = Li[0].westFace(Li[1]);
      } else {
        tmp = Li[0].eastFace(Li[1]);
      }

      var index = 0;
      while (!faceEqual(tmp, Li)) {
        if (
          this.layers[i].findclip(tmp).length == 0 ||
          this.layers[i].findFacesAdjacentToclip(tmp).length != 0
        ) {
          Ri = tmp;
        }
        index += 1;
        if (this.layers[i].clockwise) {
          tmp = tmp[0].westFace(tmp[1]);
        } else {
          tmp = tmp[0].eastFace(tmp[1]);
        }
      }

      if (i == this.layers.length - 1 || faceEqual(Ri, Li)) {
        if (this.layers[i].clockwise) {
          Ri = Li[0].eastFace(Li[1]);
        } else {
          Ri = Li[0].westFace(Li[1]);
        }
      }
      this.layers[i].addR(Ri);
      this.layers[i].addL(Li);
      this.layers[i - 1].bridge = bridge;
    }
    return "finished";
  }
  computeUnfold() {
    this.computeLayers();
    return this.findRandL();
  }
}

class Unfolded {
  constructor(x, y) {
    this.faces = [];
    this.x = x;
    this.y = y;
  }

  createUnfoldFromMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == 1) {
          this.addFace(this.x + j, this.y + i, 0);
        }
      }
    }
  }

  addFace(x, y, z) {
    const material1 = new THREE.MeshPhongMaterial({
      color: color,
    });
    var face = new THREE.Mesh(geometryFace, material1);
    face.position.set(x, y, z);

    this.faces.push(face);
    scene.add(face);
  }
}

//raycasting
var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();
pointer.x = camera.x;
pointer.y = camera.y;
raycaster.setFromCamera(pointer, camera);

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
  if (to_erase.length > 0) {
    to_erase[0].materialIndex = to_erase[1];
    to_erase = [];
  }
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  var color = new THREE.Color();

  // calculate objects intersecting the picking ray
  selectedCube = null;
  const intersects = raycaster.intersectObjects(scene.children);

  while (intersects.length > 0) {
    if (intersects[0].object.geometry.type == "BoxGeometry") {
      break;
    } else {
      intersects.shift();
    }
  }

  if (intersects.length >= 1) {
    face = Math.floor(intersects[0].faceIndex / 2);
    color_index = intersects[0].object.geometry.groups[face].materialIndex;
    intersects[0].object.geometry.groups[face].materialIndex = 1;
    to_erase = [intersects[0].object.geometry.groups[face], color_index];

    selectedCube = intersects[0];
  }
}

var zooming = false;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var camToSave = {};
camToSave.position = camera.position.clone();
camToSave.rotation = camera.rotation.clone();
camToSave.controlCenter = controls.target.clone();

requestAnimationFrame(render);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", mousePressed);
window.addEventListener("contextmenu", rightclick);

var polycube = new Polycube();
const axesHelper = new THREE.AxesHelper(5);
//The X axis is red. The Y axis is green. The Z axis is blue.
scene.add(axesHelper);

polycube.addcube(0, 0, 0);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.z = 10;
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.z = -10;
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight3.position.x = 10;
scene.add(directionalLight3);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight4.position.x = -10;
scene.add(directionalLight4);

const directionalLight5 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight5.position.y = 10;
scene.add(directionalLight5);

const directionalLight6 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight6.position.y = -10;
scene.add(directionalLight6);

function animate() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

function resetScene() {
  scene.clear();
  scene.add(directionalLight);
  scene.add(directionalLight2);
  scene.add(directionalLight3);
  scene.add(directionalLight4);
  scene.add(directionalLight5);
  scene.add(directionalLight6);
  scene.add(axesHelper);
}

function buttonclicked() {
  button_clicked = true;
  if (polycube.cubes.length <= 0) {
    return;
  }
  var x = new convexity(polycube);
  if (x.convex) {
    resetScene();
    polycube.computeUnfold();
    unfolds = creatingUnfold();
    polycube.clearPolycube();
  } else {
    console.log("Should have been convex!");
  }
}

function button2clicked() {
  button_clicked = true;
  unfoldPolycubeTree();
}

function button3clicked() {
  button_clicked = true;
  polycube.clearPolycube();
  resetScene();
  polycube.addcube(0, 0, 0);
}

function button4clicked() {
  button_clicked = true;
  polycube.clearPolycube();
  resetScene();
  polycube.addcube(10, 0, 13);

  let layer = 7;
  //layer1;
  if (layer > 0) {
    polycube.addcube(9, 0, 13);
    polycube.addcube(10, 0, 12);
    polycube.addcube(9, 0, 12);
    polycube.addcube(10, 0, 11);
    polycube.addcube(9, 0, 11);
    polycube.addcube(8, 0, 11);
  }

  //layer2;
  if (layer > 1) {
    polycube.addcube(9, 1, 11);
    polycube.addcube(8, 1, 11);
    polycube.addcube(7, 1, 11);
    polycube.addcube(6, 1, 11);
    polycube.addcube(7, 1, 12);
    polycube.addcube(6, 1, 12);

    polycube.addcube(6, 1, 10);
    polycube.addcube(6, 1, 9);
    polycube.addcube(5, 1, 9);
    polycube.addcube(6, 1, 8);
    polycube.addcube(5, 1, 8);
    polycube.addcube(6, 1, 7);
    polycube.addcube(5, 1, 7);
  }

  //layer 3
  if (layer > 2) {
    polycube.addcube(6, 2, 8);
    polycube.addcube(7, 2, 8);
    polycube.addcube(8, 2, 8);
    polycube.addcube(9, 2, 8);
    polycube.addcube(10, 2, 9);
    polycube.addcube(10, 2, 8);
    polycube.addcube(10, 2, 7);
    polycube.addcube(10, 2, 6);
    polycube.addcube(10, 2, 5);
    polycube.addcube(10, 2, 4);
    polycube.addcube(11, 2, 5);
    polycube.addcube(11, 2, 4);
  }

  //layer 4
  if (layer > 3) {
    polycube.addcube(10, 3, 4);
    polycube.addcube(9, 3, 4);
    polycube.addcube(8, 3, 4);
    polycube.addcube(8, 3, 5);
    polycube.addcube(8, 3, 6);
    polycube.addcube(7, 3, 4);
    polycube.addcube(7, 3, 3);
    polycube.addcube(7, 3, 2);
    polycube.addcube(7, 3, 1);
  }

  //layer 5
  if (layer > 4) {
    polycube.addcube(7, 4, 1);
    polycube.addcube(6, 4, 1);
    polycube.addcube(5, 4, 1);
    polycube.addcube(4, 4, 1);
  }

  //layer 6
  if (layer > 5) {
    polycube.addcube(4, 5, 1);
    polycube.addcube(4, 5, 2);
    polycube.addcube(4, 5, 3);
    polycube.addcube(4, 5, 4);
    polycube.addcube(3, 5, 2);
    polycube.addcube(2, 5, 2);
  }

  //layer 7
  if (layer > 6) {
    polycube.addcube(2, 6, 2);
  }
}

document.getElementById("button").addEventListener("click", () => {
  buttonclicked();
});

document.getElementById("button2").addEventListener("click", () => {
  button2clicked();
});

document.getElementById("button3").addEventListener("click", () => {
  button3clicked();
});

document.getElementById("button4").addEventListener("click", () => {
  button4clicked();
});

class check_poly_tree {
  constructor(polycube) {
    this.cube_list = [];
    this.isTree = false;
    if (polycube.cubes.length > 0) {
      var initial_cube = polycube.cubes[0];
      this.cube_list.push(initial_cube);
      var tree = this.depth_search(initial_cube, null);
      this.isTree = tree;
    }

    if (this.cube_list.length != polycube.cubes.length) {
      this.isTree = false;
    }
  }

  depth_search(cube, parent) {
    for (let i = 0; i < 6; i++) {
      let adjacent = cube.adjacency[i].val;
      if (adjacent != null) {
        if (adjacent == parent) {
        } else if (this.cube_list.includes(adjacent)) {
          return false;
        } else {
          this.cube_list.push(adjacent);
          let tree = this.depth_search(adjacent, cube);
          if (!tree) {
            return tree;
          }
        }
      }
    }
    return true;
  }
}

class plotUnfolding {
  constructor(facesList) {
    this.faces = facesList;
    this.dict = {};
    // starting coordinates:
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  constructDict() {
    this.dict = {};
    for (let i in this.faces) {
      var current_face = this.faces[i];
      // faces that have a left or right neighbor attached only occure once in the list
      if (!Array.isArray(current_face)) {
        if (current_face in this.dict) {
          // if this face already was in the dictionnary, we increment its value
          this.dict[current_face] += 1;
        } else {
          // else, we set it to 1 since it's the first time it appears
          this.dict[current_face] = 1;
        }
      }
    }
  }

  plot() {
    this.constructDict();
    for (let i in this.faces) {
      if (Array.isArray(this.faces[i])) {
        this.y += 1;
        for (let j in this.faces[i]) {
          if (this.faces[i][j][0] == "L") {
            this.plotFace(this.faces[i][j], "left");
          } else if (this.faces[i][j][0] == "R") {
            this.plotFace(this.faces[i][j], "right");
          } else {
            this.plotFace(this.faces[i][j], null);
          }
        }
      } else {
        if (this.dict[this.faces[i]] == 1) {
          this.y += 1;
          this.plotFace(this.faces[i], null);
        } else if (this.dict[this.faces[i]] == 2) {
          this.plotHalfFace(this.faces[i], null);
          this.x += 1;
        } else {
          this.plotQuarterFace(this.faces[i], null);
          this.x += 1;
        }
      }
    }
    polycube.clearPolycube();
  }

  countFaceOccuranceInList(face) {
    var counter = 0;
    for (let k in this.faces) {
      if (Array.isArray(this.faces[k])) {
        for (let l in this.faces[k]) {
          if (this.faces[k][l] == face) {
            counter += 1;
          }
        }
      } else {
        if (this.faces[k] == face) {
          counter += 1;
        }
      }
    }
    return counter;
  }

  plotFace(face, direction) {
    const material1 = new THREE.MeshPhongMaterial({
      color: "blue",
    });
    var face = new THREE.Mesh(geometryFace, material1);
    if (direction == "right") {
      face.position.set(this.x + 1, this.y, this.z);
    } else if (direction == "left") {
      face.position.set(this.x - 1, this.y, this.z);
    } else {
      face.position.set(this.x, this.y, this.z);
    }
    scene.add(face);
  }

  plotHalfFace(face) {
    const material2 = new THREE.MeshPhongMaterial({
      color: "blue",
    });
    var face = new THREE.Mesh(halfFace, material2);
    face.position.set(this.x + 1, this.y + 0.25, this.z);
    scene.add(face);
  }

  plotQuarterFace(face) {
    const material3 = new THREE.MeshPhongMaterial({
      color: "blue",
    });
    var face = new THREE.Mesh(quarterFace, material3);
    face.position.set(this.x + 1, this.y + 0.375, this.z);
    scene.add(face);
  }

  clearPlot() {
    for (let i in this.faces) {
      scene.remove(this.faces[i]);
    }
    this.faces = [];
  }
}

var unfoldedFaces = []; // list of faces that will be seen during the unfolding
var plot = new plotUnfolding();

function findCubeAdjacency(cube, direction) {
  for (let i in cube.adjacency) {
    if (
      cube.adjacency[i].val != null &&
      cube.adjacency[i].val == direction[0]
    ) {
      return reverseIDdirections[i];
    }
  }
}

function findAdjacentFaces(cube, entryface) {
  var directionList = [];
  var neighbors = [];
  var exitfaces = [];
  var east = cube.eastFace(entryface);
  var west = cube.westFace(entryface);
  var north = cube.northFace(entryface);
  var south = cube.southFace(entryface);

  if (
    cube.adjacency[reverseIDdirections[entryface]].val != null &&
    cube.adjacency[reverseIDdirections[entryface]].val != cube
  ) {
    directionList.push("back");
    neighbors.push(cube.adjacency[reverseIDdirections[entryface]].val);
    exitfaces.push([IDdirections[entryface]]);
  }

  if (east[0] != cube) {
    directionList.push("east");
    neighbors.push(east[0]);
    exitfaces.push(findCubeAdjacency(cube, east));
  }
  if (west[0] != cube) {
    directionList.push("west");
    neighbors.push(west[0]);
    exitfaces.push(findCubeAdjacency(cube, west));
  }
  if (north[0] != cube) {
    directionList.push("north");
    neighbors.push(north[0]);
    exitfaces.push(findCubeAdjacency(cube, north));
  }
  if (south[0] != cube) {
    directionList.push("south");
    neighbors.push(south[0]);
    exitfaces.push(findCubeAdjacency(cube, south));
  }
  return [neighbors, exitfaces, directionList];
}

function unfoldPolycubeTree() {
  var ifTree = new check_poly_tree(polycube);
  if (ifTree.isTree == false) {
    console.log("This polycube is not a tree");
    return;
  }
  resetScene();
  unfoldedFaces = [];
  var root = null;
  for (let i in polycube.cubes) {
    if (polycube.cubes[i].degree == 0) {
      // if there is only 1 cube
      unfoldedFaces.push("F" + polycube.cubes[i].id);
      unfoldedFaces.push([
        "T" + polycube.cubes[i].id,
        "R" + polycube.cubes[i].id,
      ]);
      unfoldedFaces.push("K" + polycube.cubes[i].id);
      unfoldedFaces.push([
        "B" + polycube.cubes[i].id,
        "L" + polycube.cubes[i].id,
      ]);
      break;
    }
    if (polycube.cubes[i].degree == 1) {
      root = polycube.cubes[i];
      recursiveUnfolding(root, null, null);
      break;
    }
  }
  console.log("unfolded faces = ", unfoldedFaces);
  plot = new plotUnfolding(unfoldedFaces);
  plot.plot();
}

function recursiveUnfolding(node, entryface) {
  if (entryface == null) {
    // root
    for (let i in node.adjacency) {
      if (node.adjacency[i].val != null) {
        unfoldedFaces.push("F" + node.id);
        unfoldedFaces.push(["T" + node.id, "R" + node.id]);
        recursiveUnfolding(node.adjacency[i].val, reverseIDdirections[i]);
        unfoldedFaces.push(["B" + node.id, "L" + node.id]);
        break;
      }
    }
  } else {
    switch (node.degree) {
      case 1:
        degree1(node, entryface);
        break;
      case 2:
        degree2(node, entryface);
        break;
      case 3:
        degree3(node, entryface);
        break;
      case 4:
        degree4(node, entryface);
        break;
      case 5:
        degree5(node, entryface);
        break;
      case 6:
        degree6(node, entryface);
    }
  }
}

function degree1(node, entryface) {
  unfoldedFaces.push(["T" + node.id, "R" + node.id]);
  unfoldedFaces.push("K" + node.id);
  unfoldedFaces.push(["B" + node.id, "L" + node.id]);
}

function degree2(node, entryface) {
  var ret_value = findAdjacentFaces(node, entryface);
  var neighbors = ret_value[0];
  var exitfaces = ret_value[1];
  var directions = ret_value[2];
  directions = directions.join(",");
  switch (directions) {
    case "back":
      unfoldedFaces.push(["T" + node.id, "L" + node.id]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push(["B" + node.id, "R" + node.id]);
      break;
    case "east":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("B" + node.id);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("L" + node.id);
      unfoldedFaces.push("B" + node.id);
      break;
    case "west":
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("R" + node.id);
      unfoldedFaces.push("B" + node.id);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "north":
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push(["B" + node.id, "L" + node.id, "R" + node.id]);
      break;
    case "south":
      unfoldedFaces.push(["T" + node.id, "L" + node.id, "R" + node.id]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
  }
}

function degree3(node, entryface) {
  var ret_value = findAdjacentFaces(node, entryface);
  var neighbors = ret_value[0];
  var exitfaces = ret_value[1];
  var directions = ret_value[2];
  directions = directions.join(",");
  switch (directions) {
    case "back,east":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("L" + node.id);
      unfoldedFaces.push("B" + node.id);
      break;
    case "back,west":
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("R" + node.id);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "back,north":
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push(["B" + node.id, "L" + node.id, "R" + node.id]);
      break;
    case "back,south":
      unfoldedFaces.push(["T" + node.id, "L" + node.id, "R" + node.id]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      break;
    case "east,west":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("B" + node.id);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "east,north":
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push("L" + node.id);
      unfoldedFaces.push("B" + node.id);
      break;
    case "east,south":
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("R" + node.id);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      break;
    case "west,north":
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("K" + node.id);
      unfoldedFaces.push("R" + node.id);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      break;
    case "west,south":
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("R" + node.id);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      break;
    case "north,south":
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push(["K" + node.id, "L" + node.id, "R" + node.id]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
  }
}

function degree4(node, entryface) {
  var ret_value = findAdjacentFaces(node, entryface);
  var neighbors = ret_value[0];
  var exitfaces = ret_value[1];
  var directions = ret_value[2];
  directions = directions.join(",");
  switch (directions) {
    case "back,east,west":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "back,east,north":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("L" + node.id);
      unfoldedFaces.push("B" + node.id);
      break;
    case "back,east,south":
      unfoldedFaces.push(["T" + node.id, "R" + node.id]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
    case "back,west,north":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push(["B" + node.id, "L" + node.id]);
      break;
    case "back,west,south":
      unfoldedFaces.push("T" + node.id);
      unfoldedFaces.push("R" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
    case "back,north,south":
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("L" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("R" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
    case "east,west,north":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[2]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "east,west,south":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[2]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
    case "east,north,south":
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("L" + node.id);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
    case "west,north,south":
      unfoldedFaces.push("R" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      break;
  }
}

function degree5(node, entryface) {
  var ret_value = findAdjacentFaces(node, entryface);
  var neighbors = ret_value[0];
  var exitfaces = ret_value[1];
  var directions = ret_value[2];
  directions = directions.join(",");
  switch (directions) {
    case "back,east,west,north":
      recursiveUnfolding(neighbors[3], exitfaces[3]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("B" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      unfoldedFaces.push("B" + node.id);
      break;
    case "back,east,west,south":
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      unfoldedFaces.push("T" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[3], exitfaces[3]);
      break;
    case "back,east,north,south":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("L" + node.id);
      recursiveUnfolding(neighbors[3], exitfaces[3]);
      break;
    case "back,west,north,south":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      unfoldedFaces.push("R" + node.id);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[3], exitfaces[3]);
      break;
    case "east,west,north,south":
      recursiveUnfolding(neighbors[2], exitfaces[2]);
      recursiveUnfolding(neighbors[0], exitfaces[0]);
      unfoldedFaces.push("K" + node.id);
      recursiveUnfolding(neighbors[1], exitfaces[1]);
      recursiveUnfolding(neighbors[3], exitfaces[3]);
      break;
  }
}

function degree6(node, entryface) {
  var ret_value = findAdjacentFaces(node, entryface);
  var neighbors = ret_value[0];
  var exitfaces = ret_value[1];
  // neighbors = back,east,west,north,south
  recursiveUnfolding(neighbors[3], exitfaces[3]); // north
  recursiveUnfolding(neighbors[1], exitfaces[1]); // east
  recursiveUnfolding(neighbors[0], exitfaces[0]); // back
  recursiveUnfolding(neighbors[2], exitfaces[2]); // west
  recursiveUnfolding(neighbors[4], exitfaces[4]); // south
}

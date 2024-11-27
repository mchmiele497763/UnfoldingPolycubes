class Layer {
  constructor(level, clockwise) {
    this.cubes = [];
    this.level = level;
    this.band = [];
    this.bridge = [];
    this.L = null;
    this.R = null;
    this.visited = [];
    this.clockwise = clockwise;
  }
  addCube(cube) {
    this.cubes.push(cube);
  }
  addR(face) {
    this.R = face;
  }

  addL(face) {
    this.L = face;
  }
  computeBand() {
    var currentFace = this.L;
    if (this.clockwise) {
      currentFace = currentFace[0].westFace(currentFace[1]);
    } else {
      currentFace = currentFace[0].eastFace(currentFace[1]);
    }

    while (!faceEqual(currentFace, this.R)) {
      this.band.push(currentFace);
      if (this.clockwise) {
        currentFace = currentFace[0].westFace(currentFace[1]);
      } else {
        currentFace = currentFace[0].eastFace(currentFace[1]);
      }
    }
  }

  findbeam(face) {
    var beam = [];
    var start = face[0].northFace(face[1]);
    if (start[1] != 0) {
      return [[], null];
    }

    var direction = null;

    if (faceEqual(start[0].northFace(0), face)) {
      direction = 2;
    } else if (faceEqual(start[0].eastFace(0), face)) {
      direction = 3;
    } else if (faceEqual(start[0].southFace(0), face)) {
      direction = 0;
    } else if (faceEqual(start[0].westFace(0), face)) {
      direction = 1;
    } else {
      return [[], null];
    }

    while (start[1] == 0) {
      beam.push(start);
      switch (direction) {
        case 0:
          start = start[0].northFace(0);
          break;
        case 1:
          start = start[0].eastFace(0);
          break;
        case 2:
          start = start[0].southFace(0);
          break;
        case 3:
          start = start[0].westFace(0);
          break;
      }
    }
    return [beam, direction];
  }
  lowerfindbeam(face) {
    var beam = [];
    var start = face[0].southFace(face[1]);
    if (start[1] != 0) {
      return [[], null];
    }

    var direction = null;

    if (faceEqual(start[0].northFace(0), face)) {
      direction = 2;
    } else if (faceEqual(start[0].eastFace(0), face)) {
      direction = 3;
    } else if (faceEqual(start[0].southFace(0), face)) {
      direction = 0;
    } else if (faceEqual(start[0].westFace(0), face)) {
      direction = 1;
    } else {
      return [[], null];
    }

    while (start[1] == 0) {
      beam.push(start);
      switch (direction) {
        case 0:
          start = start[0].northFace(0);
          break;
        case 1:
          start = start[0].eastFace(0);
          break;
        case 2:
          start = start[0].southFace(0);
          break;
        case 3:
          start = start[0].westFace(0);
          break;
      }
    }
    return [beam, direction];
  }
  findBeneathbeam(face) {
    var beam = [];
    var start = face[0].southFace(face[1]);
    if (start[1] != 1) {
      return [[], null];
    }

    var direction = null;

    if (faceEqual(start[0].northFace(1), face)) {
      direction = 2;
    } else if (faceEqual(start[0].eastFace(1), face)) {
      direction = 3;
    } else if (faceEqual(start[0].southFace(1), face)) {
      direction = 0;
    } else if (faceEqual(start[0].westFace(1), face)) {
      direction = 1;
    } else {
      return [[], null];
    }

    while (start[1] == 1) {
      beam.push(start);
      switch (direction) {
        case 0:
          start = start[0].northFace(1);
          break;
        case 1:
          start = start[0].eastFace(1);
          break;
        case 2:
          start = start[0].southFace(1);
          break;
        case 3:
          start = start[0].westFace(1);
          break;
      }
    }
    return [beam, direction];
  }

  findclip(face) {
    var clip = [];
    if (this.findbeam(face)[0].length == 0) {
      return clip;
    }

    for (let i = 0; i < this.cubes.length; i++) {
      // [UP, DOWN, LEFT, RIGHT, FRONT, BACK]; 0 1 2 3 4 5
      switch (face[1]) {
        case 2:
          if (this.clockwise) {
            //Z<
            if (
              this.cubes[i].cube.position.z <= face[0].cube.position.z &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          } else {
            if (
              this.cubes[i].cube.position.z >= face[0].cube.position.z &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          }
          break;
        case 3:
          if (this.clockwise) {
            //Z>
            if (
              this.cubes[i].cube.position.z >= face[0].cube.position.z &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          } else {
            if (
              this.cubes[i].cube.position.z <= face[0].cube.position.z &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          }
          break;
        case 4:
          if (this.clockwise) {
            //x<
            if (
              this.cubes[i].cube.position.x <= face[0].cube.position.x &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          } else {
            if (
              this.cubes[i].cube.position.x >= face[0].cube.position.x &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          }
          break;
        case 5:
          if (this.clockwise) {
            //x>
            if (
              this.cubes[i].cube.position.x >= face[0].cube.position.x &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          } else {
            if (
              this.cubes[i].cube.position.x <= face[0].cube.position.x &&
              this.cubes[i].up.val == null
            ) {
              clip.push([this.cubes[i], 0]);
            }
          }
          break;
      }
    }
    return this.removeExcessFromclip(face, clip);
  }
  removeExcessFromclip(face, clip) {
    var visited = [];
    var start = null;
    var queue = [face[0].northFace(face[1])];
    var index = 0;
    while (queue.length > 0) {
      index += 1;
      start = queue[0];
      queue.shift();
      if (faceInList(visited, start)) {
        continue;
      }
      visited.push(start);
      if (
        faceInList(clip, start[0].northFace(start[1])) &&
        !faceInList(visited, start[0].northFace(start[1]))
      ) {
        queue.push(start[0].northFace(start[1]));
      }
      if (
        faceInList(clip, start[0].eastFace(start[1])) &&
        !faceInList(visited, start[0].eastFace(start[1]))
      ) {
        queue.push(start[0].eastFace(start[1]));
      }
      if (
        faceInList(clip, start[0].southFace(start[1])) &&
        !faceInList(visited, start[0].southFace(start[1]))
      ) {
        queue.push(start[0].southFace(start[1]));
      }
      if (
        faceInList(clip, start[0].westFace(start[1])) &&
        !faceInList(visited, start[0].westFace(start[1]))
      ) {
        queue.push(start[0].westFace(start[1]));
      }
    }
    return visited;
  }
  isclipadjacent(face) {
    var beam = this.findbeam(face)[0];
    var direction = this.findbeam(face)[1];
    for (let i = 0; i < beam.length; i++) {
      next = this.findnextfaceforclip(beam[i], direction);
      while (next[1] == 0) {
        next = this.findnextfaceforclip(next, direction);
      }
      if (next[1] == face[1]) {
        return true;
      }
    }
    return false;
  }
  removeExcessFromBridge(Ri, bridge) {
    var visited = [];
    var start = null;
    var queue = [Ri[0].northFace(Ri[1])];
    var index = 0;
    while (queue.length > 0) {
      if (index > 10) {
        return bridge;
      }
      index += 1;
      start = queue[0];
      queue.shift();
      if (faceInList(visited, start)) {
        continue;
      }
      visited.push(start);
      if (
        faceInList(bridge, start[0].northFace(start[1])) &&
        !faceInList(visited, start[0].northFace(start[1]))
      ) {
        queue.push(start[0].northFace(start[1]));
      }
      if (
        faceInList(bridge, start[0].eastFace(start[1])) &&
        !faceInList(visited, start[0].eastFace(start[1]))
      ) {
        queue.push(start[0].eastFace(start[1]));
      }
      if (
        faceInList(bridge, start[0].southFace(start[1])) &&
        !faceInList(visited, start[0].southFace(start[1]))
      ) {
        queue.push(start[0].southFace(start[1]));
      }
      if (
        faceInList(bridge, start[0].westFace(start[1])) &&
        !faceInList(visited, start[0].westFace(start[1]))
      ) {
        queue.push(start[0].westFace(start[1]));
      }
    }
    return visited;
  }
  findBridge(Ri, Li) {
    var directionx = Ri[1] == 4 || Ri[1] == 5;
    var maxval = 0;
    var minval = 0;
    if (directionx) {
      minval = Math.min(Ri[0].cube.position.x, Li[0].cube.position.x);
      maxval = Math.max(Ri[0].cube.position.x, Li[0].cube.position.x);
    } else {
      minval = Math.min(Ri[0].cube.position.z, Li[0].cube.position.z);
      maxval = Math.max(Ri[0].cube.position.z, Li[0].cube.position.z);
    }

    var bridge = [];
    for (let i = 0; i < this.cubes.length; i++) {
      if (directionx) {
        if (
          this.cubes[i].cube.position.x >= minval &&
          this.cubes[i].cube.position.x <= maxval &&
          this.cubes[i].up.val == null
        ) {
          bridge.push([this.cubes[i], 0]);
        }
      } else {
        if (
          this.cubes[i].cube.position.z >= minval &&
          this.cubes[i].cube.position.z <= maxval &&
          this.cubes[i].up.val == null
        ) {
          bridge.push([this.cubes[i], 0]);
        }
      }
    }
    return this.removeExcessFromBridge(Ri, bridge);
  }
  findFacesAdjacentToclip(face) {
    var faces = [];
    if (this.findbeam(face)[0].length == 0) {
      return faces;
    }
    var clip = this.findclip(face);
    clip = this.removeExcessFromclip(face, clip);

    for (let i = 0; i < this.cubes.length; i++) {
      // [UP, DOWN, LEFT, RIGHT, FRONT, BACK]; 0 1 2 3 4 5
      switch (face[1]) {
        case 2:
          if (this.clockwise) {
            //Z<
            if (
              this.cubes[i].cube.position.z <= face[0].cube.position.z &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          } else {
            if (
              this.cubes[i].cube.position.z >= face[0].cube.position.z &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          }
          break;
        case 3:
          if (this.clockwise) {
            //Z>
            if (
              this.cubes[i].cube.position.z >= face[0].cube.position.z &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          } else {
            if (
              this.cubes[i].cube.position.z <= face[0].cube.position.z &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          }
          break;
        case 4:
          if (this.clockwise) {
            //x<
            if (
              this.cubes[i].cube.position.x <= face[0].cube.position.x &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          } else {
            if (
              this.cubes[i].cube.position.x >= face[0].cube.position.x &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          }
          break;
        case 5:
          if (this.clockwise) {
            //x>

            if (
              this.cubes[i].cube.position.x >= face[0].cube.position.x &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          } else {
            if (
              this.cubes[i].cube.position.x <= face[0].cube.position.x &&
              this.cubes[i].up.val != null
            ) {
              if (
                this.cubes[i].up.val.adjacency[face[1]].val == null &&
                faceInList(clip, this.cubes[i].up.val.southFace(face[1]))
              ) {
                faces.push([this.cubes[i].up.val, face[1]]);
                continue;
              }
              if (
                this.cubes[i].up.val.adjacency[reverseIDdirections[face[1]]]
                  .val == null &&
                faceInList(
                  clip,
                  this.cubes[i].up.val.southFace(reverseIDdirections[face[1]])
                )
              ) {
                faces.push([
                  this.cubes[i].up.val,
                  reverseIDdirections[face[1]],
                ]);
              }
            }
          }
          break;
      }
    }
    return faces;
  }
  isQuasitAdjacent() {
    if (this.L[1] == this.R[1] || this.L[1] == reverseIDdirections[this.R[1]]) {
      return false;
    }
    var westverif = true;
    var start = this.L[0].westFace(this.L[1]);
    while (!faceEqual(start, this.R)) {
      if (start[1] != this.R[1] && start[1] != this.L[1]) {
        westverif = false;
        break;
      }
      start = start[0].westFace(start[1]);
    }
    var eastverif = true;
    var start = this.L[0].eastFace(this.L[1]);
    while (!faceEqual(start, this.R)) {
      if (start[1] != this.R[1] && start[1] != this.L[1]) {
        eastverif = false;
        break;
      }
      start = start[0].eastFace(start[1]);
    }

    return eastverif || westverif;
  }
  findLowerFaces(face) {
    var lowerFaces = [];
    var beneath = [];
    if (this.isQuasitAdjacent()) {
      //qasit adjacent
      if (face[1] == this.L[1] || face[1] == reverseIDdirections[this.L[1]]) {
        var beneath = this.findBeneathbeam(face)[0];
      }
    } else {
      if (face[1] == this.R[1] || face[1] == reverseIDdirections[this.R[1]]) {
        var beneath = this.findBeneathbeam(face)[0];
      }
    }

    for (let i = 0; i < beneath.length; i++) {
      if (
        !faceInList(this.bridge, beneath[i]) &&
        !faceInList(this.visited, beneath[i])
      ) {
        lowerFaces.push(beneath[i]);
        this.visited.push(beneath[i]);
      }
    }
    return lowerFaces;
  }

  findTopFace(face, nextLayer) {
    //add verify for next face
    var beam = this.findbeam(face)[0];
    var direction = this.findbeam(face)[1];
    var topfaces = [];
    if (face[1] != this.R[1] && face[1] != reverseIDdirections[this.R[1]]) {
      return [];
    }
    if (
      face[0].northFace(face[1])[1] != 0 &&
      face[0].northFace(face[1])[1] != 1 &&
      face[0].up.val != null &&
      !faceInList(nextLayer.band, face[0].northFace(face[1])) &&
      !faceEqual(face[0].northFace(face[1]), nextLayer.R) &&
      !faceEqual(face[0].northFace(face[1]), nextLayer.L) &&
      (face[0].northFace(face[1])[1] != nextLayer.R[1] ||
        face[0].northFace(face[1])[1] != reverseIDdirections[nextLayer.R[1]])
    ) {
      nextLayer.visited.push(face[0].northFace(face[1]));
      return [face[0].northFace(face[1])];
    }
    for (let i = 0; i < beam.length; i++) {
      if (
        !faceInList(this.bridge, beam[i]) &&
        !faceInList(this.visited, beam[i])
      ) {
        topfaces.push(beam[i]);
        this.visited.push(beam[i]);
      }
    }

    var extraface = null;
    switch (direction) {
      case 0:
        extraface = beam[beam.length - 1][0].northFace(0);
        break;
      case 1:
        extraface = beam[beam.length - 1][0].eastFace(0);
        break;
      case 2:
        extraface = beam[beam.length - 1][0].southFace(0);
        break;
      case 3:
        extraface = beam[beam.length - 1][0].westFace(0);
        break;
    }
    if (extraface != null) {
      if (
        extraface[1] != 0 &&
        !faceInList(this.band, extraface) &&
        !faceInList(this.visited, extraface) &&
        (extraface[1] == this.R[1] ||
          extraface[1] == reverseIDdirections[this.R[1]]) &&
        cubeInList(this.cubes, extraface[0]) &&
        !faceEqual(extraface, this.R) &&
        !faceEqual(extraface, this.L)
      ) {
        topfaces.push(extraface);
        this.visited.push(extraface);
        var lowerfaces = this.findLowerFaces(extraface);
        for (let i = 0; i < lowerfaces.length; i++) {
          topfaces.push(lowerfaces[i]);
        }
      }
    }
    return topfaces;
  }
}

var color = "blue";

class check_connexity {
  constructor(polycube) {
    this.cube_list = [];
    this.isConnex = false;
    if (polycube.cubes.length > 0) {
      var initial_cube = polycube.cubes[0];
      this.cube_list.push(initial_cube);
      var connex = this.depth_search(initial_cube, null);
      this.isConnex = connex;
    }

    if (this.cube_list.length != polycube.cubes.length) {
      this.isConnex = false;
    }
  }

  depth_search(cube, parent) {
    for (let i = 0; i < 6; i++) {
      let adjacent = cube.adjacency[i].val;
      if (adjacent != null) {
        if (adjacent == parent) {
        } else if (this.cube_list.includes(adjacent)) {
        } else {
          this.cube_list.push(adjacent);
          let connex = this.depth_search(adjacent, cube);
          if (!connex) {
            return connex;
          }
        }
      }
    }
    return true;
  }
}

class convexity {
  constructor(polycube) {
    // check the 3 axis
    // if multiple candidate to convexity take the smallest
    this.polycube = polycube;
    this.plane_xy = {};
    this.plane_yz = {};
    this.plane_xz = {};
    this.connect_x = {};
    this.connect_y = {};
    this.connect_z = {};
    this.connex = new check_connexity(this.polycube);
    if (this.connex.isConnex) {
      this.compute_planes();
      this.convex = this.compute_convexity();
    } else {
      console.log("Polycube is not connex");
      this.convex = false;
    }
  }

  compute_planes() {
    for (let i = 0; i < this.polycube.cubes.length; i++) {
      // [UP, DOWN, LEFT, RIGHT, FRONT, BACK]; // 0 1 2 3 4 5 Y X Z
      var coord = this.polycube.cubes[i].cube.position;
      var adj = this.polycube.cubes[i].adjacency;

      var x_coord = coord.x.toString();
      if (this.connect_x[x_coord]) {
        if (this.connect_x[x_coord][0] > coord.y) {
          // check if y is the smallest
          this.connect_x[x_coord][0] = coord.y;
        } else if (this.connect_x[x_coord][1] < coord.y) {
          // check if y is the biggest
          this.connect_x[x_coord][1] = coord.y;
        }

        if (this.connect_x[x_coord][2] > coord.z) {
          // check if z is the smallest
          this.connect_x[x_coord][2] = coord.z;
        } else if (this.connect_x[x_coord][3] < coord.z) {
          // check if z is the biggest
          this.connect_x[x_coord][3] = coord.z;
        }
        // Add Y adjacency if they exists
        if (adj[0].val && !this.connect_x[x_coord][4].has(coord.y + 0.5)) {
          this.connect_x[x_coord][4].add(coord.y + 0.5);
        }
        if (adj[1].val && !this.connect_x[x_coord][4].has(coord.y - 0.5)) {
          this.connect_x[x_coord][4].add(coord.y - 0.5);
        }

        // Add Z adjacency if they exists
        if (adj[4].val && !this.connect_x[x_coord][5].has(coord.z + 0.5)) {
          this.connect_x[x_coord][5].add(coord.z + 0.5);
        }
        if (adj[5].val && !this.connect_x[x_coord][5].has(coord.z - 0.5)) {
          this.connect_x[x_coord][5].add(coord.z - 0.5);
        }
      } else {
        this.connect_x[x_coord] = [
          coord.y,
          coord.y,
          coord.z,
          coord.z,
          new Set(),
          new Set(),
        ]; // minY maxY minZ maxZ adjY adjZ
      }

      var y_coord = coord.y.toString();
      if (this.connect_y[y_coord]) {
        if (this.connect_y[y_coord][0] > coord.x) {
          // check if x is the smallest
          this.connect_y[y_coord][0] = coord.x;
        } else if (this.connect_y[y_coord][1] < coord.x) {
          // check if x is the biggest
          this.connect_y[y_coord][1] = coord.x;
        }

        if (this.connect_y[y_coord][2] > coord.z) {
          // check if z is the smallest
          this.connect_y[y_coord][2] = coord.z;
        } else if (this.connect_y[y_coord][3] < coord.z) {
          // check if z is the biggest
          this.connect_y[y_coord][3] = coord.z;
        }
        // Add X adjacency if they exists
        if (adj[3].val && !this.connect_y[y_coord][4].has(coord.x + 0.5)) {
          this.connect_y[y_coord][4].add(coord.x + 0.5);
        }
        if (adj[2].val && !this.connect_y[y_coord][4].has(coord.x - 0.5)) {
          this.connect_y[y_coord][4].add(coord.x - 0.5);
        }

        // Add Z adjacency if they exists
        if (adj[4].val && !this.connect_y[y_coord][5].has(coord.z + 0.5)) {
          this.connect_y[y_coord][5].add(coord.z + 0.5);
        }
        if (adj[5].val && !this.connect_y[y_coord][5].has(coord.z - 0.5)) {
          this.connect_y[y_coord][5].add(coord.z - 0.5);
        }
      } else {
        this.connect_y[y_coord] = [
          coord.x,
          coord.x,
          coord.z,
          coord.z,
          new Set(),
          new Set(),
        ]; // minX maxX minZ maxZ adjX adjZ
      }

      var z_coord = coord.z.toString();
      if (this.connect_z[z_coord]) {
        if (this.connect_z[z_coord][0] > coord.x) {
          // check if x is the smallest
          this.connect_z[z_coord][0] = coord.x;
        } else if (this.connect_z[z_coord][1] < coord.x) {
          // check if x is the biggest
          this.connect_z[z_coord][1] = coord.x;
        }

        if (this.connect_z[z_coord][2] > coord.y) {
          // check if z is the smallest
          this.connect_z[z_coord][2] = coord.y;
        } else if (this.connect_z[z_coord][3] < coord.y) {
          // check if z is the biggest
          this.connect_z[z_coord][3] = coord.y;
        }
        // Add X adjacency if they exists
        if (adj[3].val && !this.connect_z[z_coord][4].has(coord.x + 0.5)) {
          this.connect_z[z_coord][4].add(coord.x + 0.5);
        }
        if (adj[2].val && !this.connect_z[z_coord][4].has(coord.x - 0.5)) {
          this.connect_z[z_coord][4].add(coord.x - 0.5);
        }

        // Add Z adjacency if they exists
        if (adj[0].val && !this.connect_z[z_coord][5].has(coord.y + 0.5)) {
          this.connect_z[z_coord][5].add(coord.y + 0.5);
        }
        if (adj[1].val && !this.connect_z[z_coord][5].has(coord.y - 0.5)) {
          this.connect_z[z_coord][5].add(coord.y - 0.5);
        }
      } else {
        this.connect_z[z_coord] = [
          coord.x,
          coord.x,
          coord.y,
          coord.y,
          new Set(),
          new Set(),
        ]; // minX maxX minY maxY adjX adjY
      }

      var xy_coord = coord.x.toString() + "-" + coord.y.toString();
      if (this.plane_xy[xy_coord]) {
        this.plane_xy[xy_coord].push(coord.z);
      } else {
        this.plane_xy[xy_coord] = [coord.z];
      }

      var yz_coord = coord.y.toString() + "-" + coord.z.toString();
      if (this.plane_yz[yz_coord]) {
        this.plane_yz[yz_coord].push(coord.x);
      } else {
        this.plane_yz[yz_coord] = [coord.x];
      }

      var xz_coord = coord.x.toString() + "-" + coord.z.toString();
      if (this.plane_xz[xz_coord]) {
        this.plane_xz[xz_coord].push(coord.y);
      } else {
        this.plane_xz[xz_coord] = [coord.y];
      }
    }
  }

  compute_convexity() {
    var x_convex = true;
    var x_min = Number.POSITIVE_INFINITY;
    var x_max = Number.NEGATIVE_INFINITY;

    for (const [key, value] of Object.entries(this.plane_yz)) {
      var min = Math.min(...value);
      var max = Math.max(...value);
      if (min < x_min) {
        x_min = min;
      }
      if (max > x_max) {
        x_max = max;
      }

      var segment_length = max - min + 1;
      if (value.length != segment_length) {
        x_convex = false;
      }
    }

    if (x_convex) {
      for (const [key, value] of Object.entries(this.connect_x)) {
        let y = value[4];
        let z = value[5];

        var min_y = value[0];
        var max_y = value[1];
        var min_z = value[2];
        var max_z = value[3];

        var segment_length = max_y - min_y;
        if (y.size != segment_length) {
          x_convex = false;
        }

        segment_length = max_z - min_z;
        if (z.size != segment_length) {
          x_convex = false;
        }
      }
    }

    var y_convex = true;
    var y_min = Number.POSITIVE_INFINITY;
    var y_max = Number.NEGATIVE_INFINITY;

    for (const [key, value] of Object.entries(this.plane_xz)) {
      var min = Math.min(...value);
      var max = Math.max(...value);
      if (min < y_min) {
        y_min = min;
      }
      if (max > y_max) {
        y_max = max;
      }
      var segment_length = max - min + 1;
      if (value.length != segment_length) {
        y_convex = false;
      }
    }

    if (y_convex) {
      for (const [key, value] of Object.entries(this.connect_y)) {
        let x = value[4];
        let z = value[5];

        var min_x = value[0];
        var max_x = value[1];
        var min_z = value[2];
        var max_z = value[3];

        var segment_length = max_x - min_x;
        if (x.size != segment_length) {
          y_convex = false;
        }

        segment_length = max_z - min_z;
        if (z.size != segment_length) {
          y_convex = false;
        }
      }
    }

    var z_convex = true;
    var z_min = Number.POSITIVE_INFINITY;
    var z_max = Number.NEGATIVE_INFINITY;

    for (const [key, value] of Object.entries(this.plane_xy)) {
      var min = Math.min(...value);
      var max = Math.max(...value);
      if (min < z_min) {
        z_min = min;
      }
      if (max > z_max) {
        z_max = max;
      }
      var segment_length = max - min + 1;
      if (value.length != segment_length) {
        z_convex = false;
      }
    }

    if (z_convex) {
      for (const [key, value] of Object.entries(this.connect_z)) {
        let x = value[4];
        let y = value[5];

        var min_x = value[0];
        var max_x = value[1];
        var min_y = value[2];
        var max_y = value[3];

        var segment_length = max_x - min_x + 1;
        if (x.size != segment_length) {
          z_convex = false;
        }

        segment_length = max_y - min_y + 1;
        if (y.size != segment_length) {
          z_convex = false;
        }
      }
    }

    if (!x_convex && !y_convex && !z_convex) {
      console.log("No convex layer"); // abort
      return false;
    } else if (!x_convex && !y_convex) {
      console.log("use z axis");
      this.polycube.translate_axis(2);
    } else if (!y_convex && !z_convex) {
      console.log("use x axis");
      this.polycube.translate_axis(1);
    } else if (!x_convex && !z_convex) {
      console.log("use y axis");
    } else if (x_convex && y_convex && z_convex) {
      if (x_max - x_min < y_max - y_min && x_max - x_min < z_max - z_min) {
        console.log("use X axis"); // translate to the right once
        this.polycube.translate_axis(1);
      } else if (y_max - y_min <= z_max - z_min) {
        console.log("use Y axis"); // keep graph that way
      } else {
        console.log("use Z axis"); // translate to the right twice
        this.polycube.translate_axis(2);
      }
    } else if (!x_convex) {
      if (y_max - y_min < z_max - z_min) {
        console.log("use y axis");
      } else {
        console.log("use z axis");
        this.polycube.translate_axis(2);
      }
    } else if (!y_convex) {
      if (x_max - x_min < z_max - z_min) {
        console.log("use x axis");
        this.polycube.translate_axis(1);
      } else {
        console.log("use z axis"); // keep graph that way
        this.polycube.translate_axis(2);
      }
    } else if (!z_convex) {
      if (x_max - x_min < y_max - y_min) {
        console.log("use x axis");
        this.polycube.translate_axis(1);
      } else {
        console.log("use y axis");
      }
    }
    return true;
  }
}

function horizontalMatrix(topfaces) {
  var matrix = [];
  for (let i = 0; i < topfaces.length; i++) {
    matrix.push([1]);
  }
  return matrix;
}
function transpose_Matrix(Matrix) {
  var newMatrix = [];

  for (let i = 0; i < Matrix[0].length; i++) {
    var line = [];
    for (let j = 0; j < Matrix.length; j++) {
      line.push(0);
    }
    newMatrix.push(line);
  }
  for (let i = 0; i < Matrix[0].length; i++) {
    for (let j = 0; j < Matrix.length; j++) {
      newMatrix[i][j] = Matrix[j][i];
    }
  }

  return newMatrix;
}
function transformBridgeToMatrix(layer, Li) {
  var bridge = layer.bridge;
  var face = layer.R;
  if (bridge.length == 0) {
    return [[[]], [1, -1], [1, -1]];
  }
  var minx = 100000000;
  var minz = 100000000;
  var maxx = -1000000000;
  var maxz = -1000000000;

  for (let i = 0; i < bridge.length; i++) {
    minx = Math.min(bridge[i][0].cube.position.x, minx);
    minz = Math.min(bridge[i][0].cube.position.z, minz);
    maxx = Math.max(bridge[i][0].cube.position.x, maxx);
    maxz = Math.max(bridge[i][0].cube.position.z, maxz);
  }
  var Matrix = [];
  var startPoint = [0, 0];
  var endpoint = [1, 1];

  for (let i = 0; i <= maxz - minz; i++) {
    var line = [];
    for (let j = 0; j <= maxx - minx; j++) {
      line.push(0);
    }
    Matrix.push(line);
  }
  if (face[1] == 2 || face[1] == 3) {
    Matrix = transpose_Matrix(Matrix);
  }
  for (let i = 0; i < bridge.length; i++) {
    if (!layer.clockwise) {
      if (bridge[i][1] == 1) {
        Matrix[maxz - minz - (bridge[i][0].cube.position.z - minz)][
          maxx - minx - (bridge[i][0].cube.position.x - minx)
        ] = 1;
        if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
          startPoint = [
            bridge[i][0].cube.position.x - minx,
            bridge[i][0].cube.position.z - minz,
          ];
        }
        if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
          endpoint = [
            bridge[i][0].cube.position.x - 1,
            maxz - (bridge[i][0].cube.position.z - minz) - minz,
          ];
        }
        continue;
      }
      if (face[1] == 2 || face[1] == 3) {
        Matrix[maxx - minx - (bridge[i][0].cube.position.x - minx)][
          maxz - minz - (bridge[i][0].cube.position.z - minz)
        ] = 1;

        if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
          console.log(bridge[i][0].cube.position.x - minx);
          if (Li[1] == face[1]) {
            startPoint = [
              bridge[i][0].cube.position.x - minx,
              maxz - minz - (bridge[i][0].cube.position.z - minz),
            ];
            console.log(startPoint);
            continue;
          }
          startPoint = [
            maxx - minx - (bridge[i][0].cube.position.x - minx),
            maxz - minz - (bridge[i][0].cube.position.z - minz),
          ];
        }
        if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
          if (Li[1] == face[1]) {
            console.log(bridge[i][0].cube.position.x - minx);
            endpoint = [
              bridge[i][0].cube.position.x - minx + 1,
              maxz - minz - (bridge[i][0].cube.position.z - minz),
            ];
            continue;
          }
          endpoint = [
            maxx - minx - (bridge[i][0].cube.position.x - minx) - 1,
            maxz - minz - (bridge[i][0].cube.position.z - minz),
          ];
        }
        continue;
      }
      Matrix[maxz - minz - (bridge[i][0].cube.position.z - minz)][
        maxx - minx - (bridge[i][0].cube.position.x - minx)
      ] = 1;
      if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
        startPoint = [
          maxz - minz - (bridge[i][0].cube.position.z - minz),
          maxx - minx - (bridge[i][0].cube.position.x - minx),
        ];
      }
      if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
        endpoint = [
          maxz - minz - (bridge[i][0].cube.position.z - minz) + 1,
          maxx - minx - (bridge[i][0].cube.position.x - minx),
        ];
      }
    } else {
      if (bridge[i][1] == 1) {
        Matrix[maxx - minx - (bridge[i][0].cube.position.x - minx)][
          maxz - minz - (bridge[i][0].cube.position.z - minz)
        ] = 1;
        if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
          startPoint = [
            bridge[i][0].cube.position.x - minx,
            bridge[i][0].cube.position.z - minz,
          ];
        }
        if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
          endpoint = [
            bridge[i][0].cube.position.x - 1,
            maxz - (bridge[i][0].cube.position.z - minz) - minz,
          ];
        }
        continue;
      }
      if (face[1] == 2 || face[1] == 3) {
        Matrix[maxx - minx - (bridge[i][0].cube.position.x - minx)][
          maxz - minz - (bridge[i][0].cube.position.z - minz)
        ] = 1;

        if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
          startPoint = [
            maxx - minx - (bridge[i][0].cube.position.x - minx) + 2,
            maxz - minz - (bridge[i][0].cube.position.z - minz),
          ];
        }
        if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
          endpoint = [
            maxx - minx - (bridge[i][0].cube.position.x - minx) + 1,
            maxz - minz - (bridge[i][0].cube.position.z - minz),
          ];
        }
        continue;
      }

      Matrix[maxx - minx - (bridge[i][0].cube.position.x - minx)][
        maxz - minz - (bridge[i][0].cube.position.z - minz)
      ] = 1;
      if (faceEqual(bridge[i], face[0].northFace(face[1]))) {
        startPoint = [
          maxx - minx - (bridge[i][0].cube.position.x - minx) + 2,
          maxz - minz - (bridge[i][0].cube.position.z - minz),
        ];
      }
      if (faceEqual(bridge[i], Li[0].southFace(Li[1]))) {
        endpoint = [
          maxx - minx - (bridge[i][0].cube.position.x - minx) + 1,
          maxz - minz - (bridge[i][0].cube.position.z - minz),
        ];
      }
    }
  }
  console.log([Matrix, startPoint, endpoint]);
  return [Matrix, startPoint, endpoint];
}

function creatingUnfold() {
  var unfolds = [];

  for (let i = 0; i < polycube.layers.length; i++) {
    polycube.layers[i].computeBand();
  }
  var newx = 1;
  var newy = 1;
  for (let i = 0; i < polycube.layers.length; i++) {
    var matrix = [];

    polycube.layers[i].R[0].cube.geometry.groups[
      FACE_TRAD[polycube.layers[i].R[1]]
    ].materialIndex = 1;

    polycube.layers[i].L[0].cube.geometry.groups[
      FACE_TRAD[polycube.layers[i].L[1]]
    ].materialIndex = 2;

    var unfold = new Unfolded(newx, newy + 1);
    unfold.createUnfoldFromMatrix(
      horizontalMatrix(
        polycube.layers[i].findTopFace(
          polycube.layers[i].L,
          polycube.layers[Number(i) + 1]
        )
      )
    );

    unfolds.push(unfold);
    var line = [];
    line.push(1);

    for (let j = 0; j < polycube.layers[i].band.length; j++) {
      polycube.layers[i].band[j][0].cube.geometry.groups[
        FACE_TRAD[polycube.layers[i].band[j][1]]
      ].materialIndex = 3;
      line.push(1);

      var unfold = new Unfolded(newx + 1 + j, newy + 1);

      unfold.createUnfoldFromMatrix(
        horizontalMatrix(
          polycube.layers[i].findTopFace(
            polycube.layers[i].band[j],
            polycube.layers[Number(i) + 1]
          )
        )
      );
      unfolds.push(unfold);

      var lowerFaces = polycube.layers[i].findLowerFaces(
        polycube.layers[i].band[j]
      );
      if (!polycube.layers[i].clockwise) {
        var unfold = new Unfolded(newx + 1 + j, newy - lowerFaces.length);
      } else {
        var unfold = new Unfolded(newx + 1 + j, newy + 1);
      }
      unfold.createUnfoldFromMatrix(horizontalMatrix(lowerFaces));
      unfolds.push(unfold);
    }

    line.push(1);
    matrix.push(line);

    color = "green";
    var unfold = new Unfolded(newx, newy);
    unfold.createUnfoldFromMatrix(matrix);

    unfolds.push(unfold);
    color = "blue";
    newx += polycube.layers[i].band.length + 1;
    newy += 1;
    for (let j = 0; j < polycube.layers[i].bridge.length; j++) {
      polycube.layers[i].bridge[j][0].cube.geometry.groups[
        FACE_TRAD[polycube.layers[i].bridge[j][1]]
      ].materialIndex = 4;
    }
    var nextLi = null;
    if (i < polycube.layers.length - 1) {
      nextLi = polycube.layers[Number(i) + 1].L;
    }

    var bridgeMatrix = transformBridgeToMatrix(polycube.layers[i], nextLi)[0];
    newx -= transformBridgeToMatrix(polycube.layers[i], nextLi)[1][1];
    newy -= transformBridgeToMatrix(polycube.layers[i], nextLi)[1][0];

    color = "orange";
    var unfold2 = new Unfolded(newx, newy);
    unfold2.createUnfoldFromMatrix(bridgeMatrix);
    unfolds.push(unfold2);
    color = "blue";
    newy += transformBridgeToMatrix(polycube.layers[i], nextLi)[2][0];
    newx += transformBridgeToMatrix(polycube.layers[i], nextLi)[2][1];
    // Concatenate bridgematrix and band matrix
  }
  return unfolds;
}
var unfolds = [];

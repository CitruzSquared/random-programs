function setup() {
  createCanvas(windowWidth, windowHeight);
  screenZ = 700;
  minZ = 200;
  speed = 15;
  array = [];
  numCuboids = 100;
  for (let i = 0; i < numCuboids; i++) {    
    array.push(createCuboid());
  }
}

function draw() {
  background(0);
  translate(width/2, height/2);
  
  for (let i = 0; i < array.length; i++) {
    array[i].move(speed);
    array[i].show();
    
    if(array[i].center[2] < minZ) {
      array[i] = createCuboid();
    }
  }
}

class cuboid {
  constructor (c, d, r) {
    this.center = c;
    this.dimensions = d;
    this.rotations = r;
    this.projPoints = [];
    
    this.points = [];
    this.points.push([-d[0]/2, -d[1]/2, -d[2]/2]); //0
    this.points.push([d[0]/2, -d[1]/2, -d[2]/2]); //1
    this.points.push([-d[0]/2, d[1]/2, -d[2]/2]); //2
    this.points.push([-d[0]/2, -d[1]/2, d[2]/2]); //3
    
    this.points.push([-d[0]/2, d[1]/2, d[2]/2]); //4
    this.points.push([d[0]/2, -d[1]/2, d[2]/2]); //5
    this.points.push([d[0]/2, d[1]/2, -d[2]/2]); //6
    this.points.push([d[0]/2, d[1]/2, d[2]/2]); //7
    
    for (let i = 0; i < this.rotations.length; i++) {
      let rotMatrix = [];
      let cosA = cos(this.rotations[i]);
      let sinA = sin(this.rotations[i]);
      switch(i) {
        case 0: //x
          rotMatrix = [
            [1, 0, 0],
            [0, cosA, -sinA],
            [0, sinA, cosA]
          ];
          break;
        case 1: //y
          rotMatrix = [
            [cosA, 0, sinA],
            [0, 1, 0],
            [-sinA, 0, cosA]
          ];
          break;
        case 2: //z
          rotMatrix = [
            [cosA, -sinA, 0],
            [sinA, cosA, 0],
            [0, 0, 1]
          ];
          break;
      }
      for (let i = 0; i < this.points.length; i++) {
        this.points[i] = matrixMultiply(rotMatrix, this.points[i]);
      }
    }  
  }
  
  move(z) {
    for (let i = 0; i < this.points.length; i++) {
      this.center[2] -= z;
    }
  }
  
  rotate(a) {
    for (let i = 0; i < this.a.length; i++) {
      let rotMatrix = [];
      let cosA = cos(a[i]);
      let sinA = sin(a[i]);
      switch(i) {
        case 0: //x
          rotMatrix = [
            [1, 0, 0],
            [0, cosA, -sinA],
            [0, sinA, cosA]
          ];
          break;
        case 1: //y
          rotMatrix = [
            [cosA, 0, sinA],
            [0, 1, 0],
            [-sinA, 0, cosA]
          ];
          break;
        case 2: //z
          rotMatrix = [
            [cosA, -sinA, 0],
            [sinA, cosA, 0],
            [0, 0, 1]
          ];
          break;
      }
      for (let i = 0; i < this.points.length; i++) {
        this.points[i] = matrixMultiply(rotMatrix, this.points[i]);
      }
    }
  }
  
  show() {
    this.projPoints = [];
    if (this.center[2] > minZ) {
      for (let i = 0; i < this.points.length; i++) {
        let factor = screenZ / (this.points[i][2] + this.center[2]);
        let projX = (this.points[i][0] + this.center[0]) * factor;
        let projY = (this.points[i][1] + this.center[1]) * factor;
        stroke(255);
        strokeWeight(4 * factor);
        //point(projX, projY);
        this.projPoints.push([projX, projY]);
      }
    
      this.drawLine(0, 1);
      this.drawLine(0, 2);
      this.drawLine(0, 3);
    
      this.drawLine(1, 5);
      this.drawLine(1, 6);
    
      this.drawLine(2, 4);
      this.drawLine(2, 6);
    
      this.drawLine(3, 4);
      this.drawLine(3, 5);
    
      this.drawLine(4, 7);
      this.drawLine(5, 7);
      this.drawLine(6, 7);
    }
  }
  
  drawLine (a, b) {
    let avgZ = (this.points[a][2] + this.points[b][2]) / 2 + this.center[2];
    let factor = screenZ / avgZ;
    strokeWeight(2 * factor);
    //strokeWeight(2);
    line(this.projPoints[a][0], this.projPoints[a][1], this.projPoints[b][0], this.projPoints[b][1]);
  }
}

function matrixMultiply (M, v) {
  result = [];
  for (let i = 0; i < M.length; i++) {
    row = M[i];
    sum = 0
    for (let j = 0; j < row.length; j++) {
      sum += row[j] * v[j];
    }
    result.push(sum);
  }
  return result;
}

function createCuboid() {
  let rad = random(250, 5000);
  let theta = random(0, 2 * PI);
  let x = rad * cos(theta);
  let y = rad * sin(theta);
  let z = random(6000, 20000);
    
  let c = [x, y, z];
    
  let dx = random(100, 300);
  let dy = random(100, 300);
  let dz = random(100, 300);
    
  let d = [dx, dy, dz];
    
  let rx = random(0, 2 * PI);
  let ry = random(0, 2 * PI);
  let rz = random(0, 2 * PI);
    
  let r = [rx, ry, rz];
  
  return new cuboid(c, d, r);
}

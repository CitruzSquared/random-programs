function setup() {
  createCanvas(windowWidth, windowHeight);
  screenZ = 700;
  centerZ = 2500;
  t = new tesseract([-500, -500, -500, -500], [500, 500, 500, 500])
  t.multipleRotate([1, 5, 4], PI/3);
}

function draw() {
  background(0);
  translate(width/2, height/2);
  t.show();
  t.multipleRotateMultipleAngles([1, 2, 5], [0.01, 0.005, 0.01]);
}

class tesseract {
  constructor (v, u) {
    this.points = [];
    this.projectedPoints = [];
    let dx = u[0] - v[0];
    let dy = u[1] - v[1];
    let dz = u[2] - v[2];
    let dw = u[3] - v[3];
    
    // 16 vertices
    this.points.push([v[0], v[1], v[2], v[3]]); //0
    this.points.push([v[0] + dx, v[1], v[2], v[3]]); //1
    this.points.push([v[0], v[1] + dy, v[2], v[3]]); //2
    this.points.push([v[0], v[1], v[2] + dz, v[3]]); //3
    this.points.push([v[0], v[1], v[2], v[3] + dw]); //4
    this.points.push([v[0] + dx, v[1] + dy, v[2], v[3]]); //5
    this.points.push([v[0] + dx, v[1], v[2] + dz, v[3]]); //6
    this.points.push([v[0] + dx, v[1], v[2], v[3] + dw]); //7
    this.points.push([v[0], v[1] + dy, v[2] + dz, v[3]]); //8
    this.points.push([v[0], v[1] + dy, v[2], v[3] + dw]); //9
    this.points.push([v[0], v[1], v[2] + dz, v[3] + dw]); //10
    this.points.push([v[0] + dx, v[1] + dy, v[2] + dz, v[3]]); //11
    this.points.push([v[0] + dx, v[1] + dy, v[2], v[3] + dw]); //12
    this.points.push([v[0] + dx, v[1], v[2] + dz, v[3] + dw]); //13
    this.points.push([v[0], v[1] + dy, v[2] + dz, v[3] + dw]); //14
    this.points.push([v[0] + dx, v[1] + dy, v[2] + dz, v[3] + dw]); //15
  }
  
  show() {
    stroke(255);
    this.projectedPoints = [];
    for (let i = 0; i < this.points.length; i++) {
      // orthogonally project onto XYZ; simply ignore w component
      // then perspective project onto XY
      let proportionFactor = screenZ / (this.points[i][2] + centerZ);
      let projX = this.points[i][0] * proportionFactor;
      let projY = this.points[i][1] * proportionFactor;
      strokeWeight(7 * proportionFactor);
      point(projX, projY)
      this.projectedPoints.push([projX, projY]);
    }
    
    // 32 edges
    this.drawLine(0, 1); //0
    this.drawLine(0, 2); //1
    this.drawLine(0, 3); //2
    this.drawLine(0, 4); //3
    
    this.drawLine(1, 5); //4
    this.drawLine(1, 6); //5
    this.drawLine(1, 7); //6
    
    this.drawLine(2, 5); //7
    this.drawLine(2, 8); //8
    this.drawLine(2, 9); //9
    
    this.drawLine(3, 6); //10
    this.drawLine(3, 8); //11
    this.drawLine(3, 10); //12
    
    this.drawLine(4, 7); //13
    this.drawLine(4, 9); //14
    this.drawLine(4, 10); //15
    
    this.drawLine(5, 11); //16
    this.drawLine(5, 12); //17
    
    this.drawLine(6, 11); //18
    this.drawLine(6, 13); //19
    
    this.drawLine(7, 12); //20
    this.drawLine(7, 13); //21
    
    this.drawLine(8, 11); //22
    this.drawLine(8, 14); //23
    
    this.drawLine(9, 12); //24
    this.drawLine(9, 14); //25
    
    this.drawLine(10, 13); //26
    this.drawLine(10, 14); //27

    this.drawLine(11, 15); //28
    this.drawLine(12, 15); //29
    this.drawLine(13, 15); //30
    this.drawLine(14, 15); //31
  }
  
  drawLine (a, b) {
    let avgZ = 0.5 * (this.points[a][2] + this.points[b][2]);
    let proportionFactor = screenZ / (avgZ + centerZ);
    strokeWeight(3 * proportionFactor);
    line(this.projectedPoints[a][0], this.projectedPoints[a][1], this.projectedPoints[b][0], this.projectedPoints[b][1]);
  }
  
  singleRotate(mode, angle) {
    let sinA = sin(angle);
    let cosA = cos(angle);
    let rotationMatrix = [];
    switch(mode) {
      case 1: //zw rotation
        rotationMatrix = [
          [cosA, -sinA, 0, 0], 
          [sinA, cosA, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]];
        break;
      case 2: //yw rotation
        rotationMatrix = [
          [cosA, 0, -sinA, 0], 
          [0, 1, 0, 0],
          [sinA, 0, cosA, 0],
          [0, 0, 0, 1]];
        break;
      case 3: //yz rotation
        rotationMatrix = [
          [cosA, 0, 0, -sinA], 
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [sinA, 0, 0, cosA]];
        break;
      case 4: //xw rotation
        rotationMatrix = [
          [1, 0, 0, 0], 
          [0, cosA, -sinA, 0],
          [0, sinA, cosA, 0],
          [0, 0, 0, 1]];
        break;
      case 5: //xz rotation
        rotationMatrix = [
          [1, 0, 0, 0], 
          [0, cosA, 0, -sinA],
          [0, 0, 1, 0],
          [0, sinA, 0, cosA]];
        break;
      case 6: //xy rotation
        rotationMatrix = [
          [1, 0, 0, 0], 
          [0, 1, 0, 0],
          [0, 0, cosA, -sinA],
          [0, 0, sinA, cosA]];
        break;
    }
    
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = matrixMultiply(rotationMatrix, this.points[i]);
    }
  }
  
  multipleRotate(modes, angle) {
    for (let i = 0; i < modes.length; i++) {
      this.singleRotate(modes[i], angle);
    }
  }
  
  multipleRotateMultipleAngles(modes, angle) {
    for (let i = 0; i < modes.length; i++) {
      this.singleRotate(modes[i], angle[i]);
    }
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  centerZ = 1100;
  screenZ = 750;
  
  s = new randSphere(250, 500);
}

function draw() {
  background(0);
  translate(width/2, height/2);
  s.update();
  //s.rotation(1, 0.02);
  //s.rotation(2, 0.02);
  s.show();
}

class randSphere {
  constructor (r, n) {
    this.radius = r;
    this.points = [];
    this.perifocals = [];
    this.orbits = [];

    for (let i = 0; i < n; i++) {
      let inc = random(-PI/2, PI/2);
      let AOP = random(0, 2 * PI);
      let LAN = random(0, 2 * PI);
      
      let pf_to_eq = [
        [cos(LAN) * cos(AOP) - sin(LAN) * cos(inc) * sin(AOP),
         -cos(LAN) * sin(AOP) - sin(LAN) * cos(inc) * cos(AOP),
         sin(LAN) * sin(inc)
        ],
        [sin(LAN) * cos(AOP) + cos(LAN) * cos(inc) * sin(AOP),
         -sin(LAN) * sin(AOP) + cos(LAN) * cos(inc) * cos(AOP),
         -cos(LAN) * sin(inc)
        ],
        [sin(inc) * sin(AOP),
         sin(inc) * cos(AOP),
         cos(inc)
        ]
      ];
      let eq_to_pf = [
        [cos(LAN) * cos(AOP) - sin(LAN) * cos(inc) * sin(AOP),
         sin(LAN) * cos(AOP) + cos(LAN) * cos(inc) * sin(AOP),
         sin(inc) * sin(AOP)
        ],
        [-cos(LAN) * sin(AOP) - sin(LAN) * cos(inc) * cos(AOP),
         -sin(LAN) * sin(AOP) + cos(LAN) * cos(inc) * cos(AOP),
         sin(inc) * cos(AOP)
        ],
        [sin(LAN) * sin(inc),
         -cos(LAN) * sin(inc),
         cos(inc)
        ]
      ];
      let motion = random(-0.01, 0.01);
      
      this.orbits.push([pf_to_eq, eq_to_pf, motion]);
      
      let initialAnomaly = random(0, 2 * PI);
      let initialPfCoords = [this.radius * cos(initialAnomaly), this.radius * sin(initialAnomaly), 0];
      
      this.perifocals.push(initialPfCoords);
      this.points.push(matrixMultiply(pf_to_eq, initialPfCoords));
    }
  }
  
  update() {
    for (let i = 0; i < this.points.length; i++) {
      let anomaly = atan2(this.perifocals[i][1], this.perifocals[i][0]);
      anomaly += this.orbits[i][2];
      let PfCoords = [this.radius * cos(anomaly), this.radius * sin(anomaly), 0];
      this.perifocals[i] = PfCoords;
      this.points[i] = matrixMultiply(this.orbits[i][0], PfCoords);
    }
  }
  
  rotation(mode, angle) {
    let rotMatrix = [];
    let cosA = cos(angle);
    let sinA = sin(angle);
    switch(mode) {
      case 1: //x
        rotMatrix = [
          [1, 0, 0],
          [0, cosA, -sinA],
          [0, sinA, cosA]
        ];
        break;
      case 2: //y
        rotMatrix = [
          [cosA, 0, sinA],
          [0, 1, 0],
          [-sinA, 0, cosA]
        ];
        break;
      case 3: //z
        rotMatrix = [
          [cosA, -sinA, 0],
          [sinA, cosA, 0],
          [0, 0, 1]
        ];
        break;
    }
    
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = matrixMultiply(rotMatrix, this.points[i]);
      this.perifocals[i] = matrixMultiply(this.orbits[i][1], this.points[i]);
    }
  }
  
  show() {
    let projPoints = []
    let maxdist = 70;
    stroke(255);
    
    for (let i = 0; i < this.points.length; i++) {
      let factor = screenZ / (this.points[i][2] + centerZ);
      let projX = this.points[i][0] * factor;
      let projY = this.points[i][1] * factor;
      projPoints.push([projX, projY]);
    }
    
    let nearPoints;
    for (let i = 0; i < this.points.length; i++) {
      nearPoints = [];
      for (let j = 0; j < this.points.length; j++) {
        if (i != j) {
          let dx = this.points[i][0] - this.points[j][0];
          let dy = this.points[i][1] - this.points[j][1];
          let dz = this.points[i][2] - this.points[j][2];
          let distance = sqrt(dx * dx + dy * dy + dz * dz);
          if (distance < maxdist) {
            nearPoints.push(j);
          }
        }
      }
      strokeWeight(1);
      if (nearPoints.length > 0) {
        for (let j = 0; j < nearPoints.length; j++) {
          let avgZ = 0.5 * (this.points[i][2] + this.points[nearPoints[j]][2]);
          let b = map(this.points[i][2], -this.radius, this.radius, 0, 0.25);
          stroke(0, 0, 100, 0.25 - b);
          if(100 - b > 10) {
            line(projPoints[i][0], projPoints[i][1], projPoints[nearPoints[j]][0], projPoints[nearPoints[j]][1]);
          }
        }
      }
    }
    
    for (let i = 0; i < projPoints.length; i++) {
      let factor = screenZ / (this.points[i][2] + centerZ);
      strokeWeight(4 * factor);
      
      let b = map(this.points[i][2], -this.radius, this.radius, 0, 100);
      stroke(100 - b);
      point(projPoints[i][0], projPoints[i][1]);
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

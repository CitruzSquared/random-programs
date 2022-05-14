void setup() {
  size(1280, 720);
}

int res = 20;
PVector g = new PVector(0, 20);
float deltaTime = 0.00001;
Ball b = new Ball(new PVector(800, 400), new PVector(0, 0), 100, 10E8, 10000, 1);
float floor = 650;
float lwall = 80;
float rwall = 1200;
float ceil = 70;
float friction = 0.3;
boolean text = false;

void draw() {
  background(255);
  fill(150);
  noStroke();
  rect(0, floor, 1280, 720);
  rect(0, 0, 1280, ceil);
  rect(0, 0, lwall, 720);
  rect(rwall, 0, rwall, 720);
  b.show();
  for(int t = 0; t < 1000; t++) {
    b.update();
  }
}

class Ball{
  float radius;
  float basicvolume;
  float nRT;
  float k;
  PVector[] position = new PVector[res];
  PVector[] velocity = new PVector[res];
  PVector[] acceleration = new PVector[res];
  PVector center;
  float naturalLength;
  float mass;
  
  public Ball (PVector p, PVector v, float r, float n, float k, float m) {
    radius = r;
    nRT = n;
    center = p;
    float theta = 2 * PI/res;
    for(int i = 0; i < res; i++) {
      position[i] = new PVector(p.x + radius * cos(theta * i), p.y + radius * sin(theta * i));
      velocity[i] = v;
    }
    this.k = k;
    naturalLength = position[0].copy().sub(position[1].copy()).mag();
    mass = m/res;
    basicvolume = calculateVolume();
  }
  
  void show() {
    fill(0);
    stroke(0);
    for(int i = 0; i < res; i++) {
      strokeWeight(4);
      point(position[i].x, position[i].y);
      textSize(10);
      if(text) {
        text(i, position[i].x + 10, position[i].y + 10);
      }
      strokeWeight(1);
      if(i != res - 1) {
        line(position[i].x, position[i].y, position[i + 1].x, position[i + 1].y);
      }
      else {
        line(position[i].x, position[i].y, position[0].x, position[0].y);
      }
    }
  }
  
  void update() {
    float volume = calculateVolume();
    for(int i = 0; i < res; i++) { 
      acceleration[i] = (g.copy().mult(mass).add(calculateForce(i, volume))).div(mass);
    }
    for(int i = 0; i < res; i++) { 
      velocity[i] = velocity[i].copy().add(acceleration[i].copy().mult(deltaTime));
    }
    float sumx = 0;
    float sumy = 0;
    for(int i = 0; i < res; i++) { 
      position[i] = position[i].copy().add(velocity[i].copy().mult(deltaTime));
      if (position[i].y >= floor) {
        velocity[i].y += -1;
        velocity[i].x *= (1 - friction);
        acceleration[i].y = 0;
      }
      if (position[i].x >= rwall) {
        velocity[i].x += -1;
        velocity[i].y *= (1 - friction);
        acceleration[i].x = 0;
      }
      if (position[i].x <= lwall) {
        velocity[i].x += 1;
        velocity[i].y *= (1 - friction);
        acceleration[i].x = 0;
      }
      if (position[i].y <= ceil) {
        velocity[i].y += 1;
        velocity[i].x *= (1 - friction);
        acceleration[i].y = 0;
      }
      sumx += position[i].x;
      sumy += position[i].y;
    }
    center = new PVector(sumx/res, sumy/res);
  }
  
  PVector calculateForce(int i, float v) {
    PVector f1 = new PVector();
    PVector f2 = new PVector();
    PVector f1air = new PVector();
    PVector fatmair = new PVector();
    PVector fair = new PVector();
    PVector fs = new PVector();
    PVector f = new PVector();
    int j;
    int l;
    if(i != 0 && i != res - 1) {
      j = i + 1;
      l = i - 1;
    }
    else if (i == 0) {
      j = i + 1;
      l = res - 1;
    }
    else {
      j = 0;
      l = i - 1;
    }
    PVector d1 = position[j].copy().sub(position[i].copy());
    PVector d2 = position[l].copy().sub(position[i].copy());
    PVector normal = position[i].copy().sub(center.copy());
    float dist1 = d1.mag();
    float dist2 = d2.mag();
    float length1 = dist1 - naturalLength;
    float length2 = dist2 - naturalLength;
    f1 = d1.copy().normalize().mult(length1).mult(k);
    f2 = d2.copy().normalize().mult(length2).mult(k);
    f1air = normal.copy().normalize().mult(nRT * (dist1 + dist2)/2 / v);
    fatmair = normal.copy().normalize().mult(-10E8 * (dist1 + dist2)/2 / basicvolume);
    fair = f1air.copy().add(fatmair.copy());
    fs = f1.copy().add(f2.copy());
    f = fair.copy().add(fs.copy());
    return f;
  }
  
  float calculateVolume() {
    PVector[] posit = new PVector[res + 1];
    for(int i = 0; i < res; i++) {
      posit[i] = position[i];
    }
    posit[res] = position[0];
    float sumx = 0;
    float sumy = 0;
    for(int i = 0; i < res; i++) {
      sumx += posit[i].x * posit[i + 1].y;
    }
    for(int i = 0; i < res; i++) {
      sumy += posit[i].y * posit[i + 1].x;
    }
    return (sumx - sumy)/200;
  }
}

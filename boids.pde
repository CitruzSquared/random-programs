void setup() {
  size(1280, 720);
  generate();
}

public int canvasx = 1280;
public int canvasy = 720;

public int numberOfObjects = 200;
public organism[] arr = new organism[numberOfObjects];
public ArrayList<organism> near = new ArrayList<organism>();
public float minDistance = 50;
public float senseDistance = 120;
public float force = 0.2;
public float vel = 5;

void draw() {
  background(35);
  for(int i = 0; i < numberOfObjects; i++) {
    PVector temp = new PVector(1, -1 * arr[i].velocity.x / arr[i].velocity.y);
    temp.normalize().mult(4);
    stroke(color(arr[i].hue, arr[i].sat, arr[i].val));
    fill(color(arr[i].hue, arr[i].sat, arr[i].val));
    //line(arr[i].position.x, arr[i].position.y, arr[i].position.x + 5 * arr[i].velocity.x, arr[i].position.y + 5 * arr[i].velocity.y);
    triangle(arr[i].position.x + temp.x, arr[i].position.y + temp.y, arr[i].position.x - temp.x, arr[i].position.y - temp.y, arr[i].position.x + 10 * arr[i].velocity.copy().normalize().x, arr[i].position.y + 10 * arr[i].velocity.copy().normalize().y);
    for(organism k : arr) {
      PVector distance = new PVector(k.position.x - arr[i].position.x, k.position.y - arr[i].position.y);
      if(distance.mag() < minDistance && k != arr[i]) {
        near.add(k);
      }
    }
    
    arr[i].update();
    arr[i].acceleration.add(arr[i].separation().mult(1));
    arr[i].acceleration.add(arr[i].alignment().mult(1));
    arr[i].acceleration.add(arr[i].cohesion().mult(1));
    
    near.clear();
    
    arr[i].hue++;
  }
}

class organism {
  boolean blocked = false;
  boolean isNear = false;
  PVector position = new PVector();
  PVector velocity = new PVector();
  PVector acceleration = new PVector();
  int hue;
  int sat;
  int val;
  
  organism(PVector p, PVector v, int H, int S, int V) {
    position = p;
    velocity = v;
    acceleration = new PVector(0, 0);
    hue = H;
    sat = S;
    val = V;
  }
  
  void update() {
    if(position.x < 0) {
      position.x = canvasx;
    }
    else if (position.x > canvasx) {
      position.x = 0;
    }
    if(position.y < 0) {
      position.y = canvasy;
    }
    else if (position.y > canvasy) {
      position.y = 0;
    }
    position.add(this.velocity.copy());
    velocity.add(this.acceleration.copy());
    acceleration = new PVector(0, 0);
    
    if(hue > 360) {
      hue = 0;
    }
  }
  
  PVector separation() {
    PVector avg = new PVector();
    int count = 0;
    for(organism i : near) {
      PVector distance = new PVector(i.position.x - this.position.x, i.position.y - this.position.y);
      if(distance.mag() < minDistance) {
        avg.add(distance.mult(-1).div(distance.mag()));
        count++;
      }
    }
    if(count > 0) {
      avg.setMag(vel);
      avg.sub(this.velocity);
      avg.limit(force);
    }
    return avg;
  }
  
  PVector alignment() {
    PVector avg = new PVector();
    int count = 0;
    for(organism i : near) {
        avg.add(i.velocity);
        count++;
    }
    if(count > 0) {
      avg.setMag(vel);
      avg.sub(this.velocity);
      avg.limit(force);
    }
    return avg;
  }
  
  PVector cohesion() {
    PVector avg = new PVector();
    int count = 0;
    for(organism i : near) {
        avg.add(i.position);
        count++;
    }
    if(count > 0) {
      avg.div(count);
      avg.sub(this.position);
      avg.setMag(vel);
      avg.sub(this.velocity);
      avg.limit(force);
    }
    return avg;
  }
}

void generate() {
  colorMode(HSB, 360, 100, 100);
  //color col = color(217, 50, 90);
  for(int i = 0; i < numberOfObjects; i++) {
    arr[i] = new organism(new PVector(random(0, canvasx), random(0, canvasy)), PVector.random2D().mult(vel), 217, 50, (int) random(50, 100));
  }
}

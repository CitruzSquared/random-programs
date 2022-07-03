void setup() {
  size(1280, 900);
  for (int i = 0; i < 20; i++) {
    vertices.add(new Vertex(new PVector(i * 60 + 80, 20), 1, true));
  }
  for (int j = 0; j < 9; j++) {
    for (int i = 0; i < 20; i++) {
      vertices.add(new Vertex(new PVector(i * 60 + 80, j * 60 + 80), 1, false));
    }
  }
  for (int j = 0; j < 10; j++) {
    for (int i = 0; i < 19; i++) {
      connections.add(new Connect(vertices.get(i + j * 20), vertices.get((i + j * 20) + 1)));
    }
  }
  for (int j = 0; j < 9; j++) {
    for (int i = 0; i < 20; i++) {
      connections.add(new Connect(vertices.get(i + j * 20), vertices.get((i + (j + 1) * 20))));
    }
  }
  colorMode(RGB, 255, 255, 255);
}
PVector g = new PVector(0, 1);
float deltaTime = 0.0002;
ArrayList<Vertex> vertices = new ArrayList<Vertex>();
ArrayList<Connect> connections = new ArrayList<Connect>();
float k = 0.5;
float damping = 0.03;
int a = 0;
void draw() {
  background(0);
  for(int t = 0; t < 1000; t++) {
    for(int i = 0; i < connections.size(); i++) {
      connections.get(i).update();
    }
    for(int i = 0; i < vertices.size(); i++) {
      vertices.get(i).update();
    }
  }
  for(int i = 0; i < connections.size(); i++) {
    connections.get(i).show();
  }
  for(int i = 0; i < vertices.size(); i++) {
    vertices.get(i).show();
  }
  if(a == 20) {
    connections.remove(4);
    connections.remove(23);
    connections.remove(42);
    connections.remove(61);
    connections.remove(80);
    connections.remove(99);
    connections.remove(118);
    connections.remove(137);
    connections.remove(156);
    connections.remove(175);
    connections.remove(185);
    connections.remove(205);
    connections.remove(225);
    connections.remove(245);
    connections.remove(265);
    connections.remove(285);
    connections.remove(305);
   
  }
  if(a == 80) {
    connections.remove(231);
    connections.remove(249);
    connections.remove(267);
    connections.remove(231);
    connections.remove(248);
    connections.remove(265);
  }
  
  if(a == 130) {
    connections.remove(325);
    connections.remove(345);
  }
  
  if(a == 230) {
    connections.remove(319);
  }
  if(a == 300) {
    connections.remove(338);
  }
  if(a == 500) {
    connections.remove(3);
    connections.remove(183);
  }
  a++;
}

class Vertex {
  PVector position;
  PVector velocity;
  PVector force;
  Boolean locked;
  float mass;
  color col = color(255);
  
  public Vertex(PVector p, PVector v, float m, Boolean b) {
    position = p;
    velocity = v;
    locked = b;
    mass = m;
    force = g.copy().mult(mass);
  }
  
  public Vertex(PVector p, float m, Boolean b) {
    position = p;
    velocity = new PVector(0, 0);
    locked = b;
    mass = m;
    force = g.copy().mult(mass);
  }
  
  public Vertex(PVector p, float m, Boolean b, color c) {
    position = p;
    velocity = new PVector(0, 0);
    locked = b;
    mass = m;
    force = g.copy().mult(mass);
    col = c;
  }
  void show() {
    if(!locked) {
      stroke(col);
    }
    else {
      stroke(255, 0, 0);
    }
    strokeWeight(6);
    point(position.x, position.y);
  }
  
  void  update() {
    if(!locked) {
      PVector acceleration = force.copy().div(mass);
      velocity = velocity.copy().add(acceleration.copy().mult(deltaTime));
      position = position.copy().add(velocity.copy().mult(deltaTime));
      force = g.copy().mult(mass).sub(velocity.copy().mult(damping));
    }
  }
}

class Connect {
  Vertex v;
  Vertex u;
  float l0;
  
  public Connect(Vertex v, Vertex u) {
    this.v = v;
    this.u = u;
    l0 = dist(v.position.x, v.position.y, u.position.x, u.position.y);
  }
  
  void show() {
    strokeWeight(2);
    stroke(u.col);
    line(v.position.x, v.position.y, u.position.x, u.position.y);
  }
  
  void update() {
    PVector direction = v.position.copy().sub(u.position.copy());
    float l = dist(v.position.x, v.position.y, u.position.x, u.position.y);
    float deltaL = l - l0;
    v.force = v.force.add(direction.copy().mult(-deltaL).mult(k));
    u.force = u.force.add(direction.copy().mult(deltaL).mult(k));
  }
}

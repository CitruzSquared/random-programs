function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  speed = 5;
  score = 0;
  top_score = 0;
  
  p = new player();
  
  array = [];
  
  for(let i = 0; i < 14; i++) {
    array.push(new obstacle(random(0, width)));
  }
}

function draw() {
  background(0);
  array.sort(function(a, b){return b.y - a.y});
  textSize(30);
  fill(0, 0, 100);
  textAlign(LEFT);
  text(round(score / 20), 20, 50);
  textAlign(RIGHT);
  text(round(top_score / 20), width-20, 50);
  p.update();
  p.show();
  
  for(let i = 0; i < array.length; i++) {
    array[i].update();
    array[i].show();
    
    if(array[i].y >= height + array[i].r) {
      array.push(new obstacle(random(0, width)));
      array.shift();
    }
  }
  score += speed / 5;
  speed += 5e-4;
  
  p.checkDeath();
  
  fill(0)
  rect(-100, height-300, width+200, height+300);
  
  if(!p.alive) {
    background(0, 100, 100, 0.5);
    fill(0, 0, 100);
    textAlign(LEFT);
    text(round(score / 20), 20, 50);
    textAlign(RIGHT);
    text(round(top_score / 20), width-20, 50);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
    if(score > top_score) {
      top_score = score;
    }
    noLoop();
  }
}

class player {
  constructor() {
    this.x = width/2;
    this.alive = true;
  }
  
  update() {
    if(keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    if(keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    }
    
    if(this.x < 0) {
      this.x = width;
    }
    if (this.x > width) {
      this.x = 0;
    }
  }
  
  checkDeath() { 
    for(let i = 0; i < array.length; i++) {
      if(dist(this.x - 20, height-300, array[i].x, array[i].y) < array[i].r) {
        this.alive = false;
        break;
      }
      if(dist(this.x + 20, height-300, array[i].x, array[i].y) < array[i].r) {
        this.alive = false;
        break;
      }
      if(dist(this.x, height-300 - 20 * sqrt(3), array[i].x, array[i].y) < array[i].r) {
        this.alive = false;
        break;
      }
    }
  }
  
  show() {
    fill(0, 0, 100);
    triangle(this.x - 20, height-300, this.x + 20, height-300, this.x, height-300 - 20 * sqrt(3));
  }
}

class obstacle {
  constructor(x) {
    this.x = x;
    this.y =  -random(0, height);
    this.r = random(10, 20);
  }
  
  update() {
    this.y += speed;
  }
  
  show() {
    strokeWeight(1);
    stroke(0, 0, 100);
    fill(0, 0, 0, 0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

function keyPressed() {
  if(!p.alive) {
    score = 0;
  
    p = new player();
  
    array = [];
  
    for(let i = 0; i < 14; i++) {
      array.push(new obstacle(random(0, width)));
    }
    loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  jumpPower = 25;
  speed = 7;
  groundY = height - 300;
  gravity = 1.5;
  deltaT = 0.1;
  tolerance = 0.95;
  
  p = new player();
  
  array = [width * 2];
  for (let i = 1; i < 5; i++) {
    array.push(array[i - 1] + random(speed * 35, speed * 55))
  }
  
  obstacleArray = [];
  for (let i = 0; i < array.length; i++) {
    obstacleArray.push(new obstacle(array[i]))
  }
  
  score = 0;
  top_score = 0;
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(1);
  line(0, groundY, width, groundY);
  for(let i = 0; i < 1/deltaT; i++) {
    p.update();
  }
  p.show();
  
  
  for (let i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].update();
    obstacleArray[i].show();
    
    if (obstacleArray[i].x <= -obstacleArray[i].w) {
      obstacleArray.push(new obstacle(obstacleArray[array.length - 1].x + random(280, 380)));
      obstacleArray.shift();
    }
  }
  
  fill(255);
  textSize(30);
  textAlign(LEFT);
  text(round(score / 100), 20, 50);
  textAlign(RIGHT);
  text(round(top_score / 100), width-20, 50);
  
  score += speed;
  speed += 5e-4;
  
  p.checkDeath();
  
  if(!p.alive) {
    background(0, 100, 100, 0.5);
    textAlign(LEFT);
    text(round(score / 100), 20, 50);
    textAlign(RIGHT);
    text(round(top_score / 100), width-20, 50);
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
    this.y = groundY;
    this.yvel = 0;
    this.jumping = false;
    this.alive = true;
  }
  
  jump () {
    this.y -= 1;
    this.jumping = true;
    this.yvel = -jumpPower;
  }
  
  update() {
    if(this.y < groundY) {
    this.yvel += gravity * deltaT;
    }
    
    if(this.y >= groundY) {
      this.y = groundY;
      this.yvel = 0;
    }
    
    if (this.y >= groundY - 15 && this.yvel >= 0) {
      this.jumping = false;
    }
    this.y += this.yvel * deltaT;
  }
  
  show() {
    noStroke();
    fill((score / 50) % 360, 50, 100);
    triangle(100, this.y, 150, this.y, 125, this.y - 25 * sqrt(3));
  }
  
  checkDeath() {
    for (let i = 0; i < obstacleArray.length; i++) {
      let o = obstacleArray[i];
      let minx = o.x - o.w/2 * tolerance;
      let maxx = o.x + o.w/2 * tolerance;
      let miny = groundY;
      let maxy = groundY - o.h * tolerance;
      
      if (100 >= minx && 100 <= maxx && this.y <= miny && this.y >= maxy) {
        this.alive = false;
        break;
      }
      
      if (150 >= minx && 150 <= maxx && this.y <= miny && this.y >= maxy) {
        this.alive = false;
        break;
      }
      
      if (125 >= minx && 125 <= maxx && (this.y - 25 * sqrt(3)) <= miny && (this.y - 25 * sqrt(3)) >= maxy) {
        this.alive = false;
        break;
      }
    }
  }
}

class obstacle {
  constructor(x) {
    this.x = x;
    this.w = random(30, 100);
    this.h = 5000 / this.w;
  }
  
  update() {
    this.x -= speed;
  }
  
  show() {
    strokeWeight(1);
    stroke(255);
    fill(0, 0, 0, 0);
    rect(this.x - this.w/2, groundY - this.h, this.w, this.h);
  }
}

function keyPressed() {
  if(!p.alive) {
    p = new player();
  
    array = [width * 2];
    for (let i = 1; i < 5; i++) {
      array.push(array[i - 1] + random(speed * 35, speed * 55))
    }

    obstacleArray = [];
    for (let i = 0; i < array.length; i++) {
      obstacleArray.push(new obstacle(array[i]))
    }

    score = 0;
    redraw();
    loop();
  }
  if(!p.jumping) {
    p.jump();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

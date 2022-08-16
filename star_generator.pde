void setup() {
  size(6000, 3000); //Resolution
  strokeWeight(2.5);
}
//**DO NOT MESS WITH**
int projectionMode = 0; //0 = Equirectangular; 1 = North Pole Azimuthal; 2 = South Pole Azimuthal
float max = 6500;
float maxBrightness = -2;
float minEyeBrightness = 6.5;
float scale = 0.5;
float frame = 0;
float zodiacThickness = 9;
int[] starCounts = new int[9];
String[] starStats = new String[10];
float brightest = 9;
int brightestIndex = 0;

//You can mess with:
int numStars = 9173;
String[] starList = new String[numStars]; //Don't mess with
float standardSize = 45; // Size of magnitude 0 star
float S = 24.7 * PI / 180; // Axial tilt of planet
boolean generateNew = true; //set this to false if you want to load a file
float lightPollutionMagnitude = 4.5; //Will not show stars darker than this magnitude
boolean colorStars = true;
boolean drawEcliptic = true;
boolean drawZodiac = true;
boolean drawEquator = true;
boolean drawEclipticPoles = false;

void draw() {
  strokeWeight(3);
  stroke(80);
  background(0);
  if(drawEquator) {  
    noFill();
    switch(projectionMode) {
        case 0:
          line(0, (float) height/2, width, (float) height/2);
          break;
        case 1:
          ellipse((float) width/2, (float) height/2, (float) width/2, (float) height/2);
          break;
        case 2:
          ellipse((float) width/2, (float) height/2, (float) width/2, (float) height/2);
          break;
        }
    
  }
  if(drawEcliptic || drawZodiac) {
    for(int i = 0; i < max; i++) {
      float a = cos(S);
      float b = sin(S);
      float eclipticLongitude = i * 2 * PI/(max + 1);
      float c = cos(eclipticLongitude);
      float d = sin(eclipticLongitude);
      float topLatitude = zodiacThickness * PI/180;
      float bottomLatitude = -zodiacThickness * PI/180;
      float declination = asin(b * d);
      float topDefaultingLongitude = acos((2 * sqrt(cos(2 * topLatitude) + cos(2 * S)))/( sqrt(cos(2 * topLatitude - 2 * S) + cos(2 * topLatitude + 2 * S) + 2 * cos(2 * topLatitude) + 2 * cos(2 * S) + 2)));
      float topDeclination = asin(a * sin(topLatitude) + b * cos(topLatitude) * d);
      float topDefaultDeclination = asin(a * sin(topLatitude) +  + b * cos(topLatitude) * sin(topDefaultingLongitude));
      float bottomDefaultingLongitude = -acos((2 * sqrt(cos(2 * bottomLatitude) + cos(2 * S)))/( sqrt(cos(2 * bottomLatitude - 2 * S) + cos(2 * bottomLatitude + 2 * S) + 2 * cos(2 * bottomLatitude) + 2 * cos(2 * S) + 2)));
      float bottomDeclination = asin(a * sin(bottomLatitude) + b * cos(bottomLatitude) * d);
      float bottomDefaultDeclination = asin(a * sin(bottomLatitude) + b * cos(bottomLatitude) * sin(bottomDefaultingLongitude));
      float ascension;
      float topAscension;
      float bottomAscension;
      ascension = acos(c / cos(declination));
      topAscension = acos(cos(topLatitude) * c / cos(topDeclination));
      bottomAscension = acos(cos(bottomLatitude) * c / cos(bottomDeclination));
      if (declination < 0) {
        ascension += PI;
      }
      if (topDeclination < topDefaultDeclination) {
        topAscension += PI;
      }
      if (bottomDeclination < bottomDefaultDeclination) {
        bottomAscension += PI;
      }
      if (drawEcliptic) {
        point(projectX(ascension, declination), projectY(ascension, declination));
      }
      if (drawZodiac) {
        point(projectX(topAscension, topDeclination), projectY(topAscension, topDeclination));
        point(projectX(bottomAscension, bottomDeclination), projectY(bottomAscension, bottomDeclination));
      }
    }
  }
  if (drawEclipticPoles) {
    float a = cos(S);
    float b = sin(S);
    float NorthLatitude = PI/2;
    float SouthLatitude = -PI/2;
    float NorthDeclination = asin(a * sin(NorthLatitude));
    float SouthDeclination = asin(a * sin(SouthLatitude));
    float NorthAscension = acos(cos(NorthLatitude) / cos(NorthDeclination)) + PI;
    float SouthAscension = acos(cos(SouthLatitude) / cos(SouthDeclination));
    strokeWeight(15);
    point(projectX(NorthAscension, NorthDeclination), projectY(NorthAscension, NorthDeclination));
    point(projectX(SouthAscension, SouthDeclination), projectY(SouthAscension, SouthDeclination));
  }
  stroke(255);
  if (projectionMode == 1 || projectionMode == 2) {
    strokeWeight(3);
    ellipseMode(CENTER);
    ellipse((float) width/2, (float) height/2, height, height);
  }
  if (generateNew) {
    for(int i = 0; i < numStars; i++) {
      float V = brightnessGenerator();
      while (V < maxBrightness || V > minEyeBrightness) {
        V = brightnessGenerator();
      }
      starCounts[floor(V) + 2]++;
      float ascensionOfStar = random(0, 2 * PI);
      float zCoordOfStar = random(-1, 1);
      float declinationOfStar = asin(zCoordOfStar);
      Star Star = new Star(ascensionOfStar, declinationOfStar, V);
      starList[i] = Star.toString();
      Star.drawStar();
      if (V < brightest) {
        brightest = V;
        brightestIndex = i;
      }
    }
  }
  else {
    starList = loadStrings("starList.txt");
    for(int i = 0; i < numStars; i++) {
      String[] values = split(starList[i], " ");
      Star Star = new Star(radians(Float.parseFloat(values[0])), radians(Float.parseFloat(values[1])), Float.parseFloat(values[2]));
      Star.drawStar();
    }
  }
  if (generateNew) {
    saveStrings("starList.txt", starList);
    starStats[0] = "-2: " + String. valueOf(starCounts[0]);
    for(int i = 1; i < starCounts.length; i++) {
      starCounts[i] += starCounts[i - 1];
      starStats[i] = (i - 2) + ": " + String. valueOf(starCounts[i]);
    }
    starStats[9] = "Brightest star: " + starList[brightestIndex];
    saveStrings("starStats.txt", starStats);
  }
  switch(projectionMode) {
    case 0:
      saveFrame("####_Equirectangular.png");
      break;
    case 1:
      saveFrame("####_North_Pole_Azimuthal.png");
      break;
    case 2:
      saveFrame("####_South_Pole_Azimuthal.png");
      break;
  }
  frame++;
  generateNew = false;
  projectionMode++;
  if(frame == 3) {
    noLoop();
  }
  background(0);
  changeSize();
}

float projectX (float ascension, float declination) {
  switch (projectionMode) {
    case 0:
      return degrees(ascension) * (float) height / 180;
    case 1:
      float r = (float) height / 360 * (90 - degrees(declination));
      return r * cos(ascension) + (float) width/2;
    case 2:
      float R = (float) height / 360 * (90 + degrees(declination));
      return R * cos(ascension) + (float) width/2;
    default:
      return 0;
  }
}

float projectY (float ascension, float declination) {
  switch (projectionMode) {
    case 0:
      return -degrees(declination) * (float) height / 180 + (float) height/2;
    case 1:
      float r = (float) height / 360 * (90 - degrees(declination));
      return r * -sin(ascension) + (float) height/2;
    case 2:
      float R = (float) height / 360 * (90 + degrees(declination));
      return R * -sin(ascension) + (float) height/2;
    default:
      return 0;
  }
}

float brightnessGenerator() {
  float x = (float) Math.random();
  return -sqrt((log10(9172.91776321 * x) - 12.5262)/-0.00659)+ 42.5468;
}
class Star {
  float ascension;
  float declination;
  float brightness;
  Star(float a, float d, float V) {
    ascension = a;
    declination = d;
    brightness = V;
  }
  void drawStar() {
    if (colorStars) {
      colorMode(HSB, 360, 100, 100);
      switch (floor(this.brightness)) {
        case -2:
        stroke(0, 0, 100); //white
        break;
        case -1:
        stroke(0, 35, 100); //pink
        break;
        case 0:
        stroke(0, 100, 100); //red
        break;
        case 1:
        stroke(30, 100, 100); //orange
        break;
        case 2:
        stroke(60, 100, 100); //yellow
        break;
        case 3:
        stroke(120, 100, 100); //green
        break;
        case 4:
        stroke(180, 100, 100); //cyan
        break;
        case 5:
        stroke(210, 100, 100); //blue
        break;
        case 6:
        stroke(240, 100, 100); //deep blue
        break;
      }
    }
    strokeWeight(standardSize * pow(pow(pow(100, 0.2), -brightness), scale));
    if (brightness < lightPollutionMagnitude) {
      point(projectX(ascension, declination), projectY(ascension, declination));
    }
  }
  String toString() {
    return degrees(ascension) + " " + degrees(declination) + " " + brightness;
  }
}

float log10 (float n) {
  return log(n)/log(10);
}

void changeSize() {
  surface.setResizable(true);
  if (projectionMode != 0) {
    surface.setSize(width, width);
  }
  surface.setResizable(false);
}

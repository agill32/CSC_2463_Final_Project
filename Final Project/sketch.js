let GameStates = Object.freeze({
START: "start",
PLAY: "play",
END: "end",
LOSE: "lose"
});
let gameState = GameStates.START;
let guy, back, walls, mummy;
let timer = 60;
let prevTime;
let lives = 3;
let enemies = [];
let prevSpawn;
let speed;
let timeMap;

let startContext, synth1;
let part1, footstep;

let connectButton, port;
let up, down, left, right;

function preload() {
  walls = loadImage("wall.png");
  guy = loadImage("finalproj_player.png");
  back = loadImage("background.png");
  mummy = loadImage("mummy.png");
  treasure = loadImage("treasure.png");

  footstep = new Tone.Player("footstep.mp3").toDestination();
}

function setup() {
  createCanvas(1664, 832);
  imageMode(CENTER);
  //audio section
  startContext = createButton("Start Audio");
  startContext.position(0, height);
  startContext.mousePressed(() => {
    if (Tone.context.state !== "Running") {
      Tone.start().then(() => {
        console.log("Context has started");
        Tone.Transport.start()
      })
    } else {
      Tone.Transport.start();
    }
  });

  port = createSerial();
  connectButton = createButton("Connect Arduino");
  connectButton.position(0 + 100, height);
  connectButton.mousePressed(connectToSerial);
  
  synth1 = new Tone.PolySynth(Tone.Synth).toDestination();

  part1 = new Tone.Part(((time, note) => {
    synth1.triggerAttackRelease(note, "4n", time);
  }), [
    [0, ["D4, E3"]],
    [1, "C4"],
    [2, "A3, B3"],
    [3, ["D4, G4"]],
    [4, "C4"],
    [5, ["E4"]],
    [6, "G4"],
    [7, ["E4"]],
    [8, "C4"],
    [9, ["D4, E3"]],
    [10, "C4"]
  ]).start();
part1.loop = true;
part1.loopEnd = "7m";

  //graphics section
  noSmooth();
  back.resize(1664, 832);

  player = new Character(64, height/2);
  player.addAnimation("down", new SpriteAnimation(guy, 0, 0, 4));
  player.addAnimation("up", new SpriteAnimation(guy, 0, 1, 4));
  player.addAnimation("right", new SpriteAnimation(guy, 0, 2, 4));
  player.addAnimation("left", new SpriteAnimation(guy, 0, 3, 4));
  player.addAnimation("upIdle", new SpriteAnimation(guy, 0, 1, 1));
  player.addAnimation("downIdle", new SpriteAnimation(guy, 0, 0, 1));
  player.addAnimation("rightIdle", new SpriteAnimation(guy, 0, 2, 1));
  player.addAnimation("leftIdle", new SpriteAnimation(guy, 0, 3, 1));


  prevSpawn = random(220, 700);
  for (i = 0; i < 7; i++)
  { enemies[i] = new Mummy(prevSpawn, 400, random(2, 6));
    enemies[i].addAnimation("down", new SpriteAnimation(mummy, 0, 0, 4));
    enemies[i].addAnimation("up", new SpriteAnimation(mummy, 0, 1, 4));
    enemies[i].currentAnimation = "down";
    prevSpawn = prevSpawn + random(128, 300);
  }
  player.currentAnimation = "downIdle";
}

function draw() {
  background(115);
  textAlign(RIGHT, TOP);

  switch(gameState) {
    case GameStates.START:
      image(back, width/2, height/2);
      textAlign(CENTER, CENTER);
      textSize(80);
      fill(255);
      text("Welcome to PUZZLE RUNNER", width/2, height/2 - 200);
      textSize(50);
      text("Press Enter\nto begin", width/2, height/2 + 90);
      lives = 3;
      timer = 60;
      Tone.Transport.bpm.value = 120;
      break;
    case GameStates.PLAY:
      push();
      rotate(90);
      image(walls, 0, 0, 1664, 128);
      pop();
      image(walls, width/2, 64, 1664, 128);
      let end = image(treasure, width - 128, height/2, 160, 160)
      fill("white");
      textSize(50);
      text("Time: " + Math.ceil(timer), width - 75, 10);
      prevTime = timer;
      timer -= deltaTime / 1000;
      if (timer != prevTime)
      { Tone.Transport.bpm.value = Tone.Transport.bpm.value + 0.2;}
      if (timer <= 0){
        gameState = GameStates.START;
        player.x = 32;
        player.y = height/2
      }
      
      text("Lives Left: " + lives, 300, 10);
      if (lives == 0)
      { gameState = GameStates.START; }
      player.draw();
      for (i = 0; i < 7; i++)
        { enemies[i].draw() 
          if (checkCollisions(player, enemies[i]) == true)
          { player.x = 32;
            player.y = height/2
            lives--;
          }
       }
        if (player.x <= 64)
          {player.x = 64;}
        else if (player.x >= width - 64)
          {player.x = width - 64}
        else if (player.y <= 128)
          {player.y = 128}
        else if (player.y >= height - 64)
          {player.y = height - 64}
        else if (player.x >= width - 200 && player.y > height/2 - 160 && player.y < height/2 + 160)
          {gameState = GameStates.END;} 

        if (port.opened()) {
          port.write(timer.toString() + "\n");
        }
      break;
    case GameStates.END:
      part1.stop();
      textAlign(CENTER);
      textSize(100);
      text("Congrats, you win!", width/2, height/2 - 400);
      textSize(50);
      text("Your Time Was " + round(timer) + " Seconds", width/2, height/2 - 200);
      image(treasure, width/2, height - 400, 640, 640)
      break;
  }
}

function keyPressed() {
  if (keyCode === ENTER && gameState == GameStates.START)
  { gameState = GameStates.PLAY;}

  player.keyPressed();

  if (keyCode == RIGHT_ARROW || keyCode == DOWN_ARROW || keyCode == UP_ARROW || keyCode == LEFT_ARROW )
  { footstep.start();
    footstep.loop = true;
  }
}

function keyReleased() {
 player.keyReleased();
  footstep.loop = false;
}

function checkCollisions(a, b) {
  return (abs(a.x - b.x) < 64 && abs(a.y - b.y) < 64);
}

class Mummy{
  constructor(g, h, speed){
    this.x = g;
    this.y = h;
    this.speed = speed;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw(){
    if (this.currentAnimation == "up")
      { if (this.y > 128)
        { this.y -= this.speed;}
        else  
        { this.currentAnimation = "down" }
      }
     if (this.currentAnimation == "down")
      { if (this.y < height - 64)
        { this.y += this.speed;}
        else  
        { this.currentAnimation = "up" }
      }
      push();
      translate(this.x, this.y);
      this.animations[this.currentAnimation].draw();
      pop();
    }
}

class Character{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw(){
    let animation = this.animations[this.currentAnimation];
    let str = port.readUntil("\n");
    str = str.trim();
    port.clear();
    if (animation || str !== "")
    { if (this.currentAnimation == "up" || str == "W") 
      {  this.currentAnimation = "up" 
        this.y -= 3; }
      else if (this.currentAnimation == "down" || str == "S") 
      { this.currentAnimation = "down" 
        this.y += 3;}
      else if (this.currentAnimation == "right" || str == "D") 
      { this.currentAnimation = "right" 
        this.x += 3 }
      else if (this.currentAnimation == "left" || str == "A") 
      {  this.currentAnimation = "left" 
        this.x -= 3; }
      else if (str == "" && this.currentAnimation != "upIdle" &&  this.currentAnimation != "leftIdle" &&  this.currentAnimation != "rightIdle")
      {this.currentAnimation = "downIdle";}
      push();
      translate(this.x, this.y);
      animation.draw();
      pop(); }
  }

   keyPressed(){
    switch(keyCode) {
      case UP_ARROW:
        player.currentAnimation = "up";
        break;
      case DOWN_ARROW:
        player.currentAnimation = "down";
        break;
      case RIGHT_ARROW:
        player.currentAnimation = "right";
        break;
      case LEFT_ARROW:
        player.currentAnimation = "left";
        break;
    }
  }
  
   keyReleased(){
    switch(keyCode) {
      case UP_ARROW:
        player.currentAnimation = "upIdle";
        break;
      case DOWN_ARROW:
        player.currentAnimation = "downIdle";
        break;
      case RIGHT_ARROW:
        player.currentAnimation = "rightIdle";
        break;
      case LEFT_ARROW:
        player.currentAnimation = "leftIdle";
        break;
   }
}
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
   }

   draw() {
    image(this.spritesheet, 0, 0, 128, 128, this.u * 32, this.v * 32, 32, 32);
    this.frameCount++;
    if (this.frameCount % 5 === 0)
      { this.u++;
      if (this.u === this.startU + this.duration)
        { this.u = this.startU;}
      }
  }  
}

function connectToSerial() {
  port.open("Arduino", 9600);
}
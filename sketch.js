var mpc = [];
var col = 0;
var row = 0;
var display;
var volumeSlider;
var distances = [];
var mySounds = [];
var spectrum;
var lineX= [];
var lineY= [];
var lineSize= [];
var xoff = [];
var yoff = []; // 2nd dimension of perlin noise


function preload() {
  soundFormats("mp3", "ogg");
  mySounds[0] = loadSound("audio/beat1.mp3");
  mySounds[1] = loadSound("audio/beat2.mp3");
  mySounds[2] = loadSound("audio/beat3.mp3");
  mySounds[3] = loadSound("audio/beat4.mp3");
  mySounds[4] = loadSound("audio/flute1.mp3");
  mySounds[5] = loadSound("audio/flute2.mp3");
  mySounds[6] = loadSound("audio/flute3.mp3");
  mySounds[7] = loadSound("audio/flute4.mp3");
  mySounds[8] = loadSound("audio/piano1.mp3");
  mySounds[9] = loadSound("audio/piano2.mp3");
  mySounds[10] = loadSound("audio/piano3.mp3");
  mySounds[11] = loadSound("audio/piano4.mp3");
  mySounds[12] = loadSound("audio/drip1.mp3");
  mySounds[13] = loadSound("audio/drip2.mp3");
  mySounds[14] = loadSound("audio/bass1.mp3");
  mySounds[15] = loadSound("audio/bass2.mp3");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < 16; i++) {
    if (i % 4 == 0) {
      row += 1;
      col = 0;
    }
    col += 1;
    let newPad = new Pad(
      col * (width / 5),
      row * (height / 5),
      mySounds[i],
      i + 1,
      row,
      col
    );
    mpc.push(newPad);
  }
  display = new Display(width / 5, 30);
  for (let index = 0; index < mpc.length; index++) {
    distances.push(
      dist(mouseX, mouseY, mpc[index].centerX, mpc[index].centerY)
    );
  }
  console.log(distances);
  rectMode(CENTER);
  fft = new p5.FFT();
  for (let i = 0; i < 1024; i++) {
    lineX.push(
      random(0,200)
    );
    lineY.push(
      random(0,200)
    );
    lineSize.push(0);
    xoff.push(random(0,1000));
    yoff.push(random(0,1000));
  } 
}

function draw() {
  //check to see if thw window width is al least as big as the window height
  if (window.innerWidth >= window.innerHeight-100) {
  myBackground();
  spectrum = fft.analyze();
  checkPlaying();
  stroke(255);
  noFill();
  strokeWeight(1);
  rect(width / 2, height / 2, width - 10, height - 10, 20);
  //display.display();
  for (let i = 0; i < mpc.length; i++) {
    mpc[i].display();
  }
  for (let index = 0; index < mpc.length; index++) {
    distances.push(
      dist(mouseX, mouseY, mpc[index].centerX, mpc[index].centerY)
    );
  }
  //keep the first 16 values of the array distances
  distances.splice(0, distances.length - 16);
  if (mouseIsPressed) {
    console.log(distances);
    for (let index = 0; index < mpc.length; index++) {
      if (distances[index] < height / 6 / 2 + 30) {
        mpc[index].play();
      }
    }
  }
} else {
  //if the window width is smaller than the window height, display a message to the user
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Please rotate your device", width/2, height/2);
  text("to landscape mode", width/2, height/2+30);

}
}

class Pad {
  constructor(centerX, centerY, audio, id, row, col) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.audio = audio;
    this.id = id;
    this.row = row;
    this.col = col;
    this.playing = false;
  }
  display() {
    if (this.playing) {
      if (this.id < 5) {
        fill(238, 114, 242, 250);
        
      } else if (this.id < 9) {
        fill(242, 114, 114, 250);
        
      } else if (this.id < 13) {
        fill(242, 242, 114, 250);
        
      } else if (this.id < 15) {
        fill(114, 242, 242, 250);
        
      } else if (this.id < 17) {
        fill(114, 242, 114, 250);
        
      }
    } else {
      if (this.id < 5) {
      fill(155, 155, 155, 200);
      
      } else if (this.id < 9) {
      fill(155, 155, 155, 200);
      
      } else if (this.id < 13) {
      fill(155, 155, 155, 200);
      
      } else if (this.id < 15) {
      fill(155, 155, 155, 200);
      
      } else if (this.id < 17) {
      fill(155, 155, 155, 200);
      
      }
    }
    stroke(223, 3, 252);
    strokeWeight(4);
    rect(this.centerX, this.centerY, width / 6, height / 6, 5);
    textSize(12);
    strokeWeight(0.5);
    stroke(255);
    fill(255);
    if (this.id < 5) {
      text("Drums", this.centerX - 15, this.centerY);
    } else if (this.id < 9) {
      text("Flute", this.centerX - 15, this.centerY);
    } else if (this.id < 13) {
      text("Piano", this.centerX - 15, this.centerY);
    } else if (this.id < 15) {
      text("Drip", this.centerX - 15, this.centerY);
    } else if (this.id < 17) {
      text("Bass", this.centerX - 15, this.centerY);
    }

    text(this.id, this.centerX - 10, this.centerY - 20);

    if (this.playing) {
      noFill();
      stroke(57, 255, 20);
      strokeWeight(1.5);
      var playHead = map(
        this.audio.currentTime(),
        0,
        this.audio.duration(),
        0,
        width / 6
      );
      rect(this.centerX, this.centerY, playHead, height / 6, 5);
    }
  }
  setX(x) {
    this.centerX = x;
  }
  setY(y) {
    this.centerY = y;
  }
  play() {
    this.playing = true;
    if (this.id > 8 && this.id < 13) {
      this.audio.setVolume(0.2);
    } else {
      this.audio.setVolume(0.5);
    }
    this.audio.playMode("untilDone");
    this.audio.play();
    this.audio.onended(() => {
      this.playing = false;
    });
  }
}

class Display {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  display() {
    fill(247);
    stroke(180);
    rect(this.x, this.y, (width / 8) * 5, height / 10, 5);
  }
  setX(x) {
    this.x = x;
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  row = 0;
  col = 0;

  for (let i = 0; i < mpc.length; i++) {
    if (i % 4 == 0) {
      row += 1;
      col = 0;
    }
    col += 1;
    mpc[i].setX(col * (width / 5));
    mpc[i].setY(row * (height / 5));
  }
  display.setX(width / 5);
  // if (window.innerWidth >= 1024) {
  // volumeSlider.position(width/36, (height/36)*28);
  // } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
  // volumeSlider.position(width/42, (height/36)*28);
  // } else if (window.innerWidth < 768 && window.innerWidth >= 425) {
  // volumeSlider.position(-40, (height/36)*28);
  // } else if (window.innerWidth < 425) {
  // volumeSlider.position(-40, (height/36)*28);
  // }

  // if (window.innerWidth >= 1024) {
  // volumeSlider.style('transform', 'rotate(270deg) scale(1.3)');
  // } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
  // volumeSlider.style('transform', 'rotate(270deg) scale(1.2)');
  // } else if (window.innerWidth < 768 && window.innerWidth >= 425) {
  // volumeSlider.style('transform', 'rotate(270deg) scale(1)');
  // } else if (window.innerWidth < 425) {
  // volumeSlider.style('transform', 'rotate(270deg) scale(0.8)');
  // }
}

function myBackground() {
  background(0);
}

function mousePressed() {
  userStartAudio();
}

function checkPlaying() {
  for (let i = 0; i <spectrum.length; i++) {
    xoff[i] += 0.001;
    yoff[i] += 0.002;
    const x = lineX[i]+(noise(xoff[i]) * width);
    const y = lineY[i]+(noise(yoff[i]) * height);
   if (spectrum[i] > 0) {
    noStroke();
    fill(255,255,255, 190);
     ellipse (x, y, spectrum[i]/2, spectrum[i]/2);
   }
    
  } 

}

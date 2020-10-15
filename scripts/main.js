(() => {
    var cannon;
    var obst;
    var ammo;
    var explo;
    var myScore;
    var explosionSound;
    var shotSound;
    var started = false;

    var cannonImage = new Image();
    cannonImage.src = './img/cannon.png';
    var obstacleImage = new Image();
    obstacleImage.src = './img/Discord.png';
    var ammoImage = new Image();
    ammoImage.src = './img/ammunition.gif';
    var background = new Image();
    background.src = './img/space.jpg';
    var explosion = new Image();
    explosion.src = './img/explosion.gif';
    

    function startGame() {
      button = document.createElement("button")
      this.button.innerHTML = "Start";
      this.button.width = '100px';
      this.button.setAttribute('id','run');
      document.body.insertBefore(this.button, document.body.childNodes[1]);

      explosionSound = new sound("./sounds/explosion.mp3");
      shotSound = new sound("./sounds/shot.wav");

      document.getElementById('run').addEventListener('click', ()=>{
        if(!started){
          myGameArea.start();
        document.getElementById('run').blur();
        }
      });
        cannon = new component(52, 55, 298, 425);
        obst = new obstacle(50,50);
        myScore = new component("30px", "Consolas", 460, 40, "text");
      }
      
    var myGameArea = {
      canvas : document.createElement("canvas"),
      start : async function() {
        started = true;
        this.score = 0;
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        this.canvas.fillStyle = "blue";
        this.context.drawImage(background,0,0);
        

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        

        this.interval = setInterval(updateGameArea, 10);

        window.addEventListener('keydown', function (e) {
          myGameArea.keys = (myGameArea.keys || []);
          myGameArea.keys[e.key] = true;
        })
        window.addEventListener('keyup', function (e) {
          myGameArea.keys[e.key] = false;
        })
      },
      clear : function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.context.drawImage(background,0,0);
      },
      stop : function() {
          clearInterval(this.interval);
      }
    }

  function component(width, height, x, y,type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x, this.y);
      } else {
      ctx.drawImage(cannonImage,
        this.x,
        this.y,
        this.width, this.height);
      }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.shoot = function() {
        ammo = new projectile(30,60, this.x, this.y, this.width);
        shotSound.play();
    }
  }

  function obstacle(width, height){
    this.width = width;
    this.height = height;
    this.x = Math.trunc(Math.random()* (myGameArea.canvas.width - this.width));
    this.y = Math.trunc(Math.random()* ((myGameArea.canvas.height/2) - this.height));

    this.update = function(){
        ctx = myGameArea.context;
        ctx.drawImage(obstacleImage,
          this.x,
          this.y,
          this.width, this.height);
      }
  }

  function explose(obst){
    this.count = 0;
    this.update = function(){
      ctx = myGameArea.context;
      ctx.drawImage(explosion,obst.x-65,obst.y-65,200,200);
      this.count += 1;
    }
  }

  function projectile(width, height, x, y, cannonW){
    this.width = width;
    this.height = height;
    this.speedY = -5;
    this.x = x+(cannonW/2)-(this.width/2);
    this.y = y-this.height/2;

    this.update = function(){
        ctx = myGameArea.context;
        ctx.drawImage(ammoImage,
          this.x,
          this.y,
          this.width, this.height);
      }
    this.newPos = function() {
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
        crash = false;
      }
      return crash;
    }
  }

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  } 

  function updateGameArea() {
    if (explo && explo.count >= 30){explo = null;}
    if (ammo && ammo.y < 0){ammo = null;}
    if (ammo && ammo.crashWith(obst)) {
      explo = new explose(obst);
      explosionSound.play();
      obst = new obstacle(50,50);
      ammo = null;
      myGameArea.score += 1;
    } else {
      myGameArea.clear();
      cannon.speedX = 0;
      cannon.speedY = 0;
      if (myGameArea.keys && (myGameArea.keys['ArrowLeft']) && cannon.x >= 0) {cannon.speedX = -5; }
      if (myGameArea.keys && (myGameArea.keys['ArrowRight']) && cannon.x <= (myGameArea.canvas.width-cannon.width)) {cannon.speedX = 5; }
      if (myGameArea.keys && (myGameArea.keys[' '])) {if(!ammo)cannon.shoot(); }
      cannon.newPos();
      cannon.update();
      obst.update();
      if (ammo){
          ammo.newPos();
          ammo.update();
      }
      if (explo){
        explo.update();
      }
      myScore.text = "SCORE: " + myGameArea.score;
      myScore.update();
    }
  }
    startGame();
})();
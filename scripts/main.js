(() => {
    var cannon;
    var obst;
    var ammo;

    async function startGame() {
        await myGameArea.start();
        cannon = new component(20, 80, "red", 310, 380);
        obst = new obstacle(50,10,"blue");
      }
      
      var myGameArea = {
        canvas : document.createElement("canvas"),
        start : async function() {
          this.canvas.width = 640;
          this.canvas.height = 480;
          this.context = this.canvas.getContext("2d");
          document.body.insertBefore(this.canvas, document.body.childNodes[0]);
          this.interval = setInterval(updateGameArea, 10);

          window.addEventListener('keydown', function (e) {
            myGameArea.key = e.key;
          })
          window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
          }) 
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function() {
            clearInterval(this.interval);
        }
      }

    function component(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function(){
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
        this.newPos = function() {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.shoot = function() {
            ammo = new projectile(5,10,"black", this.x, this.y, this.width);
        }
    }

    function obstacle(width, height, color){
        this.width = width;
        this.height = height;
        this.x = Math.trunc(Math.random()* (myGameArea.canvas.width - this.width));
        this.y = Math.trunc(Math.random()* ((myGameArea.canvas.height/2) - this.height));

        this.update = function(){
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
    }

    function projectile(width, height, color, x, y, cannonW){
        this.width = width;
        this.height = height;
        this.speedY = -5;
        this.x = x+(cannonW/2)-(this.width/2);
        this.y = y-this.height/2;

        this.update = function(){
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
        this.newPos = function() {
            this.y += this.speedY;
        } 
    }

    function updateGameArea() {
        myGameArea.clear();
        cannon.speedX = 0;
        cannon.speedY = 0;
        if (myGameArea.key && (myGameArea.key == 'ArrowLeft')) {cannon.speedX = -3; }
        if (myGameArea.key && (myGameArea.key == 'ArrowRight')) {cannon.speedX = 3; }
        if (myGameArea.key && (myGameArea.key == ' ')) {cannon.shoot(); }
        cannon.newPos();
        cannon.update();
        obst.update();
        if (ammo){
            ammo.newPos();
            ammo.update();
        }
    }
      
    
    startGame();

})();
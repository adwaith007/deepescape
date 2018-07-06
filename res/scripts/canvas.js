window.onload= function(){
  var canvas = document.querySelector("canvas");
  var levelspeed,bonus;
  var borderwalls, score,start,pause;

  canvas.width=window.innerWidth*0.8;
  canvas.height=window.innerHeight*0.8;

  var c= canvas.getContext("2d");

  //image loading//
  var wallimg=new Image();
  wallimg.src="/lib/images/wall.png";

  var enemyimg=[];
  enemyimg.push(new Image());
  enemyimg[0].src="/lib/images/enemy1.png";
  enemyimg.push(new Image());
  enemyimg[1].src="/lib/images/enemy2.png";
  enemyimg.push(new Image());
  enemyimg[2].src="/lib/images/enemy3.png";
  enemyimg.push(new Image());
  enemyimg[3].src="/lib/images/enemy4.png";

  var deepimg=new Image();
  deepimg.src="/lib/images/deep.png";

  var deepicon= new Image();
  deepicon.src="/lib/images/deepicon.jpg";

  var borderwallimg= new Image();
  borderwallimg.src="/lib/images/borderwall.png";

  var blastimg= new Image();
  blastimg.src="/lib/images/blast.png";

  var borderwallpattern;
  borderwallimg.onload= function(){
    borderwallpattern=c.createPattern(borderwallimg,"repeat");
  }



  ////////////////


  // audio loading//
  var gunshot = new Audio("/lib/sounds/gunshot.mp3");
  var gameoversound= new Audio("/lib/sounds/gameover.mp3");
  var pain= new Audio("/lib/sounds/pain.mp3");


  ///////////////////
  window.addEventListener("resize", function(){
    canvas.width=window.innerWidth*0.8;
    canvas.height=window.innerHeight*0.8;
    init();
  });

  window.addEventListener("click",function(e){
    console.log(e);
    if(e.button==0){
      if(start&&!gameover&&(e.clientX-innerWidth*0.1>=canvas.width/2-20)&&(e.clientX-innerWidth*0.1<=canvas.width/2+20)&&(e.clientY-innerHeight*0.07>=20)&&(e.clientY-innerHeight*0.07<=60)){
        pause=!pause;
      }
      else if(start&&gameover&&(e.clientX-innerWidth*0.1>=canvas.width/2-70)&&(e.clientX-innerWidth*0.1<=canvas.width/2+70)&&(e.clientY-innerHeight*0.07>=340)&&(e.clientY-innerHeight*0.07<=380)){
        window.location.reload();
      }
      else if(start&&!gameover&&!pause){
        let temp= new Bullet(deep.x,deep.y-deep.radius, 3, "#ffff00");
        setVelocity(temp,enemies[0],4);
        deepsbullets.push(temp);
        gunshot.play();
      }
    }

  })
  var gameover;

  const mouse = {
      x: innerWidth / 2,
      y: innerHeight / 2
  };

  window.addEventListener("mousemove", function(e){
    mouse.x=e.clientX-window.innerWidth*0.1;
    mouse.y=e.clientY-window.innerHeight*0.07;
  })
  window.addEventListener("keypress", function(){
    start=true;
  })

  //Utility functions
  function RandomInRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  function drawcircle(x,y,radius,color){
    c.save();
    c.beginPath();
    c.fillStyle=color;
    c.arc(x, y,radius, 0, 2*Math.PI);
    c.fill();
    c.restore();
  }

  function blockbywall(component1,component2){
    let velcx=true,velcy=true;
    for(let i=0;i<component2.length;i++){
      if((component1.x+component1.radius+component1.dx>component2[i].x)&&(component1.x-component1.radius<component2[i].x+10)&&(component1.y+component1.radius>component2[i].y)&&(component1.y-component1.radius<component2[i].y+component2[i].height))
      {
        velcx=false;
        component1.x=component2[i].x-component1.radius;
      }
      if((component1.x-component1.radius+component1.dx<component2[i].x+component2[i].width)&&(component1.x+component1.radius>component2[i].x+component2[i].width-10)&&(component1.y+component1.radius>component2[i].y)&&(component1.y-component1.radius<component2[i].y+component2[i].height))
      {
        velcx=false;
        component1.x=component2[i].x+component2[i].width+component1.radius;
      }
      if((component1.x+component1.radius>component2[i].x)&&(component1.x-component1.radius<=component2[i].x+component2[i].width)&&(component1.y+component1.radius+component1.dy>component2[i].y)&&(component1.y+component1.radius<component2[i].y+10)){
        velcy=false;
        component1.y=component2[i].y-component1.radius;
      }
      if((component1.x+component1.radius>component2[i].x)&&(component1.x-component1.radius<=component2[i].x+component2[i].width)&&(component1.y-component1.radius+component1.dy<component2[i].y+component2[i].height)&&(component1.y+component1.radius>component2[i].y+component2[i].height-10)){
        velcy=false;
        component1.y=component2[i].y+component2[i].height+component1.radius;
      }
    }
    if(velcx){
      component1.x+=component1.dx;
    }
    if(velcy){
      component1.y+=component1.dy;
    }
  }


  const colors = ['#00bdff', '#4d39ce', '#088eff'];
  function randomColor(){
    return colors[Math.floor(Math.random()*colors.length)];
  }

  function randomEnemy(){
    return enemyimg[Math.floor(Math.random()*enemyimg.length)];
  }

  function Distance(x1,y1,x2,y2){
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
  }

  function setVelocity(component1,component2,vel){
    let dx= component2.x-component1.x;
    let dy= component2.y-component1.y;
    if(Distance(component2.x,component2.y,component1.x,component1.y)<5){
      component1.dx=0;
      component1.dy=0;
    }
    else{
      let slope= dy/dx;
      let angle= Math.abs(Math.atan(slope));
      if(dx<0&&dy<0)
      {
        component1.dx=-vel*Math.cos(angle);
        component1.dy=-vel*Math.sin(angle);
      }
      else if(dx<0)
      {
        component1.dx=-vel*Math.cos(angle);
        component1.dy=vel*Math.sin(angle);
      }
      else if(dy<0)
      {
        component1.dx=vel*Math.cos(angle);
        component1.dy=-vel*Math.sin(angle);
      }
      else{
        component1.dx=vel*Math.cos(angle);
        component1.dy=vel*Math.sin(angle);
      }

    }


  }

  function makewallblocks(x,y){
    for(let i=0;(i-1)*(wall.height+gap)<canvas.height;i++){
      walls.push(new Wall(x,(i)*(wall.height+gap)+y,wall.width,wall.height));
    }
  }


  //object

  var wall;
  var walls=[];
  var gap;

  function Wall(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.update=()=>{
      this.x-=levelspeed;
      this.draw();
    }
    this.draw=()=>{
      // c.drawImage(wall,10,10,this.width,this.height,this.x,this.y,this.width,this.height);
      c.drawImage(wallimg,this.x,this.y,this.width,this.height);
      // if(this.x==Math.floor(canvas.width*0.8)&&wallcontroller){
      //   makewallblocks(canvas.width, Math.floor(Math.random()*wall.height)-wall.height);
      //   wallcontroller=false;
      // }
    }
  }

  function Bullet(x,y,radius,color){
    this.x=x;
    this.y=y;
    this.dx;
    this.dy;
    this.state=1;
    this.radius=radius;
    this.color=color;
    this.update=()=>{
      this.x+=this.dx;
      this.y+=this.dy;
      for(let i=0;i<walls.length;i++){
        if((this.x+this.radius>=walls[i].x)&&(this.x-this.radius<=walls[i].x+walls[i].width)&&(this.y+this.radius>=walls[i].y)&&(this.y-this.radius<=walls[i].y+walls[i].height)&&this.state==1){
          this.state=0;
          blasts.push(new Blast(this.x,this.y));
        }
      }
      this.draw();
    }
    this.draw=()=>{
      if(this.state==1){
        drawcircle(this.x,this.y,this.radius,this.color)
      }
    }
  }
  function Blast(x,y){
    this.x=x;
    this.y=y;
    this.state=1;
    this.radius=0;

    this.update=()=>{
      this.x-=levelspeed;
      this.radius+=1;
      this.state-=0.05;
      this.draw();
    }
    this.draw=()=>{
      if(this.state>0){
        c.drawImage(blastimg,this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
      }
    }
  }

  function BorderWall(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;

    this.draw=()=>{
      c.save();
      c.beginPath();
      c.fillStyle=borderwallpattern;
      c.fillRect(this.x,this.y,this.width,this.height);
      c.closePath();
      c.restore();
    }
  }

  function Enemy(x,y,radius,image){
    this.x=x;
    this.y=y;
    this.image=image;
    this.radius=radius;
    this.bc=1;
    this.dx;
    this.dy;
    this.update=()=>{

        setVelocity(this,deep,2);

      blockbywall(this,walls);
      this.draw();
    }
    this.draw=()=>{
      this.bc+=1;
      //c.fillRect(this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
      c.drawImage(this.image,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
      if(this.bc%70==0){
        let temp= new Bullet(this.x,this.y-this.radius, 3, "#ffffff");
        setVelocity(temp,deep,4);
        bullets.push(temp);
        gunshot.play();

      }


    }
  }

  var deep= {
    x:canvas.width/2,
    y:canvas.height/2,
    dx:0,
    dy:0,
    radius: 15,
    lastPoint:{x:0,y:0},
    draw: function() {
      c.save();
      // c.beginPath();
      // c.arc(this.x, this.y,this.radius, 0, 2*Math.PI);
      // c.fill();
      c.drawImage(deepimg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
      c.restore();
    },
    update: function(){
      for(let i=0;i<bullets.length;i++){
        if(Distance(this.x,this.y,bullets[i].x,bullets[i].y)<this.radius+bullets[i].radius&&bullets[i].state==1){
          gameover=true;
          gunshot.pause();
          gunshot.currentTime=0;
          gameoversound.play();
        }
      }
      setVelocity(this,mouse, 5);
      blockbywall(this,walls);
      blockbywall(this,borderwalls);

      if(this.x-this.radius<=50){
        gameover=true;
        gunshot.pause();
        gunshot.currentTime=0;
        gameoversound.play();
      }



      this.draw();
    }
  }

  //implementation


  function init() {
    bestscore=localStorage.getItem('bestscore')||'0';
    storagecontroller=true;
    bonus=0;
    score=0;
    levelspeed=1;
    start=false;
    pause=false;
    gameover=false;
    walls=[];
    bullets=[];
    deepsbullets=[];
    enemies=[];
    borderwalls=[];
    blasts=[];
    borderwalls.push(new BorderWall(0,0,canvas.width,50));
    borderwalls.push(new BorderWall(0,50,50,canvas.height-100));
    borderwalls.push(new BorderWall(0,canvas.height-50,canvas.width,50));
    borderwalls.push(new BorderWall(canvas.width-50,50,50,canvas.height-100));
    enemies.push(new Enemy(canvas.width,canvas.height/2,15,randomEnemy()));
    wall={height: 70, width:30};
    gap=150;
    rightmost=0;
    wallcontroller=true;
    makewallblocks(canvas.width, Math.floor(Math.random()*wall.height)-wall.height);


  }

  //draw walls
  function drawwalls(){
    for(let i=0;i<walls.length;i++){
      if(walls[i].x+walls[i].width<=0){
        walls.splice(i,1);
        rightmost--;
        i--;
      }
      else{
        walls[i].update();
      }
    }
    for(let i=0;i<borderwalls.length;i++){
      borderwalls[i].draw();
    }
    if(walls[rightmost].x<=Math.floor(canvas.width*0.8)&&walls[rightmost].x>=Math.floor(canvas.width*0.8)-wall.width){
      rightmost=walls.length;
      makewallblocks(canvas.width, Math.floor(Math.random()*wall.height)-wall.height);
    }
  }
  function drawenemies(){
    for(let i=0;i<enemies.length;i++){
      if(enemies[i].x+enemies[i].radius<=50){
        enemies.splice(i,1);
        i--;
        enemies.push(new Enemy(canvas.width+10,canvas.height/2,15,randomEnemy()));
        continue;

      }
      for(let j=0;j<deepsbullets.length;j++){
        if(Distance(enemies[i].x,enemies[i].y,deepsbullets[j].x,deepsbullets[j].y)<enemies[i].radius+deepsbullets[j].radius&&deepsbullets[j].state==1){
          blasts.push(new Blast(enemies[i].x,enemies[i].y));
          deepsbullets[j].state=0;
          pain.play();
          enemies.splice(i,1);
          bonus+=5;
          enemies.push(new Enemy(canvas.width+10,canvas.height/2,15,randomEnemy()));
          console.log(enemies.length);
          break;
        }
      }
      if(enemies.length==0){
        break;
      }
      console.log(i);
      if((mouse.x>=enemies[i].x-enemies[i].radius)&&(mouse.x<=enemies[i].x+enemies[i].radius)&&(mouse.y>=enemies[i].y-enemies[i].radius)&&(mouse.y<=enemies[i].y+enemies[i].radius)){
        blasts.push(new Blast(enemies[i].x,enemies[i].y));
        pain.play();
        enemies.splice(i,1);
        bonus+=5;
        i--;
        enemies.push(new Enemy(canvas.width+10,canvas.height/2,15,randomEnemy()));
        continue;
      }

      enemies[i].update();
    }
    for(let i=0;i<bullets.length;i++){
      bullets[i].update();
    }
    for(let i=0;i<deepsbullets.length;i++){
      deepsbullets[i].update();
    }
    for(let i=0;i<blasts.length;i++){
      blasts[i].update();
    }
  }
  function drawscore(){
    c.save();
    c.fillStyle="rgba(255,0,0,0.5)";
    c.fillRect(20,20,100,45);
    c.fillRect(canvas.width-130,20,120,45);
    c.fillStyle="#ffffff";
    c.font="normal 15px Montserrat";
    c.fillText("Score: "+Math.round(score+bonus), 40,40);
    c.fillText("Best Score: "+bestscore,canvas.width-120,40);

    c.restore();
  }
  function drawgameover(){
    if(storagecontroller){
      if(parseInt(bestscore)<Math.round(bonus+score)){
        bestscore=Math.round(bonus+score).toString();
        localStorage.setItem("bestscore",bestscore);
      }
    }
    c.save();
    c.fillStyle="rgba(37,37,37,0.5)";
    c.fillRect(canvas.width/2-100,20,200,70);
    c.fillStyle="#ffffff";
    c.font="600 20px Montserrat";
    c.fillText("GAME OVER!!!", canvas.width/2-70, 60);


    c.fillStyle="rgba(37,37,37,0.5)";
    c.fillRect(canvas.width/2-200,100,400,230);
    c.fillStyle="#ffffff";
    c.font="500 20px Montserrat";
    c.fillText("Score Card", canvas.width/2-50, 130);
    c.fillText("Level Points:", canvas.width/2-100, 170);
    c.fillText(Math.round(score), canvas.width/2+50, 190);
    c.fillText("Kills:", canvas.width/2-100, 220);
    c.fillText("x"+Math.round(bonus)/5, canvas.width/2+40, 220);
    c.fillText(Math.round(bonus), canvas.width/2+50, 240);
    c.fillText("Total Points:", canvas.width/2-100, 260);
    c.fillText(Math.round(score+bonus), canvas.width/2+50, 280);
    c.fillText("Best Score:", canvas.width/2-100, 300);
    c.fillText(bestscore, canvas.width/2+50, 320);
    c.fillStyle="rgba(255,0,0,0.5)";
    c.fillRect(canvas.width/2-70,340,140,40);
    c.fillStyle="#ffffff";
    c.fillText("Play Again",canvas.width/2-50, 365 );
    c.restore();
  }

  function drawstartscreen(){
    c.save();
    c.fillStyle="rgba(37,37,37,0.5)";
    c.fillRect(canvas.width*0.05,canvas.height*0.05,canvas.width*0.9,canvas.height*0.9);
    c.fillStyle="#ffffff";
    c.font="500 30px Montserrat";
    c.fillText("Welcome to Deep Escape", canvas.width/2-170, 100);
    c.font="500 25px Montserrat";
    c.fillText("Story Line", canvas.width*0.10, 140);
    c.font="500 20px Montserrat";
    c.fillText("Deep is an elite programmer. Despite his busy work schedule, he decided to work for", canvas.width*0.10, 180);
    c.fillText("delta inductions and mentor as much students as possible. He asked his mentees to ", canvas.width*0.10, 200);
    c.fillText("make a mentee management system saving on his time. But one of his mentees ", canvas.width*0.10, 220);
    c.fillText("added an exploit method to the program, which led to other mentees knowing about  ", canvas.width*0.10, 240);
    c.fillText("their ratings. Now the mentees who got lower ratings are angry at him and chasing him ", canvas.width*0.10, 260);
    c.fillText("through a maze. Navigate him through the maze and rescue him", canvas.width*0.10, 280);
    c.font="500 25px Montserrat";
    c.fillText("Instructions", canvas.width*0.10, 340);
    c.font="500 20px Montserrat";
    c.fillText("Use your mouse to navigate deep and he will follow you. Hover the mouse over enemies", canvas.width*0.10, 380);
    c.fillText("or shoot them by left click to kill them and earn bonus points. The game ends either when", canvas.width*0.10, 400);
    c.fillText("deep is hit by a mentee's gun shot or if deep is thrashed against the back wall by an", canvas.width*0.10, 420);
    c.fillText("obstacle", canvas.width*0.10, 440);

    c.fillText("PRESS ANY KEY TO START THE GAME", canvas.width/2-180, 480);
    c.drawImage(deepicon, canvas.width/2+300, canvas.height*0.05+10, 120,120);

    c.restore();
  }

  function drawpausescreen(){

    c.save();
    c.fillStyle="#ffffff";
    c.strokeStyle="#ffffff";
    c.beginPath();
    c.moveTo(canvas.width/2-15,25);
    c.lineTo(canvas.width/2-15,55);
    c.lineTo(canvas.width/2+15,40);
    c.fill();
    c.fillStyle="rgba(37,37,37,0.5)";
    c.fillRect(canvas.width*0.1,canvas.height*0.15,canvas.width*0.8,canvas.height*0.5);
    c.fillStyle="#ffffff";
    c.font="500 30px Montserrat";
    c.fillText("Game Paused!!!",canvas.width/2-95, canvas.height*0.25);
    c.font="500 20px Montserrat";
    c.fillText("Use your mouse to navigate deep and he will follow you. Hover the mouse ", canvas.width*0.15, 200);
    c.fillText("over enemies or shoot them by left click to kill them and earn bonus ", canvas.width*0.15, 220);
    c.fillText("points. The game ends either when deep are hit by a mentee's gun shot", canvas.width*0.15, 240);
    c.fillText("or if deep is thrashed against the back wall by an obstacle.", canvas.width*0.15, 260);
    c.closePath();
    c.restore();
  }
  function drawbtn(){
    c.save();
    c.fillStyle="rgba(255,0,0,0.5)";
    c.fillRect(canvas.width/2-20,20,40,40);
    c.restore();
  }

  //animation
  function animate(){
    c.clearRect(0,0,canvas.width, canvas.height);
    if(!start){
      drawstartscreen();

    }
    else if(!gameover&&!pause){
      score+=levelspeed/100;
      drawwalls();
      deep.update();
      drawscore();
      // enemygen();
      drawenemies();
      if(gap>deep.radius*2+10){
            gap-=0.05;
      }
      if(levelspeed>5){
        if(wall.height<canvas.height/2){
          wall.height+=0.1;
        }
      }
      if(levelspeed<=15){
        levelspeed+=0.001;
      }
      drawbtn();
      c.save();
      c.fillStyle="#ffffff"
      c.fillRect(canvas.width/2-15,25,12,30);
      c.fillRect(canvas.width/2+3,25,12,30);
      c.restore();

    }
    else if(!gameover&&pause){
      drawbtn();
      drawpausescreen();


    }
    else{
      drawgameover();
    }

    requestAnimationFrame(animate);
  }

  init()
  animate()

}

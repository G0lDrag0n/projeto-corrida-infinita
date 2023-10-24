var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadImage("skatista.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("background.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("lixo.png.png");
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 800);
  

  trex = createSprite(100,700,20,50);
  
  trex.addImage("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.8;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,700,400,10);
  invisibleGround.visible = false;
  
  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(groundImage);
  //exibir pontuação
  text("Pontuação: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    //mover o 
    gameOver.visible = false;
    restart.visible = false;
    //mudar a animação do trex
      trex.changeAnimation("running", trex_running);
    
    //pontuação
    score = score + Math.round(frameCount/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //pular quando a barra de espaço é pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -17;
        jumpSound.play();
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
       

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 180 === 0){
   var obstacle = createSprite(1000,700,10,40);
   obstacle.velocityX = -(3 + score/500);
   
  obstacle.addImage(obstacle1)
   
    //atribuir escala e tempo de vida ao obstáculo           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //acrescentar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir o tempo de vida da variável
    cloud.lifetime = 200;
    
    //ajuste a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //acrescente cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}


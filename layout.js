let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let bullets = [];
let ennemies=[];
let state = false
let Giftarget;
let GifExplosion; 
let Giffollowers ; 
let spaceshipImage; 
let tempsGifExplosion = 0;
let dureeAffichageGif = 10;
let sound ; 

function preload() {
  // Chargez votre image dans la fonction preload
  Giftarget = loadImage('../images/target/Egph.gif'); 
  GifExplosion =loadImage('../images/effect/3iCN.gif');
  Giffollowers = loadImage('../images/img_vaisseaux/spaceship.gif');
  spaceshipImage = loadImage('../images/img_vaisseaux/nice.gif');
  sound = loadSound('../sound_effect/Laser Sound FX 1.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < 1; i++) {
    vehicules.push(new Vehicle(random(width),random(height)))
  }

  sliderRadiusSeperation=createSlider(10,200,24,1)
  sliderSeperation=createSlider(0,1,0.9,0.01)

  

  // On cree un obstalce au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacle = new Obstacle(-width / 2, -height / 2, 100);
  obstacles.push(obstacle);
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0)
  target = createVector(mouseX, mouseY);
  imageMode(CENTER);
  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  image(Giftarget, target.x, target.y, 70, 70);

  
  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  });

  let targetMouse = createVector(mouseX, mouseY);

  // Behavior logic for vehicles
  if (state) {
    for (i = 0; i < vehicules.length; i++) {
      // Behavior for the lead vehicle
      if (i == 0) {
        vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules);
        this.weightSeparation = 0;
      } else {
        // Behavior for follower vehicles
        let vehiculePrecedent = vehicules[i - 1];

        // Calculate a point behind the preceding vehicle for aiming
        let pointDerriere = vehiculePrecedent.vel.copy();
        pointDerriere.normalize();
        pointDerriere.mult(-50);
        pointDerriere.add(vehiculePrecedent.pos);

        // Display the point behind as a debug circle
        fill(255, 0, 0);
        circle(pointDerriere.x, pointDerriere.y, 5);

        // Apply behaviors for follower vehicles
        vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);
        this.weightSeparation = 0;

        // If the vehicle is close to the target point and nearly stationary, stop
        if (vehicules[i].pos.dist(pointDerriere) < 20 && vehicules[i].vel.mag() < 0.01) {
          vehicules[i].weightArrive = 0;
          vehicules[i].weightObstacle = 0;
          vehicules[i].vel.setHeading(p5.Vector.sub(vehiculePrecedent.pos, vehicules[i].pos).heading());
        } else {
          vehicules[i].weightArrive = 0.3;
          vehicules[i].weightObstacle = 0.9;
        }
      }

      // Update and display each vehicle
      vehicules[i].update();
      vehicules[i].show();
    }
  } else {
    // Behavior logic for vehicles in an alternate state
    for (i = 0; i < vehicules.length; i++) {
      // Behavior for the lead vehicle
      if (i == 0) {
        vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules);
        this.weightSeparation = 0;
      } else {
        // Behavior for follower vehicles
        let vehiculePrecedent = vehicules[0];

        // Calculate a point behind the preceding vehicle for aiming
        let pointDerriere = vehiculePrecedent.vel.copy();
        pointDerriere.normalize();
        pointDerriere.mult(-150);
        pointDerriere.add(vehiculePrecedent.pos);

        // Display the point behind as a debug circle
        fill(255, 0, 0);
        circle(pointDerriere.x, pointDerriere.y, 10);

        // Apply behaviors for follower vehicles
        vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);
        // Set separation weight and radius using sliders
        vehicules[i].weightSeparation = sliderSeperation.value();
        vehicules[i].perceptionRadius = sliderRadiusSeperation.value();
      }

      // Update and display each vehicle
      vehicules[i].update();
      vehicules[i].show();
    }
  }

  // Update and display enemy vehicles
  ennemies.forEach(vehicle => {
    vehicle.wander();
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });

  // Update and display bullets, check for collisions with enemies
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    for (let j = ennemies.length - 1; j >= 0; j--) {
      // Check for bullet-enemy collisions
      if(bullets[i] != undefined && ennemies[j] != undefined){
        let test =  bullets[i].hitEnemy(ennemies[j])
        if (test) {
          imageMode(CENTER);
          if (tempsGifExplosion < dureeAffichageGif) {
            image(GifExplosion, ennemies[j].pos.x, ennemies[j].pos.y, 50, 50);
            
            // Mettez à jour le temps écoulé à chaque trame (frame)
            tempsGifExplosion += deltaTime / 1000; // deltaTime est le temps écoulé depuis la dernière trame en millisecondes
          }
          ennemies.splice(j, 1);

        }
      }
    }

    // Remove bullets that have reached their target
    if (bullets[i].pos.dist(bullets[i].target.pos) < 100) {
      bullets.splice(i, 5);
    }
  }
}

// Function called on mouse press to create obstacles
function mousePressed() {
  obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
  obstacles.push(obstacle);
}

function keyPressed() {
  if(key=="e"){
    let ennemy = new Ennemy(random(width), random(height), color(255,0,0));
    ennemy.maxSpeed = 8;
    ennemy.maxForce = random(0.1, 0.3);
    ennemy.r = random(8, 24);
    ennemies.push(ennemy);
  }
  if (key == "h") {
   if (vehicules.length === 0){
    vehicules.push(new Vehicle(random(width), random(height),spaceshipImage));
   }
   else {
    vehicules.push(new Vehicle(random(width), random(height),Giffollowers));
   }
  }
  if(key == "f"){
    state=!state
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }

  if(key=="s"){
      
      // Create an enemy (bullet) at the mouse position
      let enemy = new Target(mouseX, mouseY);
      // Stop all vehicles
      for (let vehicle of vehicules) {
        vehicle.vel.set(0, 0);
        //sound.play();
  }

  // Add bullets that seek the enemy
  for (let i = 0; i < vehicules.length; i++) {
    let bullet = new Bullet(vehicules[i].pos.x, vehicules[i].pos.y, enemy);
    bullets.push(bullet);
  }
  }

  if (key == "r") {
    const nbMissiles = 10;
    for(let i=0; i < nbMissiles; i++) {
      let x = 20+random(10);
      let y = random(height/2-5, random(height/2+5));
      let v = new Vehicle(x, y);
      vehicules.push(v);
    }
  }
}
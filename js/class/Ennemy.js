class Ennemy {
    constructor(x, y, couleur) {
      this.pos = createVector(x, y);
      this.vel = createVector(1, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = 4;
      this.maxForce = 0.2;
      this.r = 16;
      this.couleur = couleur;
      this.images = [
        loadImage('../images/image_enemies/enemie_0.gif'),
        loadImage('../images/image_enemies/enemie_1.gif'),
        loadImage('../images/image_enemies/enemie_2.gif'),
        loadImage('../images/image_enemies/enemie_3.gif')
      ];
      this.image = random(this.images)
      // pour comportement wander
      this.wanderTheta = PI / 2;
      this.displaceRange = 0.3;
      this.pathMaxLength = 50;
      this.disparu = false;
      this.path = [];
    }
  
    wander() {
      // point devant le véhicule
      let wanderPoint = this.vel.copy();
      wanderPoint.setMag(100);
      wanderPoint.add(this.pos);
      
      // Cercle autour du point
      let wanderRadius = 50;
      let theta = this.wanderTheta + this.vel.heading();
  
      let x = wanderRadius * cos(theta);
      let y = wanderRadius * sin(theta);
  
      // maintenant wanderPoint c'est un point sur le cercle
      wanderPoint.add(x, y);
       // ci-dessous, steer c'est la desiredSpeed directement !
      let steer = wanderPoint.sub(this.pos);
  
      steer.setMag(this.maxForce);
      this.applyForce(steer);
  
      // On déplace le point vert sur le cerlcle (en radians)
      this.displaceRange = 0.3;
      this.wanderTheta += random(-this.displaceRange, this.displaceRange);
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
    pursue(vehicle) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    arrive(target) {
      // 2nd argument true enables the arrival behavior
      return this.seek(target, true);
    }
  
    flee(target) {
      return this.seek(target).mult(-1);
    }
  
    seek(target, arrival = false) {
      let force = p5.Vector.sub(target, this.pos);
      let desiredSpeed = this.maxSpeed;
      if (arrival) {
        let slowRadius = 100;
        let distance = force.mag();
        if (distance < slowRadius) {
          desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
        }
      }
      force.setMag(desiredSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
  
      // on rajoute la position courante dans le tableau
      this.path.push(this.pos.copy());
  
      // si le tableau a plus de 50 éléments, on vire le plus ancien
      if(this.path.length > this.pathMaxLength) {
        this.path.shift();
      }

      if (this.pos.x > width + this.r || this.pos.x < -this.r || this.pos.y > height + this.r || this.pos.y < -this.r) {
        this.disparu = true;
      }


    }
  
    show() 
    {
      imageMode(CENTER);
      image(this.image, this.pos.x, this.pos.y, 40, 40)
      
      pop();
  
      
    }
  
    edges() {
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
      } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
      }
    }
  }
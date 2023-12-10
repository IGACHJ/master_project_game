class Obstacle {
  constructor(x, y , r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = color(0, 255, 0);
    this.images = [
      loadImage('../images/img_obstacles/meeh_planet.gif'),
      loadImage('../images/img_obstacles/meeh_planet_1.gif'),
      loadImage('../images/img_obstacles/meeh_planet_2.gif'),
      loadImage('../images/img_obstacles/meeh_planet_3.gif'),
      loadImage('../images/img_obstacles/meeh_planet_4.gif'),
      loadImage('../images/img_obstacles/meeh_planet_5.gif')
    ];
    this.image = random(this.images)
  }

  show() {
    push();
    imageMode(CENTER);
    fill(this.color);
    stroke(0);
    strokeWeight(3);
    fill(0);
    image(this.image, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    pop();
  }
  
}



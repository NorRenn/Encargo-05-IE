let formas = [];
const numFormas = 100;

function setup() {
  createCanvas(650, 400);
  background('lightblue'); 
}

function draw() {
  background('lightblue');

  for (let forma of formas) {
    forma.mostrar();
    forma.actualizar();
    forma.rebotar();
  }
}

function mouseClicked() {
  if (formas.length < numFormas) {
    let x = mouseX;
    let y = mouseY;
    let tamano = random(0.5, 2.5);
    let tipo = random() > 0.5 ? 'circulo' : 'estrella';
    let velocidadX = random(-2, 2);
    let velocidadY = random(0.5, 8); // Velocidad de caída entre 0.5 y 3
    formas.push(new Forma(x, y, tamano, tipo, velocidadX, velocidadY));
  }
}

class Forma {
  constructor(x, y, tamano, tipo, velocidadX, velocidadY) {
    this.x = x;
    this.y = y;
    this.tamano = tamano;
    this.tipo = tipo;
    this.velocidadX = velocidadX;
    this.velocidadY = velocidadY;
    this.rebote = 0.8; // Factor de rebote, controla la disminución de velocidad en cada rebote
    this.deformacion = 0.9; // Factor de deformación
  }

  mostrar() {
    noStroke(); 
    if (this.tipo === 'circulo') {
      let diametroX = this.tamano * 20 * this.deformacion; // Aplicar deformación en el eje X
      let diametroY = this.tamano * 20 * this.deformacion; // Aplicar deformación en el eje Y
      ellipse(this.x, this.y, diametroX, diametroY);
    } else if (this.tipo === 'estrella') {
      let tamanoX = this.tamano * 20 * this.deformacion; // Aplicar deformación en el eje X
      let tamanoY = this.tamano * 20 * this.deformacion; // Aplicar deformación en el eje Y
      drawStar(this.x, this.y, tamanoX, tamanoY);
    }
  }

  actualizar() {
    this.velocidadY += 0.2; 
    this.x += this.velocidadX;
    this.y += this.velocidadY;
  }

  rebotar() {
    if (this.x < 0 || this.x > width) {
      this.velocidadX *= -1;
      this.deformacion = this.deformacion * 0.9; // Reducir la deformación al rebotar
    }
    if (this.y > height) {
      this.y = height;
      this.velocidadY *= -this.rebote; // Disminuir la velocidad vertical en cada rebote
      this.deformacion = this.deformacion * 0.9; // Reducir la deformación al rebotar
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocidadY *= -this.rebote; // Disminuir la velocidad vertical en cada rebote
      this.deformacion = this.deformacion * 0.9; // Reducir la deformación al rebotar
    }
    // Verificar colisión con otras formas
    for (let otraForma of formas) {
      if (otraForma !== this) {
        let d = dist(this.x, this.y, otraForma.x, otraForma.y);
        let sumaRadios = this.tamano * 20 * this.deformacion + otraForma.tamano * 20 * otraForma.deformacion;
        if (d < sumaRadios) {
          let tempX = this.velocidadX;
          let tempY = this.velocidadY;
          this.velocidadX = otraForma.velocidadX;
          this.velocidadY = otraForma.velocidadY;
          otraForma.velocidadX = tempX;
          otraForma.velocidadY = tempY;
          this.deformacion = this.deformacion * 0.9; // Reducir la deformación al rebotar
          otraForma.deformacion = otraForma.deformacion * 0.9; // Reducir la deformación al rebotar
        }
      }
    }
    this.deformacion = min(1.0, this.deformacion * 1.01);
  }
}

function drawStar(x, y, radius1, radius2) {
  let angle = TWO_PI / 5;
  let halfAngle = angle / 2;
  beginShape();
  for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

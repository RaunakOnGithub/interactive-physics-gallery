const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let items = [];
let mConstraint;
let boundaries = []; // Boundaries ko track karne ke liye array

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  engine = Engine.create();
  engine.world.gravity.y = 0;

  addBoundaries();

  // --- MOBILE DETECTION ---
  // Agar screen 600px se chhoti hai, toh mobile maano
  let isMobile = window.innerWidth < 600;

  // Mobile par kam items (8), Desktop par zyada (12-15)
  let itemCount = isMobile ? 8 : 12;

  for (let i = 0; i < itemCount; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);

    // Mobile par chhota size, Desktop par bada
    // Format: Item(x, y, imagePath, isMobile)
    items.push(new Item(x, y, `./assets/img${i + 1}.jpg`, isMobile));
  }

  // Mouse Interaction
  let canvasMouse = Mouse.create(document.body);
  canvasMouse.pixelRatio = pixelDensity();

  let options = {
    mouse: canvasMouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(engine.world, mConstraint);
}

function addBoundaries() {
  // Purani boundaries hatao (agar resize hua ho)
  if (boundaries.length > 0) {
    World.remove(engine.world, boundaries);
    boundaries = [];
  }

  const thickness = 50;

  // Nayi boundaries banao
  let floor = Bodies.rectangle(
    width / 2,
    height + thickness / 2,
    width,
    thickness,
    { isStatic: true }
  );
  let ceiling = Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
    isStatic: true,
  });
  let leftWall = Bodies.rectangle(
    -thickness / 2,
    height / 2,
    thickness,
    height,
    { isStatic: true }
  );
  let rightWall = Bodies.rectangle(
    width + thickness / 2,
    height / 2,
    thickness,
    height,
    { isStatic: true }
  );

  boundaries.push(floor, ceiling, leftWall, rightWall);
  World.add(engine.world, boundaries);
}

// --- WINDOW RESIZE FUNCTION ---
// Jab user browser chhota/bada karega, ye chalega
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  addBoundaries(); // Deewar wapas set karo nayi screen ke hisaab se
}

function draw() {
  background("black");
  Engine.update(engine);

  items.forEach((item) => {
    let d = dist(mouseX, mouseY, item.body.position.x, item.body.position.y);
    let isHovered = d < item.w; // Interaction radius based on item width

    if (isHovered && mConstraint.body !== item.body) {
      let forceVector = {
        x: item.body.position.x - mouseX,
        y: item.body.position.y - mouseY,
      };
      let len = Math.sqrt(
        forceVector.x * forceVector.x + forceVector.y * forceVector.y
      );
      forceVector.x /= len;
      forceVector.y /= len;
      let forceMagnitude = map(d, 0, item.w, 0.05, 0);
      Body.applyForce(item.body, item.body.position, {
        x: forceVector.x * forceMagnitude,
        y: forceVector.y * forceMagnitude,
      });
    }
    item.update(isHovered, mConstraint.body === item.body);
  });
}

function mouseWheel(event) {
  items.forEach((item) => {
    if (
      dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < item.w
    ) {
      let rotationSpeed = 0.15;
      let newAngle =
        item.body.angle + (event.delta > 0 ? rotationSpeed : -rotationSpeed);
      Body.setAngle(item.body, newAngle);
      return false;
    }
  });
}

class Item {
  constructor(x, y, imagePath, isMobile) {
    // --- SIZE LOGIC ---
    // Desktop: 200x225, Mobile: 120x135 (approx 60% size)
    this.w = isMobile ? 120 : 200;
    this.h = isMobile ? 135 : 225;

    let options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.001,
      angle: Math.random() * Math.PI * 2,
    };

    // Physics body ab dynamic size lega
    this.body = Bodies.rectangle(x, y, this.w, this.h, options);
    World.add(engine.world, this.body);

    this.div = document.createElement("div");
    this.div.className = "item";

    // JS se width/height set kar rahe hain taaki physics se match kare
    this.div.style.width = `${this.w}px`;
    this.div.style.height = `${this.h}px`;

    const img = document.createElement("img");
    img.src = imagePath;
    img.ondragstart = () => false;
    this.div.appendChild(img);
    document.body.appendChild(this.div);
  }

  update(isHovered, isDragged) {
    // Center offset adjust karo size ke hisaab se
    const x = this.body.position.x - this.w / 2;
    const y = this.body.position.y - this.h / 2;

    if (isDragged) {
      this.div.style.zIndex = 100;
      this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1.1)`;
      this.div.style.boxShadow = "0px 30px 60px rgba(0,0,0,0.6)";
      this.div.style.cursor = "grabbing";
    } else if (isHovered) {
      this.div.style.zIndex = 50;
      this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1.05)`;
      this.div.style.boxShadow = "0px 20px 40px rgba(0,0,0,0.4)";
      this.div.style.cursor = "grab";
    } else {
      this.div.style.zIndex = 10;
      this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1)`;
      this.div.style.boxShadow = "none";
      this.div.style.cursor = "default";
    }
  }
}

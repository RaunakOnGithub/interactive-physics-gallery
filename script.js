
// const Engine = Matter.Engine;
// const World = Matter.World;
// const Bodies = Matter.Bodies;
// const Body = Matter.Body;
// const Mouse = Matter.Mouse;
// const MouseConstraint = Matter.MouseConstraint;

// let engine;
// let items = [];
// let mConstraint; // Global variable for mouse interaction

// function setup() {
//   createCanvas(window.innerWidth, window.innerHeight);
//   engine = Engine.create();
//   engine.world.gravity.y = 0; // Floating (Zero Gravity)

//   addBoundaries();

//   // Create 12 items
//   for (let i = 0; i < 12; i++) {
//     let x = random(100, width - 100);
//     let y = random(100, height - 100);
//     items.push(new Item(x, y, `./assets/img${i + 1}.jpg`));
//   }

//   // --- NEW: Add Mouse Constraint for "Real" Dragging ---
//   // This lets you actually grab the cards like real objects
//   let canvasMouse = Mouse.create(document.body); // Use body to catch events over divs
//   canvasMouse.pixelRatio = pixelDensity(); // Fix for high-res screens
  
//   let options = {
//     mouse: canvasMouse,
//     constraint: {
//       stiffness: 0.2,
//       render: { visible: false }
//     }
//   };
//   mConstraint = MouseConstraint.create(engine, options);
//   World.add(engine.world, mConstraint);
// }

// function addBoundaries() {
//   const thickness = 50;
//   World.add(engine.world, [
//     Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
//     Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
//     Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
//     Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }),
//   ]);
// }

// function draw() {
//   background("black");
//   Engine.update(engine);

//   // Variable to track which item is currently being hovered/dragged
//   let hoveredItem = null;

//   items.forEach((item) => {
//     // Check distance for "Hover Repel" effect
//     let d = dist(mouseX, mouseY, item.body.position.x, item.body.position.y);
    
//     // --- SMOOTHNESS FIX: Gradient Force ---
//     // Instead of a hard On/Off, we scale force by distance.
//     if (d < 200) {
//       hoveredItem = item; // Mark this item as hovered for Z-index

//       let forceVector = {
//         x: item.body.position.x - mouseX,
//         y: item.body.position.y - mouseY,
//       };
      
//       // Normalize
//       let len = Math.sqrt(forceVector.x * forceVector.x + forceVector.y * forceVector.y);
//       forceVector.x /= len;
//       forceVector.y /= len;

//       // Force gets stronger as you get closer (Map distance 0-200 to strength 0.2-0)
//       // We clamp 'd' so force doesn't explode if d is near 0
//       let forceMagnitude = map(d, 0, 200, 0.05, 0); 
      
//       // Only apply repel force if we aren't currently dragging it
//       if (mConstraint.body !== item.body) {
//          Body.applyForce(item.body, item.body.position, {
//             x: forceVector.x * forceMagnitude,
//             y: forceVector.y * forceMagnitude
//          });
//       }
//     }
    
//     item.update(hoveredItem === item);
//   });
// }

// class Item {
//   constructor(x, y, imagePath) {
//     let options = {
//       frictionAir: 0.075, // High friction = smooth "sliding on ice" stop
//       restitution: 0.2,   // Low bounce
//       density: 0.001,
//       angle: Math.random() * Math.PI * 2,
//     };
//     this.body = Bodies.rectangle(x, y, 200, 225, options);
//     World.add(engine.world, this.body);

//     this.div = document.createElement("div");
//     this.div.className = "item";
    
//     const img = document.createElement("img");
//     img.src = imagePath;
//     // Prevent default browser dragging of the image itself
//     img.ondragstart = () => false; 
    
//     this.div.appendChild(img);
//     document.body.appendChild(this.div);
//   }

//   update(isHovered) {
//     const x = this.body.position.x - 100;
//     const y = this.body.position.y - 112.5;
    
//     // --- STACKING FIX: Z-Index ---
//     // If this item is hovered (or being dragged), bring it to front (z-index 100)
//     // Otherwise put it back to layer 10
//     if (isHovered || this.body === mConstraint.body) {
//         this.div.style.zIndex = 100;
//         // Optional: slight scale up for effect
//         this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1.05)`;
//         this.div.style.boxShadow = "0px 20px 40px rgba(0,0,0,0.5)"; // Add shadow when lifted
//     } else {
//         this.div.style.zIndex = 10;
//         this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1)`;
//         this.div.style.boxShadow = "none";
//     }
//   }
// }

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let items = [];
let mConstraint;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  engine = Engine.create();
  engine.world.gravity.y = 0; // Zero Gravity

  addBoundaries();

  for (let i = 0; i < 12; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    items.push(new Item(x, y, `./assets/img${i + 1}.jpg`));
  }

  // Mouse Interaction (Drag & Drop)
  let canvasMouse = Mouse.create(document.body);
  canvasMouse.pixelRatio = pixelDensity();
  
  let options = {
    mouse: canvasMouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(engine.world, mConstraint);
}

function addBoundaries() {
  const thickness = 50;
  World.add(engine.world, [
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }),
  ]);
}

function draw() {
  background("black");
  Engine.update(engine);

  items.forEach((item) => {
    // Check if mouse is close (for the "hover" effect)
    let d = dist(mouseX, mouseY, item.body.position.x, item.body.position.y);
    let isHovered = d < 200;

    // --- HOVER REPEL FORCE ---
    // Only push if we are NOT currently dragging this specific item
    if (isHovered && mConstraint.body !== item.body) {
      let forceVector = {
        x: item.body.position.x - mouseX,
        y: item.body.position.y - mouseY,
      };
      
      let len = Math.sqrt(forceVector.x * forceVector.x + forceVector.y * forceVector.y);
      forceVector.x /= len;
      forceVector.y /= len;

      let forceMagnitude = map(d, 0, 200, 0.05, 0); 
      
      Body.applyForce(item.body, item.body.position, {
        x: forceVector.x * forceMagnitude,
        y: forceVector.y * forceMagnitude
      });
    }
    
    // Pass 'isHovered' and 'isDragged' status to update function
    item.update(isHovered, mConstraint.body === item.body);
  });
}

// --- NEW FUNCTION: ROTATE ON SCROLL ---
function mouseWheel(event) {
  // Check which item is under the mouse
  items.forEach((item) => {
    if (dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150) {
        // Apply rotation based on scroll direction
        // event.delta returns + or - depending on scroll direction
        let rotationSpeed = 0.15; 
        let newAngle = item.body.angle + (event.delta > 0 ? rotationSpeed : -rotationSpeed);
        
        // Use Matter.Body.setAngle to instantly rotate
        Body.setAngle(item.body, newAngle);
        
        // Stop the browser from scrolling the page
        return false; 
    }
  });
}

class Item {
  constructor(x, y, imagePath) {
    let options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.001,
      angle: Math.random() * Math.PI * 2,
    };
    this.body = Bodies.rectangle(x, y, 200, 225, options);
    World.add(engine.world, this.body);

    this.div = document.createElement("div");
    this.div.className = "item";
    
    const img = document.createElement("img");
    img.src = imagePath;
    img.ondragstart = () => false; 
    this.div.appendChild(img);
    document.body.appendChild(this.div);
  }

  update(isHovered, isDragged) {
    const x = this.body.position.x - 100;
    const y = this.body.position.y - 112.5;
    
    // Logic: If dragged, it's definitely on top (zIndex 100)
    // If hovered, it pops up slightly (zIndex 50)
    // Otherwise, it sits back (zIndex 10)
    
    if (isDragged) {
        this.div.style.zIndex = 100;
        this.div.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${this.body.angle}rad) scale(1.1)`;
        this.div.style.boxShadow = "0px 30px 60px rgba(196, 164, 132, 0.3)";
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
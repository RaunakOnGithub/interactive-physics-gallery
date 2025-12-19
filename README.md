# Interactive Physics Gallery (Entropy)

An interactive, physics-based photo gallery built with **p5.js** and **Matter.js**. This project breaks away from static grids, allowing users to interact with "memories" as if they were physical polaroids scattered on a table.

🔗 **[Live Demo](https://interactive-gallery-section.netlify.app/)**

[![image.png](https://i.postimg.cc/wvJcXLzZ/image.png)](https://postimg.cc/CBhqYZzs)

## ✨ Features

* **Real Physics Engine:** Images have mass, friction, and restitution (bounciness).
* **Interactive Drag & Drop:** Users can grab, drag, and throw images across the canvas.
* **Scroll to Rotate:** Hover over an image and scroll to rotate it precisely.
* **Dynamic Stacking:** The active/hovered image always pops to the front (smart z-index management).
* **Responsive Physics:** Optimized force calculations for a smooth feel.

## 🛠️ Tech Stack

* **HTML5 & CSS3** (Manrope Typography)
* **JavaScript (ES6+)**
* **p5.js** - For canvas rendering and interaction loop.
* **Matter.js** - For 2D physics simulation (gravity, collision, rigid bodies).

## 🚀 How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/interactive-physics-gallery.git](https://github.com/your-username/interactive-physics-gallery.git)
    ```
2.  Navigate to the project folder:
    ```bash
    cd interactive-physics-gallery
    ```
3.  Open `index.html` in your browser.
    * *Tip: Use "Live Server" extension in VS Code for the best experience.*

## 🎨 Customization

* **Images:** Replace images in the `assets/` folder. Recommended count: 12-15 images.
* **Physics:** Tweak `frictionAir`, `restitution`, and `density` in `script.js` to change how "heavy" or "bouncy" the cards feel.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Created by [Your Name]*

# Snake Charmer 🐍✨

A classic game 'Snake' with reversed logic built for the FCC 'Remix' Game Jam
eat for this.

---

## 📖 About the Game

**Snake Charmer** is a spin on the classic arcade game Snake, created for a game jam with the theme "Flip the Script." Instead of controlling the snake, you control the food! Your goal is to lure and guide a simple greedy, auto-moving snake to help it grow as long as possible without crashing into the walls or its own body.

Can you place the food in the right spot to guide the snake safely through its ever-growing maze of a body?

---

## 🚀 Live Demo

A live version of this project can be viewed here: **[View Live Demo](https://snake-charmer-green.vercel.app/)**

---

## 🕹️ How to Play

Your objective is to keep the snake alive for as long as possible by guiding it to the food.
You lose the game if snake hits a wall or its own tail.

---

## 🎮 Controls
Use the **Arrow Keys** (`↑ ↓ ← →`) to move the food around the grid.

---

## Key Features

- [x] **Reversed Gameplay Mechanic:** A unique "Flip the Script" twist on the classic game where you control the food, not the snake (jam requirement).
- [x] **Simple Snake AI:** The snake follows a simple, deterministic "greedy" algorithm, turning the game from a test of reflexes into a strategic puzzle.
- [x] **Progressive Difficulty:** The snake's movement speed increases as your score goes up, demanding faster thinking and planning.
- [x] **Full Collision Detection:** The game ends if the snake runs into the outer walls or its own ever-growing body.
- [x] **Scoring and Infinite Growth:** Your score increases for every pellet the snake eats, and its body grows longer, shrinking the available space.
- [x] **Complete Game Loop:** Full state management for playing, game over, and restarting the game seamlessly.
- [x] **Code Comments:** Comments explaining the code, so others can learn. (jam requirement)

---

## 🛠️ Tech Stack

* **React:** Building component-based UI and managing application states.
* **Vite:** Serves as the modern, fast building frontend build tool.
* **JavaScript (ES6+):** Utilized for the core application logic.
* **HTML5 & CSS3:** The foundational languages for the structure and presentation.

---

## 🧑‍💻 Getting Started

To run this project on your own machine, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1.  Clone this repository:
    ```sh
    git clone https://github.com/gapn/snake-charmer
    ```
2.  Navigate to the project directory:
    ```sh
    cd snake-charmer
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Start the development server:
    ```sh
    npm run dev
    ```

---

## License

This project is licensed under the [MIT License](./LICENSE.txt).
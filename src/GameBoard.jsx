import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

// ==========================================================
// GameBoard.jsx
// Core component for the "Snake Charmer" game.
// Manages all game state, logic, rendering, and user input.
// ==========================================================

//game constants
const gridSize = 10;
const tileSize = 50; //in pixels

const GameBoard = () => {
    // STATE MANAGEMENT
    // snake is array of objects with x/y coordinates, first element is the head
    const [snake, setSnake] = useState([{ x: 5, y: 5}]); //snake starts in the middle
    // food is single object with x/y coordinates
    const [food, setFood] = useState({ x: 2, y: 2 }); //first food position
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    
    // ref is used to hold latest food position
    // game loop always knows where the food is without resetting the interval
    const foodRef = useRef(food);
    useEffect(() => {
        foodRef.current = food;
    }, [food]);

    // PLAYER INPUT
    // setting up and cleaning up keyboard event listener
    // depends on '[gameOver]', so that when game ends, it can re-run and use
    // the new 'gameOver' state to disable controls
    useEffect(() => {
        const handleKeyDown = (keystroke) => {
            //prevent player from moving food when game over
            if (gameOver) return;

            switch (keystroke.key) {
                case 'ArrowUp':
                    setFood(prevFood => ({ ...prevFood, y: Math.max(0, prevFood.y - 1) }));
                    break;
                case 'ArrowRight':
                    setFood(prevFood => ({ ...prevFood, x: Math.min(gridSize - 1, prevFood.x + 1) }));
                    break;
                case 'ArrowDown':
                    setFood(prevFood => ({ ...prevFood, y: Math.min(gridSize - 1, prevFood.y + 1) }));
                    break;
                case 'ArrowLeft':
                    setFood(prevFood => ({ ...prevFood, x: Math.max(0, prevFood.x - 1) }));
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameOver]); //disable controls when game ends

    // SNAKE MOVEMENT
    // main game loop, powered by setInterval
    // dependency array [gameOver] ensures interval is cleared when game ends
    useEffect(() => {
        if (gameOver) {
            return;
        }

        //snake moves based on timer interval
        const gameInterval = setInterval(() => {
            // using functional update 'setSnake(prevSnake => ...)' to ensure always
            // having latest snake state
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const neck = prevSnake[1];
                const newHead = { ...head };
                const currentFood = foodRef.current; //read food position from ref

                // deriving current direction by comparing head to neck
                // this way you dont need separate direction state variable
                let currentDirection = 'up'; //default direction for the first move, when no neck yet
                if (neck) {
                    if (head.y < neck.y) currentDirection = 'up';
                    else if (head.x > neck.x) currentDirection = 'right';
                    else if (head.y > neck.y) currentDirection = 'down';
                    else if (head.x < neck.x) currentDirection = 'left';
                }

                //simple greedy ai logic - snake always wants to move towards the food
                //snake tries to match food y position first, then x position -> predictable 'L-shaped' movement

                let nextMove = currentDirection; //default is moving straight
                //ideal move to get to food
                const wantsToGoUp = currentFood.y < head.y;
                const wantsToGoRight = currentFood.x > head.x;
                const wantsToGoDown = currentFood.y > head.y;
                const wantsToGoLeft = currentFood.x < head.x;

                //decide next move, no reversing
                if (currentDirection !== 'down' && wantsToGoUp) nextMove = 'up';
                else if (currentDirection !== 'left' && wantsToGoRight) nextMove = 'right';
                else if (currentDirection !== 'up' && wantsToGoDown) nextMove = 'down';
                else if (currentDirection !== 'right' && wantsToGoLeft) nextMove = 'left';

                //apply next move
                switch (nextMove) {
                    case 'up': newHead.y -= 1; break;
                    case 'right': newHead.x += 1; break;
                    case 'down': newHead.y += 1; break;
                    case 'left': newHead.x -= 1; break;
                }

                //check for collision with walls or snake
                if (
                    newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize 
                    || prevSnake.some(part => part.x === newHead.x && part.y === newHead.y)
                ) {
                    setGameOver(true);
                    return prevSnake; // return original snake to stop it from moving into the wall
                }

                //update snake to move it
                const newSnake = [newHead, ...prevSnake];
                
                //check for eating food
                if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
                    // if the head is on the food, grow snake by not removing the tail segment
                    setScore(prevScore => prevScore + 1);
                    setFood(generateFoodPosition(newSnake));
                } else {
                    // if not eating, normal move - remove tail segment
                    newSnake.pop();
                }

                return newSnake;
            });
        }, 500);

        return () => clearInterval(gameInterval);
    }, [gameOver]);

    // RENDERING GRID
    // rendering gridSize x gridSize of tiles
    // looping through each coordinate and apply CSS class of tile + 
    // class for snake part or food part
    const renderGrid = () => {
        const grid = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const isSnake = snake.some(part => 
                    part.x === col && part.y === row
                );
                const isFood = food.x === col && food.y === row;

                let classNameTile = 'tile';
                if (isSnake) {
                    classNameTile += ' snake-tile';
                } else if (isFood) {
                    classNameTile += ' food-tile'
                }
                
                grid.push(<div key={`${row}-${col}`} className={classNameTile}></div>);
            }
        }
        return grid
    };

    // FOOD POSITION
    // generating new valid position for food
    // utilizing do...while loop for ensuring the new spot isnt on the snake body
    const generateFoodPosition = (snakeBody) => {
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize),
            };
        } while (snakeBody.some(part => part.x === newFoodPosition.x && part.y === newFoodPosition.y));
        return newFoodPosition;
    };

    return (
        <div>
            <h1>Snake Charmer</h1>
            <p>Score: {score}</p>
            <div
                className='game-board'
                style={{
                    width: `${gridSize * tileSize}px`,
                    height: `${gridSize * tileSize}px`
                }}
            >
                {renderGrid()}
            </div>
            {gameOver && <div className='game-over'>Game over</div>}
        </div>
    );
};

export default GameBoard;
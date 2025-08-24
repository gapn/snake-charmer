import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

//game constants
const gridSize = 10;
const tileSize = 50; //in pixels

const GameBoard = () => {
    //state management
    const [snake, setSnake] = useState([{ x: 5, y: 5}]); //snake starts in the middle
    const [food, setFood] = useState({ x: 2, y: 2 }); //first food position
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    
    const foodRef = useRef(food); //create ref to hold the food position

    useEffect(() => {
        foodRef.current = food;
    }, [food]);

    //player input
    useEffect(() => {
        const handleKeyDown = (keystroke) => {
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
    }, []);

    //snake movement
    useEffect(() => {
        if (gameOver) {
            return;
        }

        //snake moves based on timer interval
        const gameInterval = setInterval(() => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const neck = prevSnake[1];
                const newHead = { ...head };
                const currentFood = foodRef.current; //read food position from ref

                let currentDirection = 'up'; //default direction for the first move
                if (neck) {
                    if (head.y < neck.y) currentDirection = 'up';
                    else if (head.x > neck.x) currentDirection = 'right';
                    else if (head.y > neck.y) currentDirection = 'down';
                    else if (head.x < neck.x) currentDirection = 'left';
                }

                //simple greedy ai logic
                //snake tries to match food x position first, then y position -> predictable 'L-shaped' movement

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
                    newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize || prevSnake.some(part => part.x === newHead.x && part.y === newHead.y)
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                //update snake to move it
                const newSnake = [newHead, ...prevSnake];
                
                //check for eating food
                if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
                    setScore(prevScore => prevScore + 1);
                    setFood(generateFoodPosition(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, 500);

        return () => clearInterval(gameInterval);
    }, [gameOver]);

    //rendering grid
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
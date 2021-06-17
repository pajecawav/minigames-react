import React, { useCallback, useEffect, useReducer } from "react";
import { Button } from "../../ui/Button";
import { classnames, randomNumber } from "../../utils";

const MAX_WIDTH = 8;
const MAX_HEIGHT = 5;

const INITIAL_CELLS_AMOUNT = 4;

type CellType = {
    x: number;
    y: number;
    value: number;
};

const generateCells = (
    n: number,
    width: number,
    height: number
): CellType[] => {
    const cells: CellType[] = [];
    for (let i = 0; i < n; i++) {
        while (true) {
            const x = randomNumber(0, width);
            const y = randomNumber(0, height);
            if (
                cells.findIndex((cell) => cell.x === x && cell.y === y) === -1
            ) {
                cells.push({ x, y, value: i + 1 });
                break;
            }
        }
    }
    return cells;
};

type State = {
    state: "not_started" | "waiting" | "clicking" | "done";
    cells: CellType[] | null;
    currentNumber: number;
    level: number;
};

type Action =
    | { type: "new_game" }
    | { type: "next_level" }
    | { type: "remove_number"; value: number }
    | { type: "end_game" };

const visualMemoryGameInitialState: State = {
    state: "not_started",
    cells: null,
    currentNumber: 1,
    level: 0,
};

const visualMemoryGameReducer = (game: State, action: Action): State => {
    switch (action.type) {
        case "new_game":
            return {
                state: "waiting",
                cells: generateCells(
                    INITIAL_CELLS_AMOUNT,
                    MAX_WIDTH,
                    MAX_HEIGHT
                ),
                currentNumber: 1,
                level: 1,
            };
        case "remove_number":
            return {
                ...game,

                cells: game.cells
                    ? game.cells.filter((cell) => cell.value !== action.value)
                    : null,
                currentNumber: action.value + 1,
            };
        case "next_level":
            return {
                state: "waiting",
                cells: generateCells(
                    Math.min(
                        game.level + INITIAL_CELLS_AMOUNT,
                        MAX_WIDTH * MAX_HEIGHT
                    ),
                    MAX_WIDTH,
                    MAX_HEIGHT
                ),
                currentNumber: 1,
                level: game.level + 1,
            };
        case "end_game":
            return {
                ...visualMemoryGameInitialState,
                state: "done",
                level: game.level,
            };
    }
};

type CellProps = {
    value: number | null;
    visible?: boolean;
    onClick?: (value: number) => void;
};

const Cell = ({ value, visible = false, onClick }: CellProps) => {
    return (
        <div
            className={classnames(
                "flex items-center justify-center text-secondary sm:text-5xl rounded-md border-4 transition-all duration-100",
                value
                    ? "border-primary-600 cursor-pointer hover:border-secondary"
                    : "border-transparent",
                value && !visible && "border-secondary bg-secondary"
            )}
            onClick={() => {
                if (value) onClick?.(value);
            }}
        >
            {visible && value}
            {/* invisible div to make a square shape */}
            <div className="h-0 py-[50%]" />
        </div>
    );
};

export const VisualMemoryGame = () => {
    const [game, dispatchGameEvent] = useReducer(
        visualMemoryGameReducer,
        visualMemoryGameInitialState
    );

    const startNewGame = useCallback(() => {
        dispatchGameEvent({ type: "new_game" });
    }, []);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                startNewGame();
            }
        };
        document.addEventListener("keypress", handleKeyPress);
        return () => document.removeEventListener("keypress", handleKeyPress);
    }, [startNewGame]);

    const handleCellClick = useCallback(
        (value: number) => {
            if (value === game.currentNumber) {
                if (game.cells!.length === 1) {
                    dispatchGameEvent({ type: "next_level" });
                } else {
                    dispatchGameEvent({ type: "remove_number", value });
                }
            } else {
                dispatchGameEvent({ type: "end_game" });
            }
        },
        [game.cells, game.currentNumber]
    );

    const cellRows = [];
    for (let y = 0; y < MAX_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < MAX_WIDTH; x++) {
            const gameFieldCell = game.cells?.find(
                (cell) => cell.x === x && cell.y === y
            );
            const key = y * MAX_WIDTH + x;
            if (gameFieldCell) {
                row.push(
                    <Cell
                        value={gameFieldCell.value}
                        visible={game.currentNumber === 1}
                        onClick={handleCellClick}
                        key={key}
                    />
                );
            } else {
                row.push(<Cell value={null} key={key} />);
            }
        }
        cellRows.push(row);
    }

    return (
        <div className="flex items-center justify-center w-full m-auto text-3xl">
            {game.state === "not_started" && (
                <Button text="Start" onClick={startNewGame} />
            )}
            {(game.state === "waiting" || game.state === "clicking") && (
                <div
                    className="grid w-full gap-2"
                    style={{
                        gridTemplateRows: `repeat(${MAX_HEIGHT}, minmax(0, 1fr))`,
                        gridTemplateColumns: `repeat(${MAX_WIDTH}, minmax(0, 1fr))`,
                    }}
                >
                    {cellRows.map((row, index) => (
                        <React.Fragment key={index}>{row}</React.Fragment>
                    ))}
                </div>
            )}
            {game.state === "done" && (
                <div className="flex flex-col items-center gap-8 animate-appear">
                    <div className="text-6xl">
                        Level{" "}
                        <span className="text-secondary">{game.level}</span>
                    </div>
                    <Button text="Restart" onClick={startNewGame} />
                </div>
            )}
        </div>
    );
};

import React, { useCallback, useEffect, useReducer } from "react";
import { Button } from "../../ui/Button";
import { Cell } from "./Cell";
import {
    CellStatusEnum,
    patternMemoryGameInitialState,
    patternMemoryGameReducer,
} from "./patternMemoryGameReducer";

const SHOW_CELLS_TIMEOUT_MS = 2000;
const DELAY_BETWEEN_LEVELS_MS = 1000;

export const PatternMemoryGame = () => {
    const [game, dispatchGameEvent] = useReducer(
        patternMemoryGameReducer,
        patternMemoryGameInitialState
    );

    const startNewGame = useCallback(() => {
        dispatchGameEvent({ type: "new_game" });
    }, []);

    // TODO: fix timeout hell
    useEffect(() => {
        if (game.state === "waiting") {
            const timeoutID = setTimeout(
                () => dispatchGameEvent({ type: "show_cells" }),
                DELAY_BETWEEN_LEVELS_MS
            );
            return () => clearTimeout(timeoutID);
        } else if (game.state === "showing") {
            const timeoutID = setTimeout(
                () => dispatchGameEvent({ type: "hide_cells" }),
                SHOW_CELLS_TIMEOUT_MS
            );
            return () => clearTimeout(timeoutID);
        }
    }, [game.state]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                startNewGame();
            }
        };
        document.addEventListener("keypress", handleKeyPress);
        return () => document.removeEventListener("keypress", handleKeyPress);
    }, [startNewGame]);

    const handleCellClick = (y: number, x: number) => {
        if (!game.cells || game.state !== "clicking") return;

        if (game.cells[y][x] === CellStatusEnum.empty) {
            dispatchGameEvent({ type: "end_game" });
        } else if (game.cells[y][x] === CellStatusEnum.revealed) {
            return;
        } else {
            const isLastCell = game.hiddenCellsAmount === 1;

            dispatchGameEvent({
                type: "reveal_cell",
                y,
                x,
            });

            if (isLastCell) {
                const timeoutID = setTimeout(() => {
                    dispatchGameEvent({ type: "next_level" });
                }, DELAY_BETWEEN_LEVELS_MS);
                return () => clearTimeout(timeoutID);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full text-3xl">
            {game.state === "not_started" && (
                <Button text="Start" onClick={startNewGame} />
            )}
            {["waiting", "showing", "clicking"].includes(game.state) && (
                <>
                    <div className="mb-4 text-3xl">
                        Level{" "}
                        <span className="text-secondary">{game.level}</span>
                    </div>
                    <div
                        className="grid w-full gap-2"
                        style={{
                            gridTemplateRows: `repeat(${
                                game.cells!.length
                            }, minmax(0, 1fr))`,
                            gridTemplateColumns: `repeat(${
                                game.cells!.length
                            }, minmax(0, 1fr))`,
                        }}
                    >
                        {game.cells!.map((cellsRow, y) => (
                            <React.Fragment key={y}>
                                {cellsRow.map((cell, x) => (
                                    <Cell
                                        key={x}
                                        isOpen={
                                            (game.state === "showing" &&
                                                cell ===
                                                    CellStatusEnum.hidden) ||
                                            cell === CellStatusEnum.revealed
                                        }
                                        onClick={() => {
                                            handleCellClick(y, x);
                                        }}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </>
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

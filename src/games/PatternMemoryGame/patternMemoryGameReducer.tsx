import { randomNumber } from "../../utils";

export const INITIAL_SIZE = 3;
const CELLS_PERCENTAGE = 0.35;

export enum CellStatusEnum {
    empty = "empty",
    hidden = "hidden",
    revealed = "revealed",
}

export type Grid = CellStatusEnum[][];

const generateGrid = (
    cellsAmount: number,
    width: number,
    height: number
): Grid => {
    const cells: Grid = [];

    for (let i = 0; i < height; i++) {
        cells.push(new Array(width).fill("empty"));
    }

    for (let i = 0; i < cellsAmount; i++) {
        while (true) {
            const x = randomNumber(0, width);
            const y = randomNumber(0, height);
            if (cells[y][x] === CellStatusEnum.empty) {
                cells[y][x] = CellStatusEnum.hidden;
                break;
            }
        }
    }

    return cells;
};

type State = {
    state: "not_started" | "waiting" | "showing" | "clicking" | "done";
    cells: Grid | null;
    hiddenCellsAmount: number;
    level: number;
};

type Action =
    | { type: "new_game" }
    | { type: "show_cells" }
    | { type: "hide_cells" }
    | { type: "reveal_cell"; y: number; x: number }
    | { type: "next_level" }
    | { type: "end_game" };

export const patternMemoryGameInitialState: State = {
    state: "not_started",
    cells: null,
    hiddenCellsAmount: 0,
    level: 0,
};

export const patternMemoryGameReducer = (
    game: State,
    action: Action
): State => {
    switch (action.type) {
        case "new_game": {
            const hiddenCellsAmount = Math.floor(
                INITIAL_SIZE * INITIAL_SIZE * CELLS_PERCENTAGE
            );
            return {
                ...game,
                state: "waiting",
                cells: generateGrid(
                    hiddenCellsAmount,
                    INITIAL_SIZE,
                    INITIAL_SIZE
                ),
                hiddenCellsAmount,
                level: 1,
            };
        }
        case "show_cells":
            return { ...game, state: "showing" };
        case "hide_cells":
            return { ...game, state: "clicking" };
        case "reveal_cell": {
            const { y, x } = action;
            if (!game.cells || game.cells[y][x] === CellStatusEnum.empty) {
                throw new Error("Cell is empty");
            }
            if (game.cells[y][x] === CellStatusEnum.hidden) {
                game.cells[y][x] = CellStatusEnum.revealed;
                game.hiddenCellsAmount--;
            }
            return { ...game };
        }
        case "next_level": {
            const size = INITIAL_SIZE + game.level;
            const hiddenCellsAmount = Math.floor(
                size * size * CELLS_PERCENTAGE
            );
            return {
                state: "waiting",
                cells: generateGrid(hiddenCellsAmount, size, size),
                hiddenCellsAmount,
                level: game.level + 1,
            };
        }
        case "end_game":
            return {
                ...patternMemoryGameInitialState,
                state: "done",
                level: game.level,
            };
    }
};

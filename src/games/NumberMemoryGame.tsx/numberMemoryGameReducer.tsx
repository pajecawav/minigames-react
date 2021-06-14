import { randomDigits } from "../../utils";

type State = {
    state:
        | "not_started"
        | "showing_number"
        | "waiting_input"
        | "finished_level"
        | "done";
    number: string | null;
    level: number;
};

type Action =
    | { type: "new_game" }
    | { type: "finish" }
    | { type: "next_level" }
    | { type: "wait_input" };

export const numberMemoryGameInitialState: State = {
    state: "not_started",
    number: null,
    level: 0,
};

export const numberMemoryGameReducer = (game: State, action: Action): State => {
    switch (action.type) {
        case "new_game":
            return {
                ...game,
                state: "showing_number",
                number: randomDigits(1),
                level: 1,
            };
        case "next_level":
            return {
                ...game,
                state: "showing_number",
                number: randomDigits(game.level + 1),
                level: game.level + 1,
            };
        case "wait_input":
            return {
                ...game,
                state: "waiting_input",
            };
        case "finish":
            return {
                ...game,
                state: "done",
            };
    }
};

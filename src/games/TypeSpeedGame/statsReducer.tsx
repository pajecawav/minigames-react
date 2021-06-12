type State = {
    state: "waiting" | "started" | "done";
    typedLetters: number;
    typedWords: number;
    lastCharacterIsIncorrect: boolean;
    startTime: number | null;
    endTime: number | null;
};

type Action =
    | { type: "reset" }
    | { type: "next_letter"; isNextWord: boolean }
    | { type: "incorrect_letter" }
    | { type: "stop" };

export const statsInitialState: State = {
    state: "waiting",
    typedLetters: 0,
    typedWords: 0,
    lastCharacterIsIncorrect: false,
    startTime: null,
    endTime: null,
};

export const statsReducer = (stats: State, action: Action): State => {
    switch (action.type) {
        case "reset":
            return statsInitialState;
        case "next_letter":
            return {
                ...stats,
                state: "started",
                typedLetters: stats.typedLetters + 1,
                typedWords: action.isNextWord
                    ? stats.typedWords + 1
                    : stats.typedWords,
                lastCharacterIsIncorrect: false,
                startTime:
                    stats.startTime === null ? Date.now() : stats.startTime,
            };
        case "incorrect_letter":
            return {
                ...stats,
                lastCharacterIsIncorrect: true,
                typedLetters: stats.typedLetters + 1,
            };
        case "stop":
            return {
                ...stats,
                state: "done",
                endTime: Date.now(),
            };
    }
};

import { memo } from "react";
import { classnames } from "../../utils";

export type LetterState = "correct" | "incorrect" | "active" | "not_typed";

type LetterProps = {
    letter: string;
    state: LetterState;
};

const stateClassnames = {
    correct: "text-primary-200",
    incorrect: "bg-red-400 text-primary-700",
    active: "bg-secondary text-primary-700",
    not_typed: "text-primary-500",
};

export const Letter = memo(({ letter, state }: LetterProps) => (
    <span className={classnames("whitespace-pre-wrap", stateClassnames[state])}>
        {letter}
    </span>
));

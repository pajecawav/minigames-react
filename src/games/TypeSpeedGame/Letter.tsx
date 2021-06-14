import { memo } from "react";
import { classnames } from "../../utils";

export type LetterState = "correct" | "incorrect" | "not_typed";

type LetterProps = {
    letter: string;
    state: LetterState;
    id?: string;
};

const stateClassnames = {
    correct: "text-primary-200",
    incorrect: "text-primary-700",
    not_typed: "text-primary-500",
};

export const Letter = memo(({ letter, state, id }: LetterProps) => (
    <span
        className={classnames(
            "whitespace-pre-wrap transition-colors duration-50",
            stateClassnames[state]
        )}
        id={id}
    >
        {letter}
    </span>
));

import { useCallback, useEffect, useReducer, useState } from "react";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import { classnames, countWords } from "../../utils";
import { Letter, LetterState } from "./Letter";
import { ResultBlock } from "./ResultBlock";
import { statsInitialState, statsReducer } from "./statsReducer";

export const TypeSpeedGame = () => {
    const [textData, setTextData] =
        useState<null | { text: string; wordsCount: number }>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stats, dispatchStatsEvent] = useReducer(
        statsReducer,
        statsInitialState
    );

    const startNewTest = useCallback(() => {
        fetch("https://api.quotable.io/random")
            .then((response) => response.json())
            .then((json) => {
                const text: string = json.content.replaceAll("  ", " ");
                const wordsCount = countWords(text);
                setTextData({ text, wordsCount });
                setCurrentIndex(0);
                dispatchStatsEvent({ type: "reset" });
            });
    }, []);

    useEffect(() => {
        const recalculateWpm = () =>
            dispatchStatsEvent({ type: "recalculate_wpm" });
        const intervalId = setInterval(recalculateWpm, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        startNewTest();
    }, [startNewTest]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (!textData) return;

            event.preventDefault();

            const key = event.key;
            const currentLetter = textData?.text[currentIndex];

            if (stats.state !== "done") {
                if (key === currentLetter) {
                    setCurrentIndex(currentIndex + 1);

                    dispatchStatsEvent({
                        type: "next_letter",
                        isNextWord: key === " ",
                    });

                    if (currentIndex + 1 >= textData?.text.length) {
                        dispatchStatsEvent({ type: "stop" });
                    }
                } else {
                    dispatchStatsEvent({ type: "incorrect_letter" });
                }
            }

            if (key === "Enter") {
                setTextData(null);
                startNewTest();
            }
        },
        [textData, currentIndex, startNewTest, stats.state]
    );

    // add key press event listener
    useEffect(() => {
        document.body.addEventListener("keypress", handleKeyPress);
        return () =>
            document.body.removeEventListener("keypress", handleKeyPress);
    }, [textData, handleKeyPress]);

    // caret animation
    const moveCaret = useCallback(() => {
        const caret = document.getElementById("caret");
        const activeLetterElem = document.getElementById("active_letter");
        if (caret && activeLetterElem) {
            caret.style.left = activeLetterElem.offsetLeft + "px";
            caret.style.top = activeLetterElem.offsetTop + "px";
        }
    }, []);

    useEffect(() => {
        moveCaret();
    }, [currentIndex, moveCaret]);

    useEffect(() => {
        window.onresize = moveCaret;
        return () => {
            window.onresize = null;
        };
    }, [moveCaret]);

    // quote loading placeholder
    if (textData === null) {
        return (
            <SpinnerIcon className="w-40 m-auto text-secondary animate-spin" />
        );
    }

    const accuracy =
        currentIndex === 0
            ? 100
            : Math.round((currentIndex / stats.typedLetters) * 100);

    const renderedLetters = textData.text.split("").map((letter, index) => {
        let state: LetterState = "not_typed";
        if (index < currentIndex) {
            state = "correct";
        } else if (index === currentIndex && stats.lastCharacterIsIncorrect) {
            state = "incorrect";
        }

        return (
            <Letter
                letter={letter}
                state={state}
                key={index}
                id={index === currentIndex ? "active_letter" : undefined}
            />
        );
    });

    return (
        <div className="w-full m-auto text-3xl">
            {stats.state === "done" ? (
                <ResultBlock wpm={stats.wpm} accuracy={accuracy} />
            ) : (
                <div className="flex flex-col gap-8">
                    <div
                        className={classnames(
                            "text-center text-8xl text-primary-500",
                            stats.state === "waiting"
                                ? "opacity-0"
                                : "animate-appear-fast"
                        )}
                    >
                        {stats.typedWords}/{textData.wordsCount}
                    </div>
                    <div className="relative font-mono leading-10">
                        <div
                            id="caret"
                            className={classnames(
                                "absolute text-transparent transition-all duration-100 transform",
                                stats.lastCharacterIsIncorrect
                                    ? "bg-error"
                                    : "bg-secondary"
                            )}
                            style={{ zIndex: -1 }}
                        >
                            {/* add invisible letter to preserve the width and height */}
                            {"a"}
                        </div>
                        {renderedLetters}
                    </div>
                    <div
                        className={classnames(
                            "text-center text-8xl text-primary-500",
                            stats.state === "waiting"
                                ? "opacity-0"
                                : "animate-appear-fast"
                        )}
                    >
                        {stats.wpm} {accuracy}%
                    </div>
                </div>
            )}
        </div>
    );
};

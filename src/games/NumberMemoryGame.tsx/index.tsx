import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { gameInitialState, gameReducer } from "./gameReducer";

const SHOW_NUMBERS_TIMEOUT = 3000;

export const NumberMemoryGame = () => {
    const [game, dispatchGameEvent] = useReducer(gameReducer, gameInitialState);
    const [number, setNumber] = useState("");
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let animationFrameRequestId: number | null = null;

        if (game.state === "showing_number") {
            const started = Date.now();

            const drawProgressBar = () => {
                const passedMS = Date.now() - started;

                if (passedMS >= SHOW_NUMBERS_TIMEOUT) {
                    dispatchGameEvent({ type: "wait_input" });
                    setNumber("");
                    return;
                }

                const percentage =
                    100 -
                    Math.round((passedMS / SHOW_NUMBERS_TIMEOUT) * 100 * 1000) /
                        1000;

                if (progressBarRef.current) {
                    progressBarRef.current.style.width = `${percentage}%`;
                }

                animationFrameRequestId =
                    requestAnimationFrame(drawProgressBar);
            };

            animationFrameRequestId = requestAnimationFrame(drawProgressBar);

            return () => {
                if (animationFrameRequestId) {
                    cancelAnimationFrame(animationFrameRequestId);
                }
            };
        } else if (game.state === "done" || game.state === "not_started") {
            const handleKeyPress = (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    dispatchGameEvent({ type: "new_game" });
                }
            };
            document.addEventListener("keypress", handleKeyPress);
            return () =>
                document.removeEventListener("keypress", handleKeyPress);
        }
    }, [game.state]);

    const handleSubmitNumber = () => {
        if (!number) return;

        if (number === game.number) {
            dispatchGameEvent({ type: "next_level" });
            setNumber("");
        } else {
            dispatchGameEvent({ type: "finish" });
        }
    };

    return (
        <div className="flex items-center m-auto text-3xl">
            {game.state === "not_started" && (
                <Button
                    text="Start"
                    onClick={() => dispatchGameEvent({ type: "new_game" })}
                />
            )}
            {game.state === "showing_number" && (
                <div className="flex flex-col items-center gap-4">
                    <div className="select-none text-7xl text-secondary">
                        {game.number}
                    </div>
                    <div className="h-1 rounded-full w-60 bg-primary-500">
                        <div
                            className="h-full rounded-full bg-secondary"
                            ref={progressBarRef}
                        />
                    </div>
                </div>
            )}
            {game.state === "waiting_input" && (
                <div className="flex flex-col items-center gap-4">
                    <div>What was the number?</div>
                    <Input
                        className="text-center w-80"
                        value={number}
                        autoFocus
                        onChange={(value) => setNumber(value)}
                        onEnterPressed={handleSubmitNumber}
                    />
                    <Button text="Submit" onClick={handleSubmitNumber} />
                </div>
            )}
            {game.state === "done" && (
                <div className="flex flex-col items-center gap-8 animate-appear">
                    <div className="text-6xl">
                        Level{" "}
                        <span className="text-secondary">{game.level}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div>Number</div>
                        <div className="text-secondary">{game.number}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div>Your Answer</div>
                        <div className="line-through text-error">{number}</div>
                    </div>
                    <Button
                        text="Restart"
                        onClick={() => dispatchGameEvent({ type: "new_game" })}
                    />
                </div>
            )}
        </div>
    );
};

import { useEffect, useReducer, useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { memoryGameInitialState, memoryGameReducer } from "./gameReducer";

const SHOW_NUMBERS_TIMEOUT_MS = 3000;

export const NumberMemoryGame = () => {
    const [game, dispatchGameEvent] = useReducer(
        memoryGameReducer,
        memoryGameInitialState
    );
    const [number, setNumber] = useState("");

    useEffect(() => {
        if (game.state === "showing_number") {
            const cb = () => dispatchGameEvent({ type: "wait_input" });
            const timeoutId = setTimeout(cb, SHOW_NUMBERS_TIMEOUT_MS);
            return () => clearTimeout(timeoutId);
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
                            style={{
                                animation: `shrink ${SHOW_NUMBERS_TIMEOUT_MS}ms linear`,
                            }}
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
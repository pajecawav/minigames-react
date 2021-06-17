import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { classnames } from "../../utils";

const MIN_FLASH_TIMEOUT_MS = 3000;
const MAX_FLASH_TIMEOUT_MS = 7000;

type ReactionTimeGateState =
    | "not_started"
    | "waiting_flash"
    | "waiting_click"
    | "done";

export const ReactionTimeGame = () => {
    const [gameState, setGameState] =
        useState<ReactionTimeGateState>("not_started");
    const timeFlashedRef = useRef<number | null>(null);
    const timeClickedRef = useRef<number | null>(null);

    const restartGame = useCallback(() => {
        timeFlashedRef.current = null;
        timeClickedRef.current = null;
        setGameState("waiting_flash");
    }, []);

    useEffect(() => {
        if (gameState === "waiting_flash") {
            const timeout =
                MIN_FLASH_TIMEOUT_MS +
                Math.random() * (MAX_FLASH_TIMEOUT_MS - MIN_FLASH_TIMEOUT_MS);

            const flash = () => {
                setGameState("waiting_click");
            };

            const timeoutId = setTimeout(flash, timeout);
            return () => clearTimeout(timeoutId);
        } else if (gameState === "waiting_click") {
            timeFlashedRef.current = Date.now();
        }
    }, [gameState]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (
                (gameState === "done" || gameState === "not_started") &&
                event.key === "Enter"
            ) {
                restartGame();
            }
        };
        document.addEventListener("keypress", handleKeyPress);
        return () => document.removeEventListener("keypress", handleKeyPress);
    }, [gameState, restartGame]);

    const handleClick = () => {
        if (gameState === "waiting_flash" || gameState === "waiting_click") {
            timeClickedRef.current = Date.now();
            setGameState("done");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full gap-6 m-auto text-3xl">
            {gameState === "not_started" && (
                <Button text="Start" onClick={restartGame} />
            )}
            {(gameState === "waiting_flash" ||
                gameState === "waiting_click") && (
                <button
                    className={classnames(
                        "flex items-center justify-center w-full rounded-md h-80",
                        gameState === "waiting_flash"
                            ? "bg-error"
                            : "bg-green-300"
                    )}
                    onClick={handleClick}
                >
                    {gameState === "waiting_flash" ? (
                        <div className="text-6xl text-primary-200">
                            Wait for green
                        </div>
                    ) : (
                        <div className="text-6xl text-primary-600">Click</div>
                    )}
                </button>
            )}
            {gameState === "done" && (
                <>
                    <div className="text-6xl text-center">
                        {timeFlashedRef.current ? (
                            <>
                                <span className="text-secondary">
                                    {timeClickedRef.current! -
                                        timeFlashedRef.current}
                                </span>{" "}
                                MS
                            </>
                        ) : (
                            <span className="text-error">Clicked too soon</span>
                        )}
                    </div>
                    <Button text="Restart" onClick={restartGame} />
                </>
            )}
        </div>
    );
};

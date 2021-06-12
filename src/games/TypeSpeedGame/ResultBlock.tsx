type ResultBlockProps = {
    wpm: number;
    accuracy: number;
};

export const ResultBlock = ({ wpm, accuracy }: ResultBlockProps) => {
    return (
        <div className="flex flex-col gap-4 text-center animate-appear">
            <div className="text-8xl text-primary-500">
                wpm: <span className="text-secondary">{wpm}</span>
            </div>
            <div className="text-8xl text-primary-500">
                acc: <span className="text-secondary">{accuracy}</span>%
            </div>
            <div className="text-primary-500">
                press <span className="text-secondary">enter</span> to restart
            </div>
        </div>
    );
};

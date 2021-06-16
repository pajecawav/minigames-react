import { classnames } from "../../utils";

type CellProps = {
    isOpen: boolean;
    onClick?: () => void;
};

export const Cell = ({ isOpen, onClick }: CellProps) => (
    <div
        className={classnames(
            "h-0 py-[50%] rounded-md cursor-pointer transform transition-all duration-300 ease-out",
            isOpen ? "bg-secondary rotate-x-180" : "rotate-0 bg-primary-600"
        )}
        onClick={() => onClick?.()}
    />
);

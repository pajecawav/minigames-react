import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { classnames } from "../utils";

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    text: string;
};

export const Button = ({ text, className, ...props }: ButtonProps) => (
    <button
        className={classnames(
            "px-6 py-2 bg-secondary text-primary-700 rounded-xl transition-all duration-300 hover:bg-primary-400",
            className
        )}
        {...props}
    >
        {text}
    </button>
);

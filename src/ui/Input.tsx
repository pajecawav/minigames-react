import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import { classnames } from "../utils";

export type InputProps = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
> & {
    className?: string;
    onChange?: (value: string) => void;
    onEnterPressed?: (event: KeyboardEvent) => void;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, onChange, onEnterPressed, children, ...props }, ref) => {
        return (
            <input
                className={classnames(
                    "px-2 py-1 bg-primary-600 placeholder-primary-400 border-2 transition-colors duration-100 border-primary-600 rounded outline-none appearance-none font-sm text-primary-200 focus:border-secondary",
                    className
                )}
                size={1}
                onChange={(event) => onChange?.(event.target.value)}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        onEnterPressed?.(event as any);
                    }
                }}
                {...props}
                ref={ref}
            />
        );
    }
);
